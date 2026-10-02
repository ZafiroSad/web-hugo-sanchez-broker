"""Descarga las fotos de cada propiedad desde su publicación de Instagram.

Corre en GitHub Actions: la red de las sesiones en la nube no llega a Instagram.
Por cada propiedad de propiedades.json:
  - si la publicación es un carrusel, baja todas sus fotos a la mayor resolución;
  - si es un reel, baja la portada y el video, y saca del video los cuadros más
    nítidos, repartidos a lo largo del recorrido y sin la cara de Hugo en primer plano.
Deja todo en fotos/<id>/ con un manifiesto, para elegir después a mano.
"""
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = 'fotos'
UA_NAV = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
          '(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36')
UA_BOTS = ['facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
           'Twitterbot/1.0']
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
CUADROS_POR_REEL = 16
try:
    CARAS = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
except AttributeError:  # OpenCV sin el detector clásico: se elige solo por nitidez
    CARAS = None


def pedir(url, ua=UA_NAV, intentos=3):
    for intento in range(intentos):
        req = urllib.request.Request(url, headers={
            'User-Agent': ua,
            'Accept': 'text/html,application/xhtml+xml,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
        })
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and intento < intentos - 1:
                time.sleep(8 * (intento + 1))
                continue
            return e.code, b''
        except Exception:  # noqa: BLE001
            if intento < intentos - 1:
                time.sleep(5)
                continue
            return -1, b''
    return -1, b''


def medio(html, code):
    dec = json.JSONDecoder()
    for m in re.finditer(r'\{"__bbox":', html):
        try:
            obj, _ = dec.raw_decode(html, m.start())
        except ValueError:
            continue
        data = (((obj.get('__bbox') or {}).get('result') or {}).get('data') or {})
        x = data.get('xig_polaris_media')
        if x and x.get('code') == code:
            return x.get('if_not_gated_logged_out') or x
    return None


def ficha(code):
    for ua in UA_BOTS:
        estado, cuerpo = pedir(f'https://www.instagram.com/p/{code}/', ua)
        if estado == 200:
            y = medio(cuerpo.decode('utf-8', 'replace'), code)
            if y:
                return y
        time.sleep(4)
    return None


def mejor_imagen(item):
    candidatos = (item.get('image_versions2') or {}).get('candidates') or []
    if not candidatos:
        return None
    con_ancho = [c for c in candidatos if c.get('width')]
    if con_ancho:
        return max(con_ancho, key=lambda c: c['width'])['url']
    return candidatos[0]['url']  # sin medidas: el primero es el original


def guardar_imagen(datos, ruta, lado_max=1600):
    from io import BytesIO
    img = Image.open(BytesIO(datos)).convert('RGB')
    img.thumbnail((lado_max, lado_max), Image.LANCZOS)
    img.save(ruta, 'JPEG', quality=86, optimize=True, progressive=True)
    return img.size


def cuadros_del_video(video, carpeta, n=CUADROS_POR_REEL, caras=False):
    """Saca un cuadro cada 1,2 s, puntúa nitidez y caras, y elige n repartidos en el tiempo."""
    tmp = os.path.join('/tmp', 'cuadros', os.path.basename(carpeta))
    os.makedirs(tmp, exist_ok=True)
    subprocess.run([FFMPEG, '-v', 'error', '-i', video, '-vf', 'fps=1/1.2,scale=1080:-2',
                    '-q:v', '2', os.path.join(tmp, '%04d.jpg')], check=False)
    archivos = sorted(f for f in os.listdir(tmp) if f.endswith('.jpg'))
    puntuados = []
    for i, nombre in enumerate(archivos):
        img = cv2.imread(os.path.join(tmp, nombre))
        if img is None:
            continue
        gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        chico = cv2.resize(gris, (360, int(360 * gris.shape[0] / gris.shape[1])))
        nitidez = float(cv2.Laplacian(chico, cv2.CV_64F).var())
        brillo, contraste = float(chico.mean()), float(chico.std())
        cara = bool(CARAS is not None and len(CARAS.detectMultiScale(chico, scaleFactor=1.1, minNeighbors=6,
                                                                      minSize=(36, 36))))
        puntuados.append({'archivo': nombre, 'segundo': round(i * 1.2, 1), 'nitidez': round(nitidez, 1),
                          'brillo': round(brillo), 'contraste': round(contraste), 'cara': cara,
                          'miniatura': cv2.resize(chico, (24, 42)).astype(np.float32)})
    if not puntuados:
        return []
    utiles = [p for p in puntuados if 30 < p['brillo'] < 230 and p['contraste'] > 22] or puntuados
    tramos = np.array_split(np.arange(len(utiles)), min(n, len(utiles)))
    elegidos = []
    for tramo in tramos:
        opciones = sorted((utiles[j] for j in tramo), key=lambda p: (p['cara'] != caras, -p['nitidez']))
        for p in opciones:
            if elegidos and float(np.abs(p['miniatura'] - elegidos[-1]['miniatura']).mean()) < 6:
                continue  # casi igual al anterior
            elegidos.append(p)
            break
    salida = []
    for k, p in enumerate(elegidos, 1):
        destino = os.path.join(carpeta, f'cuadro-{k:02d}.jpg')
        img = Image.open(os.path.join(tmp, p['archivo'])).convert('RGB')
        img.save(destino, 'JPEG', quality=86, optimize=True, progressive=True)
        salida.append({'archivo': os.path.basename(destino), 'ancho': img.size[0], 'alto': img.size[1],
                       'segundo': p['segundo'], 'nitidez': p['nitidez'], 'cara': p['cara']})
    return salida


def video_mas_grande(item, carpeta):
    versiones = item.get('video_versions') or []
    mejor, ruta = b'', None
    for v in versiones:
        estado, datos = pedir(v['url'])
        if estado == 200 and len(datos) > len(mejor):
            mejor = datos
    if mejor:
        ruta = os.path.join('/tmp', os.path.basename(carpeta) + '.mp4')
        with open(ruta, 'wb') as f:
            f.write(mejor)
    return ruta, len(mejor)


def procesar(pid, code, caras=False):
    carpeta = os.path.join(SALIDA, pid)
    os.makedirs(carpeta, exist_ok=True)
    y = ficha(code)
    if not y:
        return {'code': code, 'error': 'sin ficha'}
    registro = {'code': code, 'media_type': y.get('media_type'), 'product_type': y.get('product_type'),
                'archivos': []}
    hijos = y.get('carousel_media') or []
    if hijos:
        for k, hijo in enumerate(hijos, 1):
            if hijo.get('media_type') == 2 and hijo.get('video_versions'):
                ruta, peso = video_mas_grande(hijo, carpeta + f'-v{k}')
                if ruta:
                    registro['archivos'] += cuadros_del_video(ruta, carpeta, n=6)
                continue
            url = mejor_imagen(hijo)
            if not url:
                continue
            estado, datos = pedir(url)
            if estado == 200 and datos:
                nombre = f'carrusel-{k:02d}.jpg'
                ancho, alto = guardar_imagen(datos, os.path.join(carpeta, nombre))
                registro['archivos'].append({'archivo': nombre, 'ancho': ancho, 'alto': alto})
    else:
        url = mejor_imagen(y)
        if url:
            estado, datos = pedir(url)
            if estado == 200 and datos:
                ancho, alto = guardar_imagen(datos, os.path.join(carpeta, 'portada.jpg'))
                registro['archivos'].append({'archivo': 'portada.jpg', 'ancho': ancho, 'alto': alto})
        if y.get('video_versions'):
            ruta, peso = video_mas_grande(y, carpeta)
            registro['video_bytes'] = peso
            if ruta:
                registro['archivos'] += cuadros_del_video(ruta, carpeta, caras=caras)
    return registro


def main():
    piezas = {pid: {'code': code} for pid, code in
              json.load(open(os.path.join(AQUI, 'propiedades.json'), encoding='utf-8')).items()}
    ruta_extras = os.path.join(AQUI, 'extras.json')
    if os.path.exists(ruta_extras):
        piezas.update(json.load(open(ruta_extras, encoding='utf-8')))
    solo = set(sys.argv[1:])
    os.makedirs(SALIDA, exist_ok=True)
    ruta_manifiesto = os.path.join(SALIDA, 'manifiesto.json')
    manifiesto = json.load(open(ruta_manifiesto, encoding='utf-8')) if os.path.exists(ruta_manifiesto) else {}
    for pid, pieza in piezas.items():
        code = pieza['code']
        if solo and pid not in solo:
            continue
        carpeta = os.path.join(SALIDA, pid)
        if not solo and os.path.isdir(carpeta) and os.listdir(carpeta):
            continue  # ya descargada en una corrida anterior
        try:
            manifiesto[pid] = procesar(pid, code, pieza.get('caras', False))
        except Exception as e:  # noqa: BLE001
            manifiesto[pid] = {'code': code, 'error': repr(e)}
        r = manifiesto[pid]
        print(pid, code, r.get('product_type'), len(r.get('archivos', [])), r.get('error', ''), flush=True)
        time.sleep(5)
    with open(ruta_manifiesto, 'w', encoding='utf-8') as f:
        json.dump(manifiesto, f, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
