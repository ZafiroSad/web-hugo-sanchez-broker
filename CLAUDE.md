# Web Hugo Sánchez — Broker inmobiliario

## Objetivo
Página web premium para que **Hugo Sánchez** (@hugosanchezmarzan, broker inmobiliario
verificado, Bucaramanga) muestre sus propiedades. El Señor Stick está armando una beta
de la página; esta carpeta guarda la investigación del cliente para ajustar esa beta
"tal cual como él la tendría": esencia, colores, slogan, tipografías y forma de expresarse.

## Estado actual
- **v0.1 — investigación en curso** (2026-10-02).
- Captura del feed de Instagram: en curso (1.404 publicaciones en total).
- Investigación web (identidad, presencia digital, mercado y referentes): en curso
  con un workflow de 3 frentes + crítico.
- Beta de la página: pendiente de que el Señor Stick la entregue.

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
