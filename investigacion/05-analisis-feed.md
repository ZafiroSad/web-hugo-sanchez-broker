# 05 — Análisis del feed de Instagram (606 publicaciones)

Fecha del análisis: 2026-10-02
Fuente: `investigacion/datos/instagram-feed-parcial.json`, procesado con `investigacion/datos/analizar_feed.py`. El script se puede volver a ejecutar cuando se capture el feed completo.
Convención: los emojis se describen con palabras entre corchetes. Las publicaciones se citan por su código; la URL es `https://www.instagram.com/p/<código>/`.

---

## 1. Qué cubre la muestra

| Dato | Valor |
|---|---|
| Publicaciones analizadas | 606 de 1.404 (43 %) |
| Rango de fechas | **10 de mayo de 2024 a 1 de octubre de 2026** |
| Formatos | 547 reels (90 %), 58 carruseles, 1 foto |
| Publicaciones sin texto | 3 |
| Longitud media del texto | 363 caracteres (mediana 340) |

**Corrección importante:** la bitácora decía que la captura llegaba "aprox. hasta fines de 2023". No es así. La fecha va codificada en el propio código de cada publicación y la más antigua capturada es del **10 de mayo de 2024**. Las ~800 publicaciones pendientes son anteriores a esa fecha.

### Ritmo de publicación

| Periodo | Publicaciones | Promedio mensual |
|---|---|---|
| mayo a diciembre de 2024 | 266 | 33 |
| 2025 | 242 | 20 |
| enero a septiembre de 2026 | 97 | 11 |

Publica cada vez menos, pero cada pieza está más producida: reels del videógrafo Santy Ramírez, proyectos de constructora y lanzamientos. Pasó del volumen al contenido seleccionado.

---

## 2. Estructura de los textos

Hay tres plantillas, que cubren casi todo el feed.

### A. Ficha técnica (387 publicaciones, 64 %)
```
NOMBRE DEL CONJUNTO O EDIFICIO (Zona/Ciudad)      <- en mayúsculas en 292 de 387
[check verde] Área ___ m2                          374 de 387
[check verde] Habitaciones _ (incluye servicio)    321 (134 con "incluye servicio")
[check verde] Baños _                              313
[check verde] sala/comedor/cocina concepto abierto/BBQ/piscina...   (182 con "concepto abierto")
[check verde] Parqueaderos _                       335
[check verde] Depósito _                           97
[check verde] Valor admon $___                     283
[check verde] Valor de venta $___ (negociables)    349 con precio, 355 con "negociables"
[celular]3008905794 coordina tu visita!![casa][llave][apretón de manos]
#hashtags (hasta 2025)
```
Atributos de lujo que más repite: BBQ (151), piscina (118), jacuzzi (82), vista (70) y paneles solares (28).

### B. Gancho corto sobre un reel (unas 170 publicaciones)
Una frase de asombro, el teléfono y el cierre. Ejemplos literales:
- "Esta propiedad es una locura [cara con la cabeza explotando] uff !!" (C_vBdv_JFlX)
- "Sencillamente….. Divina!" (C_bx_-xN1_X)
- "Solo para conocedores!!" (C_RVUWnpuCZ)
- "Se viene esta impactante propiedad!!" (Dcgb_ijOF0O)
- "Esta propiedad en Condominio Ruitoque es Brutal !!" (C_0KIqhJDnp)

### C. Cierre de negocio y agradecimiento (32 publicaciones)
Fórmula estable: "VENDIDA!!" → gracias a los propietarios por "la confianza depositada en nuestro trabajo/profesionalismo" → felicitación a los "nuevos propietarios" → a veces "Agradecer primero a Dios" → firma "Como siempre encontrando las mejores propiedades para ti". En 2025 aparece una versión más formal y firmada:
> "A los propietarios, gracias por depositar en mí la responsabilidad de representar su propiedad. Valoro profundamente su confianza. Y a los nuevos propietarios, ¡felicitaciones! Hoy comienza una nueva historia que espero esté llena de felicidad y grandes momentos. Con gratitud, Hugo Sánchez" (DKw-1bcMBfl, 2025-06-11)

> "Para ambos, nuestro agradecimiento es genuino. Fue un honor servirles." (DRvD_a5jl34, 2025-12-01)

Cierres por año: 8 en 2024 (desde mayo), 19 en 2025 y 5 en 2026. Son la mejor materia prima para la sección "Vendidas" y para los testimonios.

---

## 3. Frases de marca (con frecuencia)

| Frase | Veces | Uso | Ejemplo |
|---|---|---|---|
| "coordina tu visita" | 446 (74 %) | CTA principal | casi todas las fichas |
| [celular] 3008905794 | 563 (93 %) | contacto en cada post | — |
| "(negociables)" | 362 | siempre junto al precio | — |
| "Como siempre encontrando las mejores propiedades para ti" | 87 | firma o lema; crece en 2025 (53 veces) | DdRqxDvSmhP |
| "puede ser tuya" | 17 | cierre aspiracional | DIY_qB6A-uV |
| "Se viene… / Próximamente" | 15 | adelanto de propiedad | DdRqxDvSmhP |
| "agenda tu cita / visita" | 12 | variante del CTA en proyectos | DcYz4CgScrc |
| "El verdadero lujo en el sector inmobiliario, es el acceso y no todos lo tienen !!" | 1, **fijada** | manifiesto | DSiET7kDs6X (2025-12-21) |
| "nuestro Book de propiedades" | 1 | nombre de su catálogo | C7T1KSogLhr (2024-05-23) |
| "se parte de la exclusividad" | 1 | escasez en preventa | DU1eZxBjlFi |
| "Esta profesión es mi pasión!!!" | 1 | declaración personal | DUdVVd1Dlzy |

Adjetivos de apertura, por frecuencia: exclusiva (28), extraordinaria (25), espectacular (24), impresionante (22), hermosa (18), imponente (16), impactante (11), sensacional (11), magnífica (7), increíble (6). Superlativo frecuente: "una de las mejores…", "sin duda".

---

## 4. Rasgos de voz

1. **Tuteo constante.** Nunca usa "usted" con el cliente.
2. **Doble persona.** "Yo" cuando vende ("tengo los mejores proyectos", "te acompaño") y "nosotros" cuando agradece ("nuestro trabajo", "nuestro equipo"; 37 publicaciones). La marca es personal, pero insinúa un equipo detrás.
3. **Energía alta.** Signos dobles ("!!", "!!!"), el [dedo señalando al espectador] en 84 publicaciones ("puede ser tuya [dedo]") y caras de asombro.
4. **Fe y gratitud.** 16 publicaciones agradecen a Dios, a la Virgen o hablan de bendiciones, siempre en los cierres de negocio y en los balances de fin de año.
5. **Ficha factual.** En las fichas casi no hay adjetivos: cifras, espacios y precio.
6. **Erratas recurrentes.** "Está" en lugar de "Esta" en 45 aperturas; además "coordia", "Collar siempre" (por "Como siempre"), "loas", "Pára", "felidades", "BDEGA", "PRIVICIA".
7. **Teléfono mal escrito en 12 publicaciones** (3098905794, 3008005794, 3008805794, entre otros). En la web el número debe existir en un solo lugar del código y repetirse desde ahí.

---

## 5. Emojis de firma

| Emoji | Veces | Función | Traducción a la web |
|---|---|---|---|
| [check verde] | 2.880 | viñeta de cada dato | lista con raya fina o check lineal monocromo, nunca verde |
| [celular] | 575 | antecede al teléfono | icono lineal de WhatsApp o teléfono |
| [casa][llave][apretón de manos] | 541 a 566 | cierre de firma | sistema de tres iconos lineales: casa = propiedad, llave = entrega, apretón = trato |
| [dedo señalando al espectador] | 84 | "para ti" | se traduce en el copy ("para ti"), no en un icono |
| [información] | 31 | "más información" | — |
| [manos rezando] | 13 | gratitud | no se usa en la web |

---

## 6. Hashtags

Los más usados: #propiedadesdelujo (406), #realestate (391), #realtor (327), #casasdelujo (312), #casasenventa (247), #propiedadesenventa (212), #luxuryhome (138), #apartamentosdelujo (88).
**En 2026 los abandonó:** 2 publicaciones con hashtags de 98, frente a 235 de 266 en 2024. Es coherente con un perfil que se vuelve más sobrio.

---

## 7. Territorio

| Zona | Publicaciones que la mencionan |
|---|---|
| Ruitoque (Condominio, Bajo, Alto, Punta Ruitoque) | 97 |
| Lagos del Cacique y conjuntos del lago (Loma del Lago, Peñón del Lago, Palmar del Lago, Campestre del Lago) | 76 |
| Cañaveral | 20 |
| Cartagena (centro histórico, Cielo Mar) | 18, de mayo de 2024 a diciembre de 2025 |
| Isla Barú | 11 |
| Floridablanca | 11 |
| Cabecera | 10 |
| Terrazas de Menzuly / Mensulí | 8 |
| Mesa de los Santos | 7 |
| Panamá (Santa María, ciudad de Panamá) | 7, de junio de 2025 a julio de 2026 |
| Piedecuesta | 6 |

Conjuntos que más se repiten en la primera línea: Toscana, Loma del Lago, Valle de Rocas, La Cima, Casa Buenavista, Cabaña Náutica, Avanti, Club House, La Gran Reserva, Peñón del Lago, Aqua Tower y Calatrava.

**Expansión geográfica:** "llegamos a la costa caribe" (C7p2NnQt1hC, 2024-06-01); "estaré encontrando las mejores propiedades en el caribe colombiano para ti y en el extranjero para tu mejor inversión muy pronto" (DBypRf6pZLp, 2024-10-31); Panamá desde 2025: "inversión segura y dolarizada" (DYxNoyyuInN, fijada) y "Diversifica tu inversión en dólares en Panamá" (DZLATsauS5e).

---

## 8. Portafolio y precios

- **Inmuebles distintos con precio publicado:** 204, deduplicados por título.
- **Rango:** $350 millones a $9.000 millones. **Mediana: $1.675 millones.**
- **Tramos:** menos de $500 M: 5 · $500 a 999 M: 54 · $1.000 a 1.999 M: 64 · $2.000 a 3.999 M: 59 · $4.000 M o más: 22.
- **Precio a la vista:** 349 de 387 fichas lo muestran. El "precio reservado" no es su práctica habitual. En la web debe ser opcional y no la norma.
- **Operación:** sobre todo venta. Renta o arriendo en 13 publicaciones; por ejemplo, Punta Ruitoque con canon de $12.000.000, o $16.000.000 amoblada (DNiybMANt0s).
- **Comercial:** solo 8 publicaciones (bodegas en parque industrial, Centro Industrial Logístico San Jorge, oficinas de 51 a 179 m², un edificio comercial). Lo comercial es marginal en su contenido aunque figure en la bio.
- **Proyectos sobre planos (22 publicaciones), todos con Sumas Construcciones:**
  - Premium Park (Floridablanca): 28 lotes de 650 a 705 m² en un terreno de 37.000 m² (DIEuWigpGBM).
  - Manga (Ruitoque Alto): 20 casas de un nivel con rooftop, diseño con cinco arquitectos interioristas de Bucaramanga (DR0irTqDFzA). "De las 20 unidades, vendidas 8 en 3 meses" (DU1eZxBjlFi).
  - Amarí (barrio Álvarez): entrega inmediata y a 40 meses (DXkqOUhETB3).
  - "Ahora con la constructora Sumas uniendo fuerzas para llevarles los mejores proyectos sobre planos" (DbkyS_FyM8o, 2026-08-03).
- **Nuevos segmentos en 2026:** vivienda para mayores de 50 ("pensado para clientes 50+", Dbg--g8O35e) y un evento de preventa con cupos limitados (DbhJsc9ODxJ).

---

## 9. Datos biográficos que aparecen en el feed

| Dato | Texto literal | Código y fecha |
|---|---|---|
| Años en el sector | "mi nombre es Hugo Sánchez y tengo 14 años en el sector inmobiliario" | DAQeZcUJgjU, 2024-09-23 |
| Trayectoria | "Con más de 20 años de trayectoria en los sectores financiero, constructor e inmobiliario" (carrusel en tercera persona) | DTxikA9jMNz, 2026-01-21 |
| Cargo | "Director Comercial de Constructora Valderrama en Bucaramanga, dónde ha liderado equipos de alto desempeño y lanzamientos residenciales exitosos" | DTxikA9jMNz |
| Posicionamiento | "se ha posicionado como un referente en propiedades de lujo" | DTxikA9jMNz |
| Reconocimiento | "Gracias a Horror Broker Colombia por esta nominación" | DPNSEpdjHhL, 2025-09-30 |
| Feria | "Te esperamos en expovivienda Santander en Neomundo… en el mejor stand de la feria" | Dbgy05Dy6yA, 2026-08-01 |
| Captación | "quieres que tu propiedad tenga alcance en venta y visual?? Contáctame" | DXNtaugDMVc, 2026-04-17 |
| Captación | "Quieres llevar tu propiedad a otro nivel de venta??" | C8t3x74uD9F, 2024-06-27 |

Las dos cifras son compatibles: 14 años en finca raíz en 2024 (desde 2010, aproximadamente) y más de 20 años si se suman el sector financiero y el constructor.

---

## 10. Conclusiones para la marca

1. **El formato nativo es el video recorrido.** El 90 % son reels. La web debe abrir con video, no con un carrusel de fotos.
2. **Tiene tres frases propias, cada una con su función:** el manifiesto ("El verdadero lujo… es el acceso"), el lema ("Como siempre encontrando las mejores propiedades para ti") y el llamado ("Coordina tu visita").
3. **La ficha es parte de la marca.** Sus clientes ya están acostumbrados a ese orden de datos y conviene respetarlo.
4. **La prueba social existe pero está dispersa.** 32 cierres con agradecimientos, la nominación de Horror Brokers, la alianza con Sumas, Expovivienda y la dirección comercial en Valderrama.
5. **El tono va hacia la sobriedad:** menos hashtags, menos volumen, más proyectos y textos firmados. La web debe expresar la versión 2026 de Hugo, no la de 2024.
