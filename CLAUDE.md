# Web Hugo Sánchez — Broker inmobiliario

## Objetivo
Página web premium para que **Hugo Sánchez** (@hugosanchezmarzan, broker inmobiliario
verificado, Bucaramanga) muestre sus propiedades. El Señor Stick está armando una beta
de la página; esta carpeta guarda la investigación del cliente para ajustar esa beta
"tal cual como él la tendría": esencia, colores, slogan, tipografías y forma de expresarse.

## Estado actual
- **v0.2 — investigación completa con la muestra disponible** (2026-10-02, sesión en la nube).
- Captura del feed de Instagram: **parcial, 606 de 1.404** publicaciones, las más recientes:
  **del 10 de mayo de 2024 al 1 de octubre de 2026** (la fecha se decodifica del código de cada
  publicación). Las ~800 restantes son anteriores a mayo de 2024 y solo se pueden capturar desde
  el equipo local (Claude in Chrome con la sesión de Instagram del Señor Stick).
- Informes hechos: 01 identidad, 02 presencia digital, 03 mercado y referentes,
  04 verificación, 05 análisis del feed y **ADN-MARCA.md** (síntesis que manda).
- Beta de la página: pendiente de que el Señor Stick la entregue. Al recibirla, revisarla
  con la lista de control de `ADN-MARCA.md` (sección 10).

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
- Repositorio privado `ZafiroSad/web-hugo-sanchez-broker` para continuar desde la nube.
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

## Pendientes y problemas conocidos
- Capturar las ~800 publicaciones anteriores a mayo de 2024 (solo desde el equipo local) y volver
  a correr `investigacion/datos/analizar_feed.py`.
- Recibir la beta y ajustarla con `ADN-MARCA.md`.
- Pedir al cliente la lista de la sección 11 de `ADN-MARCA.md`: vector de la firma HS, retrato,
  videos 16:9, cifras, credenciales e inventario.
- Instagram limita la API interna (429); la captura se hace desplazando la grilla como un
  usuario y leyendo el texto alternativo de cada publicación.
- En la nube, la red del entorno bloquea varios dominios (sumas.com.co, patriciaherrera.co,
  luxhaven.co, agentimage.com, luxurypresence.com, entre otros); solo se ven por el buscador.
