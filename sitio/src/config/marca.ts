/**
 * Todo lo que identifica a Hugo vive aquí. Cambiar un dato (teléfono, redes,
 * textos de confianza) en este archivo lo cambia en toda la página.
 *
 * Los textos salen de sus propias publicaciones y de su bio de Instagram
 * (ver investigacion/05-analisis-feed.md). Nada se inventa: lo que no está
 * confirmado queda fuera hasta que el cliente lo apruebe.
 */

import type { CapituloId } from '../utils/router';

export const MARCA = {
  nombre: 'Hugo Sánchez',
  nombreMayusculas: 'HUGO SÁNCHEZ',
  titulo: 'Broker inmobiliario',
  ciudad: 'Bucaramanga',
  pais: 'Colombia',

  slogan: 'Como siempre, encontrando las mejores propiedades para ti',
  manifiesto: 'El verdadero lujo en el sector inmobiliario es el acceso. Y no todos lo tienen.',
  captacion: 'Vendo tu propiedad y te vendo la de tus sueños.',

  /** Un solo lugar para el número: en Instagram aparece mal escrito en 12 publicaciones. */
  telefonoVisible: '+57 300 890 5794',
  whatsapp: '573008905794',

  instagram: {
    usuario: 'hugosanchezmarzan',
    url: 'https://www.instagram.com/hugosanchezmarzan/',
  },
  tiktok: {
    usuario: 'hugosanchez477',
    url: 'https://www.tiktok.com/@hugosanchez477',
  },
  threads: {
    usuario: 'hugosanchezmarzan',
    url: 'https://www.threads.com/@hugosanchezmarzan',
  },

  /** PIN del panel de administración (los cambios solo viven en el navegador que los hace). */
  pinAdmin: '1234',
} as const;

/** Retrato de Hugo para «Sobre Hugo»: el de su reel fijado del manifiesto, sin la frase escrita encima. */
export const RETRATO = './fotos/hugo/01.webp';

/**
 * Los capítulos del sitio. El inicio es un menú: cada capítulo tiene su
 * baldosa ahí y su propia página (#/<id>), y al final de cada página «Sigue
 * explorando» lleva a los demás. Así nadie tiene que recorrer el sitio de
 * arriba abajo para llegar a lo que busca. Sin foto, la baldosa va en negro.
 */
export interface Capitulo {
  id: CapituloId;
  etiqueta: string;
  titulo: string;
  /** Título de la pestaña del navegador. */
  pagina: string;
  foto?: string;
  /** Punto de la foto que se conserva al recortarla (object-position). */
  encuadre?: string;
}

export const CAPITULOS: Capitulo[] = [
  {
    id: 'hugo',
    etiqueta: 'Sobre Hugo',
    titulo: 'Más de 20 años de trayectoria',
    pagina: 'Sobre Hugo',
    foto: RETRATO,
    encuadre: '50% 16%',
  },
  {
    id: 'inversion',
    etiqueta: 'Inversión',
    titulo: 'Sobre planos y en dólares',
    pagina: 'Inversión',
    foto: './fotos/inversion/02.webp',
  },
  {
    id: 'vendidas',
    etiqueta: 'Vendidas',
    titulo: 'Cada cierre, contado por Hugo',
    pagina: 'Vendidas',
    foto: './fotos/vendidas/01.webp',
    // El rótulo «VENDIDO» del cuadro va a media altura: se muestra la parte de abajo para que no choque con el título.
    encuadre: '50% 100%',
  },
  { id: 'vender', etiqueta: 'Para propietarios', titulo: 'Vende tu propiedad con Hugo', pagina: 'Vende tu propiedad' },
];

export const BIO = {
  corta:
    'Broker inmobiliario especializado en propiedades de lujo y comerciales en Bucaramanga y su área metropolitana.',
  trayectoria: 'Más de 20 años de trayectoria en los sectores financiero, constructor e inmobiliario.',
  larga: [
    'Recorro personalmente cada propiedad y te la muestro tal como es, con fotos reales, su ficha completa y su precio, para que llegues a la visita sabiendo lo que vas a encontrar.',
    'Hoy acompaño la compra y venta de casas campestres, apartamentos y lotes en Ruitoque, Lagos del Cacique y Cañaveral; comercializo proyectos sobre planos con Sumas Construcciones y oportunidades de inversión en dólares en ciudad de Panamá.',
    'Te acompaño en la búsqueda de tu propiedad ideal o de tu próxima inversión, desde la primera conversación hasta la entrega de las llaves.',
  ],
  cita: 'Esta profesión es mi pasión.',
};

/** Cifras y credenciales verificables en sus propias publicaciones. */
export const CONFIANZA = [
  {
    valor: '20+',
    etiqueta: 'Años de trayectoria',
    detalle: 'En los sectores financiero, constructor e inmobiliario.',
  },
  {
    valor: '24,5 mil',
    etiqueta: 'Seguidores en Instagram',
    detalle: 'Cuenta verificada, donde publica cada propiedad en video.',
  },
  {
    valor: '2025',
    etiqueta: 'Nominado por Horror Brokers',
    detalle: 'A «Las 20 Promesas del Real Estate en Colombia».',
  },
] as const;

export const PILARES = [
  {
    titulo: 'Acceso',
    texto:
      'Propiedades que no siempre llegan a los portales. El verdadero lujo es el acceso, y Hugo te lo abre.',
  },
  {
    titulo: 'Recorrida por Hugo',
    texto:
      'Hugo recorre cada inmueble en persona: aquí ves sus fotos reales y en su Instagram, el recorrido en video.',
  },
  {
    titulo: 'Ficha clara y precio a la vista',
    texto:
      'Área, habitaciones, baños, parqueaderos, administración y valor. Sin rodeos y con precio negociable cuando aplica.',
  },
  {
    titulo: 'Acompañamiento personal',
    texto:
      'Te acompaña desde la primera conversación hasta la entrega de las llaves, como propietario o como comprador.',
  },
] as const;

/** Su firma de cierre en redes: casa, llave y apretón de manos. */
export const PROCESO = [
  {
    icono: 'casa',
    titulo: 'Encontramos tu propiedad',
    texto: 'Me cuentas qué buscas o qué quieres vender. Te muestro opciones reales, con fotos y ficha completa.',
  },
  {
    icono: 'llave',
    titulo: 'Coordinamos la visita',
    texto: 'Recorremos juntos la propiedad y resolvemos cada duda: áreas, administración y negociación.',
  },
  {
    icono: 'trato',
    titulo: 'Cerramos el negocio',
    texto: 'Te acompaño en la negociación y hasta la entrega de las llaves.',
  },
] as const;
