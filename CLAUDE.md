# Web Hugo Sánchez — Broker inmobiliario

## Objetivo
Página web premium para que **Hugo Sánchez** (@hugosanchezmarzan, broker inmobiliario
verificado, Bucaramanga) muestre sus propiedades. El Señor Stick está armando una beta
de la página; esta carpeta guarda la investigación del cliente para ajustar esa beta
"tal cual como él la tendría": esencia, colores, slogan, tipografías y forma de expresarse.

## Estado actual
- **v0.7: entrada como la de Stick Industries y un inicio que no es lineal** (2026-10-04). Al ver la v0.6
  el Señor Stick pidió volver a una entrada simple: «que la primera pantalla sea como de Stick Industries,
  que salga el Hugo Sánchez, como siempre, encontrando las mejores propiedades para ti, y sale el botón.
  Encontrar mi propiedad o algo así. Que uno le dé y ahí sí entra al menú de inicio. Y trata de plantear una
  forma en la que la página no se sienta tan lineal ya adentro». Lo que cambió:
  - **La puerta** (`#/`), copiada de la entrada del portafolio de Stick Industries:
    - Fondo negro con los mismos hilos de luz (su shader `seda.js`, en tono champaña).
    - «HUGO SÁNCHEZ» se asienta letra a letra con el eco tipográfico; debajo, el slogan sin cursiva.
    - Abajo, el botón blanco con letra negra «Encontrar mi propiedad». Se entra con el botón, tocando
      la pantalla o con Intro/Espacio.
    - Al abrir, el nombre se aleja y se desenfoca mientras la capa se disuelve.
  - **El inicio es un menú, no una página larga.** Arriba, «¿Por dónde empezamos?» y una rejilla de baldosas:
    - Las propiedades destacadas como historias de Instagram: avanzan solas, se pasan tocando y se pausan
      al mantener el dedo encima.
    - Propiedades, con su cifra y un atajo por categoría.
    - Sobre Hugo, Inversión, Vendidas y Vende tu propiedad.

    Debajo siguen las destacadas con pestañas. En el teléfono el inicio pasó de 10 pantallas a 4.
  - **Cada capítulo tiene su página** (`#/hugo`, `#/inversion`, `#/vendidas`, `#/vender`). Arriba, la vuelta
    al inicio; al final, «Sigue explorando» con los demás capítulos. Desde cualquier página se salta a
    cualquier otra.
  - El catálogo tiene pestañas por categoría y cada una tiene su dirección (`#/propiedades/casas`).
  - Se retiraron la intro blanca con la pregunta y la portada oscura del inicio (`HomeHero`).
  - Se conservan la tipografía Mona Sans y el monograma HS de la v0.6.
- **v0.6: intro en blanco, tipografía nueva y una primera elección** (2026-10-04). Reemplazada por la v0.7,
  salvo la tipografía. Pedido: «al inicio la
  animación de Hugo Sánchez, quiero otras tipografías y fondo blanco, algo más moderno, no tan cursiva…
  que no se sienta tan lineal la página sino que al inicio al usuario le toque interactuar un poco».
  - Tipografía nueva en todo el sitio: Mona Sans, ancha y fina en el nombre y en los titulares, y sin
    cursivas (ver «Decisiones tomadas»).
  - Intro sobre blanco: el nombre sube letra a letra desde una línea, una línea dorada lo subraya y el
    slogan entra palabra a palabra. Tarda menos de dos segundos y un toque o una tecla la completa.
  - Al final de la intro, la pregunta «¿Qué estás buscando?»: Casas, Apartamentos, Invertir, Vender mi
    propiedad o Ver todo. Cada respuesta lleva a un sitio distinto del inicio: la hoja blanca sube y debajo
    ya está esa sección. Las de categoría dicen cuántas hay y muestran su foto.
  - En el computador, la foto de la derecha cambia al pasar por cada opción y las demás se atenúan; las
    letras del nombre engruesan cerca del cursor; las teclas 1 a 4 eligen; abajo a la izquierda está el
    WhatsApp directo.
  - «Propiedades destacadas» tiene pestañas por tipo (Todas, Casas, Apartamentos, Lotes y fincas), y la
    elección de la intro abre la suya.
  - La intro cabe entera desde teléfonos de 360×780 y 375×667 hasta portátiles de 1366×768.
- **v0.5: vista de celular** (2026-10-02). Pedido: «haz que la vista de celular se vea mejor, más acorde».
  La auditoría a 390 px mostró que el problema era de forma, no de color:
  - Los botones flotantes tapaban textos y precios en todas las pantallas.
  - Cada tarjeta ocupaba pantalla y media; el inicio medía 19 pantallas y el catálogo 18.
  - Los títulos eran demasiado grandes y en la ficha el precio salía al final.

  Lo que cambió:
  - Barra fija abajo con Instagram y «Coordina tu visita».
  - Destacadas, pilares y vendidas en carruseles deslizables con puntos.
  - Catálogo en dos columnas con tarjetas compactas.
  - Títulos más contenidos y «Leer más» en la bio.
  - En la ficha, el precio y las acciones van debajo del nombre.

  Ahora el inicio mide 10 pantallas, el catálogo 6 y la ficha 6. El computador no cambia.
- **v0.4: gama de la beta y fotos en vez de videos** (2026-10-02), publicada en
  https://zafirosad.github.io/web-hugo-sanchez-broker/. Al ver la v0.3 el Señor Stick pidió: los colores
  de la beta, imágenes en lugar de videos («quita todos los videos») y no tener que bajar tanto para ver
  la primera propiedad. Lo que cambió:
  - Paleta clara de la beta: fondo #FAFAFA, tarjetas blancas, grises piedra y dorado de acento.
  - Ningún video en el sitio. Cada propiedad trae de 4 a 10 fotos reales sacadas de su publicación de
    Instagram (ver «Fotos» abajo), con galería y visor a pantalla completa en la ficha.
  - Inicio: la portada es más corta y las propiedades destacadas van justo debajo; en el computador la
    portada ya muestra tres propiedades. En el teléfono la primera tarjeta asoma en la primera pantalla.
  - «Sobre Hugo» con su retrato profesional (el del reel fijado del manifiesto, sin la frase encima).
- **v0.3: sitio construido** (2026-10-02). La beta VÉLARO del Señor Stick se rehízo con la marca de Hugo
  en `sitio/` (React 19 + Vite 8 + Tailwind 4 + Motion). Ver `sitio/README.md`.
  - Intro animada (`#/`): «HUGO SÁNCHEZ» letra a letra, el nombre sube, el slogan se escribe en
    cursiva (Pinyon Script) y aparece el botón blanco «Conoce tu nuevo hogar». Movimiento con las
    curvas del STICK VIDEO SYSTEM (reel de Stick Industries).
  - Vista principal (orden de la v0.4): portada, propiedades destacadas, Sobre Hugo con cifras de
    confianza, proceso casa-llave-apretón, inversión (Sumas y Panamá), manifiesto, vendidas y captación.
  - 20 propiedades reales (26 may. a 1 oct. 2026), cada una con sus fotos y el enlace a su publicación.
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
herramientas/fotos/  selección (seleccion.json) y conversión (preparar.py) de las fotos del sitio
sitio/          el sitio publicado (ver sitio/README.md)
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
- **Paleta: la de la beta** (decisión del Señor Stick, 2026-10-02, al ver la v0.3): fondo #FAFAFA, blanco,
  escala piedra (stone) de Tailwind, texto #1C1917 y dorado #C5A059 de acento (#A07A36 para texto pequeño).
  Los nombres de color del código (`hueso`, `negro`, `taupe`…) se conservaron con los valores nuevos.
  La paleta cálida de `ADN-MARCA.md` (taupe, arena, bronce #8A6F4E) quedó descartada. Sin verde de WhatsApp.
- **Tipografía: Mona Sans** (decisión del Señor Stick, 2026-10-04: «otras tipografías… algo más moderno,
  no tan cursiva»). Es una sola familia variable en peso y en ancho:
  - El nombre va ancho (125 %), en peso 300 y mayúsculas (`nombre-marca`). Sigue el espíritu de sus
    portadas (sans fina en mayúsculas), pero ensancha la letra en vez de espaciarla.
  - Los titulares van semianchos (112,5 %), en minúscula de frase y apretados (`titular`).
  - Las etiquetas, en versalitas de peso 600; el texto, en ancho normal.
  - Salieron Montserrat y la cursiva Pinyon Script, y no queda ninguna cursiva. La firma HS provisional
    es un monograma en un círculo fino hasta tener el vector de la firma real.
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
  - Los capítulos van en `#/hugo`, `#/inversion`, `#/vendidas` y `#/vender`.
  - El catálogo de una categoría va en `#/propiedades/<categoría>` (`casas`, `apartamentos`, `lotes`…).
  - Las direcciones viejas del inicio (`#/inicio/sobre`, `#/inicio/vender`…) llevan a su capítulo.
- **La entrada es la de Stick Industries** (v0.7, pedido del Señor Stick):
  - Los hilos de luz son su mismo shader, en `Estela.tsx`, en tono champaña en vez de gris.
  - El eco de las letras es la clase `.letra` de `index.css`.
  - El nombre espera a la fuente, como mucho un segundo, para no cambiar de forma a medio asentarse; la
    fuente se precarga en `index.html`.
  - Con `prefers-reduced-motion` la puerta queda quieta, con el botón, y solo se desvanece.
  - Solo la capa lleva `exit`; el alejarse del nombre y el apagarse del botón van por estado. Si cada hijo
    tiene su propia salida, la capa puede retirarse cuando termina la más corta.
- **El inicio es un menú, no una página larga** (v0.7). Cada capítulo vive en su página y se llega desde su
  baldosa, la barra o el pie; «Sigue explorando» cierra cada capítulo con los demás.
  - Los capítulos (etiqueta, título y foto de su baldosa) están en `CAPITULOS` (`sitio/src/config/marca.ts`).
  - Las categorías del inventario están en `sitio/src/data/categorias.ts`.
  - Las historias muestran las destacadas en el orden de `ordenarDestacadas`, el mismo de Destacadas.
  - La foto de Vendidas se encuadra abajo (`encuadre`): el rótulo «VENDIDO» del cuadro va a media altura y
    chocaba con el título de la baldosa.
- **Sin videos** (pedido del Señor Stick, v0.4): ni embeds de Instagram ni reproductores. La ficha solo
  enlaza a la publicación («Publicación» en la tarjeta de precio) y las vendidas a su reel.
- Cada propiedad muestra sus fotos (`sitio/public/fotos/<id>/NN.webp` y `NN-800.webp`). La portada
  tipográfica (nombre sobre negro) queda solo para una propiedad nueva sin fotos.
- Tarjetas en 4:5: casi todo el material de Hugo es vertical (cuadros de reel 9:16, carruseles 3:4 o 1:1).
- **En el teléfono (v0.5), Instagram y WhatsApp van en una barra fija abajo, no flotando.** Los botones
  flotantes tapaban textos y precios. En la ficha esa barra es la de la ficha: Instagram, precio corto
  («$9.000 M», «$12 M/mes»; el «Desde» va en la línea del nombre) y «Coordina tu visita». Así cabe entero
  hasta en pantallas de 360 px (verificado en las 20 fichas).
- En el teléfono, las secciones de varias tarjetas (destacadas, pilares, vendidas) son carruseles
  deslizables (`Deslizable` en `SeccionesInicio.tsx`). El catálogo y «También te pueden interesar» son
  rejillas de dos columnas con `PropertyCard densa`. Desde tableta todo vuelve a rejilla.
- El botón «Comparar» de las tarjetas solo aparece desde tableta; en el teléfono se compara desde la ficha.
- Fuente alojada en el sitio (Mona Sans, OFL; licencia en `sitio/src/assets/fonts/`); no se usa Google Fonts.
- Las coordenadas del mapa son aproximadas por zona (`sitio/src/data/zonas.ts`) y se muestran como
  círculo. Montearroyo, La Gran Reserva, City Center y La Loma no tienen mapa (zona desconocida).
- El panel guarda en el navegador; para publicar se exporta `propiedades.json` a `sitio/public/`.
- Se retiraron de la beta: datos y textos de VÉLARO, fotos de Unsplash, cifras inventadas, el
  formulario que no enviaba nada (ahora abre WhatsApp) y la sección SARLAFT.

## Fotos (v0.4)
- Instagram no responde desde la sesión en la nube, pero sí desde GitHub Actions. La rama
  `fotos-instagram` tiene el flujo `.github/workflows/fotos-instagram.yml` y
  `herramientas/fotos-instagram/descargar.py`: por cada publicación lee la ficha que Instagram da a los
  rastreadores de enlaces (`facebookexternalhit`), baja las fotos del carrusel o el video del reel, y del
  video saca 16 cuadros nítidos repartidos en el tiempo. Todo queda en `fotos/` de esa rama (crudo, ~70 MB).
  El registro de cada corrida también va a la rama, porque los registros de Actions no se leen desde aquí.
- La elección es a mano, en `herramientas/fotos/seleccion.json` (la primera es la portada), y
  `herramientas/fotos/preparar.py <carpeta fotos de la rama>` las convierte a WebP en dos tamaños.
- Fuera de la selección: cuadros con Hugo en cámara, con texto encima (áreas, nombres) y los **renders
  conceptuales de IA** que Hugo mete en algunos reels con un aviso pequeño (City Center, Green House,
  Ruitoque Villas). Presentar un render como foto de la propiedad sería engañoso.
- El retrato de «Sobre Hugo» es la foto profesional en blanco y negro de su reel fijado (DSiET7kDs6X);
  `preparar.py` le borra la frase escrita encima. Las vendidas usan cuadros de sus reels con el rótulo
  «VENDIDO», de donde salen también los nombres (Aqua, Hispania, Germania, Buena Vista).
- Las historias del inicio muestran las propiedades marcadas como destacadas (`featured`) primero; no hay
  una lista aparte que mantener.

## Pendientes y problemas conocidos
- Desde la nube no se puede cambiar la configuración del repositorio (visibilidad, Pages): el proxy
  lo bloquea y lo hace el Señor Stick en Settings. Sí se puede relanzar la publicación
  (`gh api -X POST repos/ZafiroSad/web-hugo-sanchez-broker/actions/runs/<id>/rerun`) y leer su estado.
  La dirección publicada (zafirosad.github.io) tampoco se puede abrir desde la nube.
- Pedir a Hugo: vector de la firma HS (hoy es provisional: monograma en un círculo), las fotos originales de sus
  propiedades (las del sitio son cuadros de video a 1080 px), el retrato en alta resolución,
  confirmación de cifras y credenciales, y revisión legal de los textos de datos y términos.
- Capturar las ~800 publicaciones anteriores a mayo de 2024 (solo desde el equipo local) y volver
  a correr `investigacion/datos/analizar_feed.py`.
- Recibir la beta y ajustarla con `ADN-MARCA.md`.
- Pedir al cliente la lista de la sección 11 de `ADN-MARCA.md`: vector de la firma HS, retrato,
  videos 16:9, cifras, credenciales e inventario.
- Instagram limita la API interna (429); la captura se hace desplazando la grilla como un
  usuario y leyendo el texto alternativo de cada publicación.
- En la nube, la red del entorno bloquea varios dominios (sumas.com.co, patriciaherrera.co,
  luxhaven.co, agentimage.com, luxurypresence.com, entre otros); solo se ven por el buscador.
