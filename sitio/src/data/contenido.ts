/**
 * Videos y textos de la portada que no son fichas de propiedad: cierres de
 * negocio, el manifiesto y las líneas de inversión. Todo sale de publicaciones
 * reales de Hugo (código del reel y fecha).
 */

export interface PiezaVideo {
  codigo: string;
  fecha: string;
  titulo: string;
  texto: string;
}

export const reelUrl = (codigo: string) => `https://www.instagram.com/reel/${codigo}/`;

/** Sus palabras después de cada cierre. Se muestran como testimonio propio, no de clientes. */
export const CIERRES: PiezaVideo[] = [
  {
    codigo: 'DdCKpD-yE6e',
    fecha: '2026-09-08',
    titulo: 'Vendida · septiembre 2026',
    texto:
      'Mil gracias a nuestros propietarios por la confianza depositada en nuestro profesionalismo, y felicitaciones a nuestros nuevos propietarios por tan importante adquisición. Que cumplan todos sus sueños en esta hermosa propiedad.',
  },
  {
    codigo: 'DXIMfmwjsPi',
    fecha: '2026-04-14',
    titulo: 'Vendida · abril 2026',
    texto:
      'Agradecer a los propietarios por la confianza depositada en nuestro profesionalismo y felicitar a los nuevos propietarios. Que disfruten esta magnífica propiedad.',
  },
  {
    codigo: 'DRvD_a5jl34',
    fecha: '2025-12-01',
    titulo: 'Vendida · diciembre 2025',
    texto:
      'A los propietarios, gracias por confiar en nosotros y permitirnos acompañar la venta de su propiedad. A los compradores, gracias por creer en nuestro profesionalismo. Fue un honor servirles.',
  },
  {
    codigo: 'DKw-1bcMBfl',
    fecha: '2025-06-11',
    titulo: 'Vendida · junio 2025',
    texto:
      'A los propietarios, gracias por depositar en mí la responsabilidad de representar su propiedad. Valoro profundamente su confianza. Y a los nuevos propietarios, ¡felicitaciones! Hoy comienza una nueva historia.',
  },
];

export const MANIFIESTO_VIDEO: PiezaVideo = {
  codigo: 'DSiET7kDs6X',
  fecha: '2025-12-21',
  titulo: 'El verdadero lujo',
  texto: 'El verdadero lujo en el sector inmobiliario es el acceso. Y no todos lo tienen.',
};

export const INVERSION: (PiezaVideo & { etiqueta: string; mensaje: string; puntos: string[] })[] = [
  {
    codigo: 'DR0irTqDFzA',
    fecha: '2025-12-04',
    etiqueta: 'Proyectos sobre planos',
    titulo: 'Con Constructora Sumas',
    texto:
      'Hugo comercializa proyectos de Sumas Construcciones en Bucaramanga, sobre planos y de entrega inmediata.',
    puntos: [
      'Manga, en Ruitoque Alto: 20 casas exclusivas de un solo nivel, con rooftop y diseño personalizado con un arquitecto interiorista.',
      'Amarí, en el barrio Álvarez: apartamentos de entrega inmediata y a 40 meses.',
    ],
    mensaje: 'Hola Hugo, quiero información sobre los proyectos sobre planos con Constructora Sumas.',
  },
  {
    codigo: 'DZIqlzFyxRL',
    fecha: '2026-06-03',
    etiqueta: 'Panamá',
    titulo: 'Inversión en dólares',
    texto:
      'Una inversión segura y dolarizada: proyectos sobre planos y de entrega inmediata en las mejores ubicaciones de ciudad de Panamá.',
    puntos: [
      'Comunidad Santa María, recorrida por uno de los mejores campos de golf de Latinoamérica.',
      'Proyectos respaldados por las mejores constructoras, para diversificar tu patrimonio en dólares.',
    ],
    mensaje: 'Hola Hugo, quiero información sobre los proyectos de inversión en Panamá.',
  },
];
