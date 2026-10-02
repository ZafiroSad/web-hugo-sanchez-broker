# Web Hugo Sánchez — Broker inmobiliario

## Objetivo
Página web premium para que **Hugo Sánchez** (@hugosanchezmarzan, broker inmobiliario
verificado, Bucaramanga) muestre sus propiedades. El Señor Stick está armando una beta
de la página; esta carpeta guarda la investigación del cliente para ajustar esa beta
"tal cual como él la tendría": esencia, colores, slogan, tipografías y forma de expresarse.

## Estado actual
- **v0.3: sitio construido y publicado** (2026-10-02) en https://zafirosad.github.io/web-hugo-sanchez-broker/
  La beta VÉLARO del Señor Stick se rehízo con la marca de Hugo
  en `sitio/` (React 19 + Vite 8 + Tailwind 4 + Motion). Ver `sitio/README.md`.
  - Intro animada (`#/`): «HUGO SÁNCHEZ» letra a letra, el nombre sube, el slogan se escribe en
    cursiva (Pinyon Script) y aparece el botón blanco «Conoce tu nuevo hogar». Movimiento con las
    curvas del STICK VIDEO SYSTEM (reel de Stick Industries).
  - Vista principal: resumen de Hugo, cifras de confianza, Book de propiedades, proceso
    casa-llave-apretón, inversión (Sumas y Panamá), manifiesto, vendidas y captación.
  - 20 propiedades reales (26 may. a 1 oct. 2026), cada una con su reel de Instagram como video.
  - Botón de Instagram en toda la página; WhatsApp «Coordina tu visita» con mensaje por propiedad.
  - Panel `#/admin` (PIN 1234) adaptado a la ficha de Hugo, con importación desde el texto de Instagram.
- Despliegue: `.github/workflows/sitio-pages.yml` publica en GitHub Pages en cada cambio de `sitio/`
  (Settings → Pages → Source: GitHub Actions). El repositorio es **público desde el 2026-10-02**:
  con el plan gratuito, Pages solo funciona en repositorios públicos.
- Investigación: informes 01 a 05 y `ADN-MARCA.md`. El feed está capturado en parte (606 de 1.404);
  lo que falta solo se puede capturar desde el equipo local.

## Observaciones visuales del feed (vistas en pantalla, 2026-10-02)
- Formato dominante: reels verticales recorriendo la propiedad con Hugo en cámara.
  De 606 publicaciones capturadas, 547 son reels.
- Portadas con el nombre de la propiedad en blanco, centrado y en mayúsculas, sobre la foto
  o video. Debajo va el tipo de inmueble en versalitas pequeñas (CASA, APARTAMENTO,
  PENTHOUSE, LOTE) y a veces "HUGO SÁNCHEZ / BROKER INMOBILIARIO". Encima o detrás va la
  firma manuscrita "HS" en blanco.
- Evolución tipográfica de las portadas, de lo más antiguo a lo más reciente:
  1. Sans geométrica gruesa (tipo Montserrat Bold/Black).
  2. Serif de alto contraste en mayúsculas (tipo Playfair Display / Didone).
  3. **Actual (2025-2026):** sans geométrica fina, mayúsculas con tracking amplio
     (tipo Montserrat Light), con subtítulo en sans pequeña y bold.
- Palabras de portada recurrentes: VENDIDO / VENDIDA, PRÓXIMAMENTE!! (en serif itálica),
  BIENVENIDO, "COMO SIEMPRE ENCONTRANDO LAS…".
- Zonas que más aparecen: Ruitoque Condominio, Lagos del Cacique, Cañaveral, Cabecera,
  Mesa de los Santos, Piedecuesta y Floridablanca. Fuera de la zona: Cartagena, Barú y
  Panamá (Santa María, Costa del Este).
- Presencia personal: Hugo siempre en cámara, de negro o con colores neutros y con gafas.
  También usa un avatar caricatura con polo negro y firma HS.

## Estructura
```
investigacion/
  datos/        exportes crudos (feed de Instagram en JSON: índice, código, tipo, texto)
  capturas/     capturas de pantalla de referencia visual
  datos/analizar_feed.py  estadísticas del feed (volver a correrlo con el feed completo)
  01..05-*.md   informes (identidad, presencia digital, mercado, verificación, análisis del feed)
  ADN-MARCA.md  síntesis final: el documento que manda al ajustar la beta
```

## Datos clave confirmados (Instagram, 2026-10-02)
- Usuario: `hugosanchezmarzan` (verificado). Nombre visible: "Hugo Sánchez - Broker inmobiliario".
- 1.404 publicaciones · 24,5 mil seguidores · 2.500 seguidos. Categoría: Real Estate.
- Bio: "Especializado en propiedades de lujo y comerciales, te acompaño en la búsqueda de tu
  propiedad ideal o inversión. 📍 Bucaramanga co ¡Escríbeme! 👇"
- Contacto: WhatsApp +57 300 890 5794 (enlace con texto "Quiero más información sobre los
  proyectos de vivienda"). Threads: @hugosanchezmarzan.
- Destacadas: "20 promesas", "Elegancia", "Vendidas", "Destacada".
- Frase fijada: "El verdadero lujo en el sector inmobiliario, es el acceso y no todos lo tienen"
  (reel DSiET7kDs6X, 2025-12-21).
- El logo **SR** que aparece en sus videos es la firma del videógrafo **Santy Ramírez**
  ("Filmed by Santy Ramírez"), **no** es marca de Hugo. Su marca propia es la firma
  manuscrita "HS".

## Decisiones tomadas
- La investigación se guarda como datos crudos + informes + una síntesis única (`ADN-MARCA.md`).
- Repositorio `ZafiroSad/web-hugo-sanchez-broker` para continuar desde la nube. Nació privado y pasó a
  **público** el 2026-10-02 para publicar en GitHub Pages con el plan gratuito. Lo decidió el Señor Stick
  sabiendo que con eso queda a la vista `investigacion/` (análisis del cliente y de su competencia).
- Paleta propuesta: negro #111111, grafito #2B2926, taupe #6E665E, piedra #8C847A, arena #D9D0C3,
  hueso #F5F2ED, blanco; bronce #8A6F4E opcional y solo decorativo. Sin verde de WhatsApp.
- Tipografía: Montserrat 300 en mayúsculas con tracking amplio (títulos), Montserrat 600 (etiquetas),
  Montserrat 400 (cuerpo) y Playfair Display Italic como único acento.
- Frases: manifiesto "El verdadero lujo… es el acceso"; lema "Como siempre, encontrando las mejores
  propiedades para ti"; CTA "Coordina tu visita" (WhatsApp).
- El precio va visible por defecto ("Precio negociable"); "Precio a consultar" es solo una opción.

## Hallazgos del análisis del feed (2026-10-02)
- Dice tener 14 años en el sector inmobiliario (2024) y más de 20 años entre los sectores
  financiero, constructor e inmobiliario (2026). Dice ser Director Comercial de Constructora
  Valderrama (sin confirmar fuera de su perfil).
- Comercializa proyectos de **Sumas Construcciones**: Manga (20 casas, Ruitoque Alto), Amarí y Premium Park.
- **Panamá es una línea de negocio** desde 2025: proyectos en Santa María, "inversión dolarizada".
- "20 promesas" = nominación de **Horror Brokers Colombia** (septiembre de 2025; evento el 18 de noviembre de 2025).
- 32 cierres publicados; mediana de precio de $1.675 millones (204 inmuebles distintos).
- En 2026 dejó los hashtags y bajó el volumen: tono más sobrio.
- El teléfono aparece mal escrito en 12 publicaciones: en la web, una sola constante.

## Decisiones del sitio (2026-10-02)
- Rutas con hash (`#/propiedad/<id>`): funcionan en GitHub Pages y cada propiedad tiene enlace propio.
- Las fichas usan portada tipográfica (nombre en mayúsculas sobre negro, como sus portadas de reel)
  porque no hay fotos propias descargables; si se agregan fotos en el panel, se usan en la portada.
- Videos con el embed oficial de Instagram; en las secciones del inicio cargan al pulsar, para no
  meter seis embeds de golpe.
- Fuentes alojadas en el sitio (Montserrat y Pinyon Script, OFL); no se usa Google Fonts.
- Las coordenadas del mapa son aproximadas por zona (`sitio/src/data/zonas.ts`) y se muestran como
  círculo. Montearroyo, La Gran Reserva, City Center y La Loma no tienen mapa (zona desconocida).
- El panel guarda en el navegador; para publicar se exporta `propiedades.json` a `sitio/public/`.
- Se retiraron de la beta: datos y textos de VÉLARO, fotos de Unsplash, cifras inventadas, el
  formulario que no enviaba nada (ahora abre WhatsApp) y la sección SARLAFT.

## Pendientes y problemas conocidos
- Desde la nube no se puede cambiar la configuración del repositorio (visibilidad, Pages): el proxy
  lo bloquea y lo hace el Señor Stick en Settings. Sí se puede relanzar la publicación
  (`gh api -X POST repos/ZafiroSad/web-hugo-sanchez-broker/actions/runs/<id>/rerun`) y leer su estado.
  La dirección publicada (zafirosad.github.io) tampoco se puede abrir desde la nube.
- Pedir a Hugo: vector de la firma HS (hoy es provisional, en cursiva), retrato, videos en alta
  calidad, confirmación de cifras y credenciales, y revisión legal de los textos de datos y términos.
- Capturar las ~800 publicaciones anteriores a mayo de 2024 (solo desde el equipo local) y volver
  a correr `investigacion/datos/analizar_feed.py`.
- Recibir la beta y ajustarla con `ADN-MARCA.md`.
- Pedir al cliente la lista de la sección 11 de `ADN-MARCA.md`: vector de la firma HS, retrato,
  videos 16:9, cifras, credenciales e inventario.
- Instagram limita la API interna (429); la captura se hace desplazando la grilla como un
  usuario y leyendo el texto alternativo de cada publicación.
- En la nube, la red del entorno bloquea varios dominios (sumas.com.co, patriciaherrera.co,
  luxhaven.co, agentimage.com, luxurypresence.com, entre otros); solo se ven por el buscador.
