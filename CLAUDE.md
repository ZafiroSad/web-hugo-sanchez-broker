# Web Hugo Sánchez — Broker inmobiliario

## Objetivo
Página web premium para que **Hugo Sánchez** (@hugosanchezmarzan, broker inmobiliario
verificado, Bucaramanga) muestre sus propiedades. El Señor Stick está armando una beta
de la página; esta carpeta guarda la investigación del cliente para ajustar esa beta
"tal cual como él la tendría": esencia, colores, slogan, tipografías y forma de expresarse.

## Estado actual
- **v0.1 — investigación en curso** (2026-10-02). La sesión pasó a la nube.
- Captura del feed de Instagram: **parcial, 606 de 1.404** publicaciones (las más recientes,
  aprox. hasta fines de 2023) en `investigacion/datos/instagram-feed-parcial.json`.
  Las ~800 restantes solo se pueden capturar desde el equipo local (Claude in Chrome con
  la sesión de Instagram del Señor Stick); en la nube no hay acceso.
- Investigación web: hecho `01-identidad-trayectoria.md`. Quedaron sin hacer
  presencia digital (02), mercado y referentes (03) y verificación (04).
- Beta de la página: pendiente de que el Señor Stick la entregue.

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
  01..04-*.md   informes de la investigación web
  ADN-MARCA.md  síntesis final: el documento que manda al ajustar la beta (pendiente)
```

## Datos clave confirmados (Instagram, 2026-10-02)
- Usuario: `hugosanchezmarzan` (verificado). Nombre visible: "Hugo Sánchez - Broker inmobiliario".
- 1.404 publicaciones · 24,5 mil seguidores · 2.500 seguidos. Categoría: Real Estate.
- Bio: "Especializado en propiedades de lujo y comerciales, te acompaño en la búsqueda de tu
  propiedad ideal o inversión. 📍 Bucaramanga co ¡Escríbeme! 👇"
- Contacto: WhatsApp +57 300 890 5794 (enlace con texto "Quiero más información sobre los
  proyectos de vivienda"). Threads: @hugosanchezmarzan.
- Destacadas: "20 promesas", "Elegancia", "Vendidas", "Destacada".
- Frase fijada: "El verdadero lujo en el sector inmobiliario, es el acceso y no todos lo tienen".
- El logo **SR** que aparece en sus videos es la firma del videógrafo **Santy Ramírez**
  ("Filmed by Santy Ramírez"), **no** es marca de Hugo. Su marca propia es la firma
  manuscrita "HS".

## Decisiones tomadas
- La investigación se guarda como datos crudos + informes + una síntesis única (`ADN-MARCA.md`).
- Repositorio privado `ZafiroSad/web-hugo-sanchez-broker` para continuar desde la nube.

## Pendientes y problemas conocidos
- Terminar la captura del feed completo y redactar `ADN-MARCA.md`.
- Instagram limita la API interna (429); la captura se hace desplazando la grilla como un
  usuario y leyendo el texto alternativo de cada publicación.
- Las fechas exactas de cada publicación no vienen en la grilla.
