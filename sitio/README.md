# Sitio web de Hugo Sánchez · Broker inmobiliario

Parte de la beta VÉLARO que entregó el Señor Stick, adaptada a la marca de Hugo según `investigacion/ADN-MARCA.md` y con la gama clara de la beta. Es React 19, Vite 8, Tailwind 4 y Motion, y sirve como sitio estático en GitHub Pages.

## Cómo correrlo

```bash
cd sitio
npm install
npm run dev      # http://localhost:3000
npm run lint     # revisión de tipos
npm run build    # genera dist/
```

## Rutas

| Dirección | Vista |
|---|---|
| `#/` | Intro animada: «HUGO SÁNCHEZ», el slogan en cursiva y el botón «Conoce tu nuevo hogar» |
| `#/inicio` | Vista principal: portada, propiedades destacadas, Sobre Hugo, proceso, inversión, manifiesto, vendidas y captación |
| `#/propiedades` | Catálogo con filtros por zona, tipo, operación, precio, habitaciones y área |
| `#/propiedad/<id>` | Ficha con galería de fotos y visor a pantalla completa. El enlace se puede compartir |
| `#/admin` | Panel de administración. PIN en `src/config/marca.ts` |

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Teléfono, redes, slogan, textos de confianza, PIN, propiedades de la portada y retrato | `src/config/marca.ts` |
| Las 20 propiedades iniciales (datos reales de Instagram) y cuántas fotos tiene cada una | `src/data/propiedades.ts` |
| Las fotos | `public/fotos/<id>/` (ver «Fotos») |
| Cierres, manifiesto y líneas de inversión | `src/data/contenido.ts` |
| Coordenadas aproximadas por zona | `src/data/zonas.ts` |
| Colores, curvas y fuentes | `src/index.css` |

## Cómo se publican cambios de propiedades

El sitio es estático: lo que se edita en `#/admin` se guarda solo en el navegador donde se edita. Para que lo vean todos:

1. En el panel, pulsar **Exportar**. Se descarga `propiedades.json`.
2. Guardar ese archivo como `sitio/public/propiedades.json` y subirlo al repositorio.
3. GitHub Actions publica el sitio de nuevo. El sitio carga ese archivo en lugar de las propiedades del código.

Para editar desde cualquier dispositivo sin este paso hace falta un backend (por ejemplo, Supabase o Firebase). Queda como siguiente fase.

## Fotos

El sitio no muestra videos. Cada propiedad tiene sus fotos en `public/fotos/<id>/`, numeradas desde `01`: `01.webp` (hasta 1200 px de ancho, para la ficha y el visor) y `01-800.webp` (para tarjetas y teléfonos). La primera es la portada.

Las actuales salen de las publicaciones de Instagram de Hugo: fotos del carrusel o cuadros de cada reel, elegidos a mano. Cómo se descargan y se convierten está en `../herramientas/fotos/` y en el `CLAUDE.md` de la raíz.

Para agregar fotos a una propiedad nueva: guardar los WebP en `public/fotos/<id>/` y escribir sus rutas en el paso «Fotos» del panel (`./fotos/<id>/01.webp`), o enlazar fotos publicadas en internet.

## Publicación

Publicado en **https://zafirosad.github.io/web-hugo-sanchez-broker/**.

`.github/workflows/sitio-pages.yml` compila y publica en GitHub Pages en cada cambio dentro de `sitio/`. En el repositorio, la opción Settings → Pages → Source debe estar en **GitHub Actions**. Con el plan gratuito de GitHub, Pages solo funciona si el repositorio es público.
