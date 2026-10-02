"""Convierte las fotos elegidas (seleccion.json) en WebP para el sitio.

Uso: python herramientas/fotos/preparar.py <carpeta de la descarga>
La carpeta es la fotos/ de la rama fotos-instagram. Escribe en
sitio/public/fotos/<id>/NN.webp (hasta 1200 px de ancho) y NN-800.webp.
"""
import json
import os
import sys

from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
DESTINO = os.path.join(AQUI, '..', '..', 'sitio', 'public', 'fotos')


def limpiar_retrato(img):
    """Borra la frase escrita sobre el fondo liso del retrato del manifiesto.

    Rellena cada columna del recuadro del texto con un degradado entre el fondo
    de arriba y el de abajo, y funde los bordes para que no quede costura.
    """
    orig = img.copy().load()
    px = img.load()

    def promedio(x, filas):
        filas = list(filas)
        return [sum(orig[x, y][c] for y in filas) / len(filas) for c in range(3)]

    def borrar(x0, y0, x1, y1, abajo_rango, texto, borde):
        for x in range(x0, x1):
            arriba = promedio(x, range(y0 - 10, y0 - 2))
            abajo = promedio(x, abajo_rango)
            if sum(abajo) < sum(arriba) - 45:  # debajo empieza la cabeza
                abajo = arriba
            if texto[0] <= x < texto[1]:
                w = 1.0
            else:
                d = texto[0] - x if x < texto[0] else x - texto[1] + 1
                w = max(0.0, 1 - d / borde)
            for k, y in enumerate(range(y0, y1)):
                t = (k + 0.5) / (y1 - y0)
                o = orig[x, y]
                px[x, y] = tuple(int((arriba[c] * (1 - t) + abajo[c] * t) * w + o[c] * (1 - w)) for c in range(3))

    borrar(0, 262, 700, 397, range(398, 404), (20, 620), 70)
    borrar(110, 440, 470, 506, range(508, 516), (170, 452), 18)
    return img


def guardar(img, ruta, ancho, calidad):
    if img.width > ancho:
        img = img.resize((ancho, round(img.height * ancho / img.width)), Image.LANCZOS)
    img.save(ruta, 'WEBP', quality=calidad, method=6)


def main(origen):
    seleccion = json.load(open(os.path.join(AQUI, 'seleccion.json'), encoding='utf-8'))
    total = 0
    for pid, archivos in seleccion.items():
        if pid.startswith('_'):
            continue
        carpeta = os.path.join(DESTINO, pid)
        os.makedirs(carpeta, exist_ok=True)
        for k, nombre in enumerate(archivos, 1):
            fuente = os.path.join(origen, nombre if '/' in nombre else os.path.join(pid, nombre)) + '.jpg'
            img = Image.open(fuente).convert('RGB')
            if nombre == 'manifiesto/cuadro-01':
                img = limpiar_retrato(img)
            guardar(img, os.path.join(carpeta, f'{k:02d}.webp'), 1200, 74)
            guardar(img, os.path.join(carpeta, f'{k:02d}-800.webp'), 800, 70)
            total += 1
        print(pid, len(archivos))
    print('fotos:', total)


if __name__ == '__main__':
    main(sys.argv[1])
