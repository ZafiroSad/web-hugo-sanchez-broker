/**
 * Coordenadas APROXIMADAS por zona, para el mapa de cada ficha. Son el centro
 * de la zona, no la dirección del inmueble: el mapa dibuja un círculo amplio
 * y lo dice. Se corrigen desde el panel (arrastrando el punto en el mapa).
 */
export const ZONAS: Record<string, { lat: number; lng: number }> = {
  'Ruitoque Condominio': { lat: 7.0365, lng: -73.1185 },
  'Ruitoque Bajo': { lat: 7.0825, lng: -73.1395 },
  'Lagos del Cacique': { lat: 7.0968, lng: -73.0995 },
  'Cañaveral': { lat: 7.0718, lng: -73.0982 },
  'Pan de Azúcar': { lat: 7.1098, lng: -73.1036 },
  'Terrazas': { lat: 7.1079, lng: -73.1066 },
  'Cabecera': { lat: 7.1142, lng: -73.1087 },
  'Bolarquí': { lat: 7.1152, lng: -73.1149 },
  'Terrazas de Menzuly': { lat: 7.0355, lng: -73.0745 },
  'Piedecuesta': { lat: 6.9958, lng: -73.0512 },
  'Mesa de los Santos': { lat: 6.8795, lng: -73.0965 },
  'Floridablanca': { lat: 7.0622, lng: -73.0864 },
};

/** Orden de las zonas en los filtros: su territorio, de más a menos frecuente. */
export const ORDEN_ZONAS = [
  'Ruitoque Condominio',
  'Ruitoque Bajo',
  'Lagos del Cacique',
  'Cañaveral',
  'Terrazas de Menzuly',
  'Cabecera',
  'Pan de Azúcar',
  'Terrazas',
  'Bolarquí',
  'Piedecuesta',
  'Mesa de los Santos',
  'Floridablanca',
  'Bucaramanga',
];
