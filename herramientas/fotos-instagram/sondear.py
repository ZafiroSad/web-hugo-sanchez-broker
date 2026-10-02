"""Sondeo: qué devuelve Instagram a un servidor (GitHub Actions) para tres publicaciones.

Guarda el HTML de cada variante, un resumen y las imágenes que encuentre, para
diseñar después la descarga completa de fotos de las propiedades.
"""
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request

CODES = sys.argv[1:] or ['DcjVDqqyjes', 'Dd9Q_FrnL2y', 'DZsHQ1RDsbI']
UA_NAV = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
          '(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36')
UA_BOT = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
OUT = 'sondeo'


class SinRedireccion(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def pedir(url, ua, seguir=True):
    req = urllib.request.Request(url, headers={
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
    })
    abridor = urllib.request.build_opener() if seguir else urllib.request.build_opener(SinRedireccion)
    try:
        with abridor.open(req, timeout=40) as r:
            return r.status, r.geturl(), r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, url, (e.read() if e.fp else b''), dict(e.headers or {})
    except Exception as e:  # noqa: BLE001
        return -1, url, str(e).encode(), {}


def urls_cdn(texto):
    t = texto.replace('\\u0026', '&').replace('\\/', '/').replace('&amp;', '&')
    vistas, salida = set(), []
    for u in re.findall(r'https://[a-z0-9.-]*(?:cdninstagram\.com|fbcdn\.net)/[^"\'\s\\<>)]+', t):
        clave = u.split('?')[0]
        if clave not in vistas:
            vistas.add(clave)
            salida.append(u)
    return salida


MARCAS = ['display_url', 'video_url', 'EmbeddedMediaImage', 'gql_data', 'shortcode_media',
          'edge_sidecar_to_children', 'og:image', 'og:video', 'contextJSON', 'loginForm',
          'is_video', 'display_resources', 'video_versions', 'image_versions2']

os.makedirs(OUT, exist_ok=True)
resumen = []
for code in CODES:
    carpeta = os.path.join(OUT, code)
    os.makedirs(carpeta, exist_ok=True)
    variantes = {
        'embed': (f'https://www.instagram.com/p/{code}/embed/captioned/', UA_NAV, True),
        'bot': (f'https://www.instagram.com/p/{code}/', UA_BOT, True),
        'media': (f'https://www.instagram.com/p/{code}/media/?size=l', UA_NAV, False),
    }
    todas = []
    for nombre, (url, ua, seguir) in variantes.items():
        estado, final, cuerpo, cab = pedir(url, ua, seguir)
        texto = cuerpo.decode('utf-8', 'replace')
        if nombre != 'media':
            with open(os.path.join(carpeta, f'{nombre}.html'), 'w', encoding='utf-8') as f:
                f.write(texto)
        marcas = [m for m in MARCAS if m in texto]
        urls = urls_cdn(texto)
        todas += [u for u in urls if u not in todas]
        resumen.append(f'{code} {nombre}: estado={estado} final={final} bytes={len(cuerpo)} '
                      f'location={cab.get("Location", cab.get("location", ""))} '
                      f'marcas={marcas} urls_cdn={len(urls)}')

    # Imágenes: descartar fotos de perfil (s150x150) y repetir tamaños de la misma foto
    imagenes = [u for u in todas if re.search(r'\.(jpg|jpeg|webp|heic)', u.split('?')[0])
                and 's150x150' not in u and 'profile' not in u]
    resumen.append(f'{code} imagenes_candidatas={len(imagenes)}')
    for i, u in enumerate(imagenes[:10], 1):
        estado, _, cuerpo, cab = pedir(u, UA_NAV)
        ext = '.webp' if '.webp' in u.split('?')[0] else '.jpg'
        if estado == 200 and len(cuerpo) > 2000:
            ruta = os.path.join(carpeta, f'img-{i:02d}{ext}')
            with open(ruta, 'wb') as f:
                f.write(cuerpo)
        resumen.append(f'  img {i}: estado={estado} bytes={len(cuerpo)} url={u[:160]}')

    videos = [u for u in todas if '.mp4' in u.split('?')[0]]
    resumen.append(f'{code} videos={len(videos)}')
    if videos:
        estado, _, cuerpo, _ = pedir(videos[0], UA_NAV)
        resumen.append(f'  video: estado={estado} bytes={len(cuerpo)}')
        if estado == 200 and shutil.which('ffmpeg'):
            ruta_video = os.path.join('/tmp', f'{code}.mp4')
            with open(ruta_video, 'wb') as f:
                f.write(cuerpo)
            dur = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=width,height',
                                  '-of', 'default=nw=1', ruta_video], capture_output=True, text=True).stdout
            resumen.append('  ffprobe: ' + dur.replace('\n', ' '))
            subprocess.run(['ffmpeg', '-v', 'error', '-i', ruta_video, '-vf', 'fps=1/3,scale=720:-2',
                            '-frames:v', '12', '-q:v', '3', os.path.join(carpeta, 'cuadro-%02d.jpg')])
        elif estado == 200:
            resumen.append('  sin ffmpeg en el ejecutor')

with open(os.path.join(OUT, 'resumen.txt'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(resumen) + '\n')
print('\n'.join(resumen))
