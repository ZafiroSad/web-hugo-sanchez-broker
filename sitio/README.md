# Sitio web de Hugo Sánchez · Broker inmobiliario

Parte de la beta VÉLARO que entregó el Señor Stick, adaptada a la marca de Hugo según `investigacion/ADN-MARCA.md`. Es React 19, Vite 8, Tailwind 4 y Motion, y sirve como sitio estático en GitHub Pages.

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
| `#/inicio` | Vista principal: resumen de Hugo, cifras de confianza, propiedades, proceso, inversión, vendidas y captación |
| `#/propiedades` | Catálogo con filtros por zona, tipo, operación, precio, habitaciones y área |
| `#/propiedad/<id>` | Ficha con el reel de Instagram como recorrido en video. El enlace se puede compartir |
| `#/admin` | Panel de administración. PIN en `src/config/marca.ts` |

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Teléfono, redes, slogan, textos de confianza y PIN | `src/config/marca.ts` |
| Las 20 propiedades iniciales (datos reales de Instagram) | `src/data/propiedades.ts` |
| Cierres, manifiesto y líneas de inversión | `src/data/contenido.ts` |
| Coordenadas aproximadas por zona | `src/data/zonas.ts` |
| Colores, curvas y fuentes | `src/index.css` |

## Cómo se publican cambios de propiedades

El sitio es estático: lo que se edita en `#/admin` se guarda solo en el navegador donde se edita. Para que lo vean todos:

1. En el panel, pulsar **Exportar**. Se descarga `propiedades.json`.
2. Guardar ese archivo como `sitio/public/propiedades.json` y subirlo al repositorio.
3. GitHub Actions publica el sitio de nuevo. El sitio carga ese archivo en lugar de las propiedades del código.

Para editar desde cualquier dispositivo sin este paso hace falta un backend (por ejemplo, Supabase o Firebase). Queda como siguiente fase.

## Videos

Cada propiedad enlaza a su reel de Instagram y se muestra con el embed oficial (`embed.js`). También se aceptan enlaces de YouTube o archivos `.mp4`, útiles si Santy Ramírez entrega los videos en alta calidad.

## Publicación

Publicado en **https://zafirosad.github.io/web-hugo-sanchez-broker/**.

`.github/workflows/sitio-pages.yml` compila y publica en GitHub Pages en cada cambio dentro de `sitio/`. En el repositorio, la opción Settings → Pages → Source debe estar en **GitHub Actions**. Con el plan gratuito de GitHub, Pages solo funciona si el repositorio es público.
