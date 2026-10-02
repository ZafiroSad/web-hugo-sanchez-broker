export type PropertyOperation = 'Venta' | 'Arriendo';

export const PROPERTY_TYPES = [
  'Casa',
  'Casa campestre',
  'Cabaña',
  'Apartamento',
  'Penthouse',
  'Dúplex',
  'Finca',
  'Lote',
  'Bodega',
  'Oficina',
  'Local',
  'Proyecto',
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_STATUSES = [
  'Disponible',
  'Próximamente',
  'Reservado',
  'Vendido',
  'Arrendado',
  'Oculto',
] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export type LocationPrecision = 'approximated' | 'exact';

/** La ficha de Hugo, en el mismo orden en que la escribe en Instagram. */
export interface PropertySpecs {
  /** Área construida, o área total en apartamentos (m²). */
  builtArea?: number;
  /** Área privada construida (m²), cuando la publica aparte. */
  privateArea?: number;
  /** Área del lote (m²). */
  plotArea?: number;
  bedrooms?: number;
  /** «Habitaciones 4 (incluye servicio)». */
  includesServiceRoom?: boolean;
  bathrooms?: number;
  parkingSpots?: number;
  /** Depósitos o bodegas. */
  storageRooms?: number;
  floors?: number;
  stratum?: number;
}

/** Para conjuntos con varias unidades a la venta (por ejemplo, Green House). */
export interface PropertyUnit {
  name: string;
  plotArea?: number;
  builtArea?: number;
  price?: number;
}

export interface Property {
  /** Identificador legible; también es la dirección de la ficha (#/propiedad/<id>). */
  id: string;
  name: string;
  operation: PropertyOperation;
  propertyType: PropertyType;
  status: PropertyStatus;
  featured?: boolean;

  /** Precio de venta, o canon mensual en arriendo. */
  price?: number;
  /** «Desde» (conjuntos con varias unidades). */
  priceIsFrom?: boolean;
  negotiable?: boolean;
  /** Oculta el precio y muestra «Precio a consultar». */
  priceOnRequest?: boolean;
  /** Valor de la administración mensual. */
  adminFee?: number;
  /** «Incluye administración» (arriendos). */
  adminIncluded?: boolean;
  currency: 'COP' | 'USD';

  country: string;
  city: string;
  /** Zona o sector: Ruitoque Condominio, Lagos del Cacique, Cañaveral… */
  sector: string;
  /** Dirección privada: solo se muestra en el panel. */
  address?: string;
  coordinates?: { lat: number; lng: number };
  locationPrecision: LocationPrecision;

  /** Frase de apertura, en la voz de Hugo. */
  headline: string;
  /** Texto de la publicación, sin emojis y con las erratas corregidas. */
  description: string;
  /** Espacios de la propiedad (sala, comedor, cocina concepto abierto…). */
  spaces: string[];
  /** Zonas comunes y dotaciones (piscina, jacuzzi, paneles solares…). */
  amenities: string[];
  specs: PropertySpecs;
  units?: PropertyUnit[];

  /** Enlace del recorrido en video: reel de Instagram, YouTube o un .mp4. */
  video?: string;
  /** Fotografías opcionales (enlaces). Si no hay, la tarjeta usa la portada tipográfica. */
  images: string[];

  /** Fecha de la publicación original en Instagram (AAAA-MM-DD). */
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type PriceRange = 'Todos' | 'hasta-1000' | '1000-2000' | '2000-4000' | 'mas-4000';

export interface PropertyFilterState {
  operation: 'Todas' | PropertyOperation;
  propertyType: 'Todos' | PropertyType;
  sector: string;
  priceRange: PriceRange;
  bedrooms?: number;
  minArea?: number;
  searchQuery: string;
}
