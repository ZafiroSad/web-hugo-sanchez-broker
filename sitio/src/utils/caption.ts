import type { PropertyOperation, PropertySpecs, PropertyType } from '../types/property';
import { ZONAS } from '../data/zonas';

/**
 * Lee el texto de una publicación de Hugo y extrae su ficha. Él escribe
 * siempre con la misma plantilla (nombre, zona entre paréntesis y una línea
 * con check por dato), así que pegar el texto de Instagram en el panel llena
 * casi todo el formulario de una vez.
 */
export interface CaptionResult {
  name?: string;
  city?: string;
  sector?: string;
  operation?: PropertyOperation;
  propertyType?: PropertyType;
  price?: number;
  negotiable?: boolean;
  adminFee?: number;
  adminIncluded?: boolean;
  specs: PropertySpecs;
  spaces: string[];
  amenities: string[];
  headline?: string;
  video?: string;
  found: string[];
}

const CIUDADES = ['Bucaramanga', 'Floridablanca', 'Piedecuesta', 'Girón', 'Cartagena', 'Lebrija', 'Panamá'];
const AMENIDADES = /piscina|jacuzzi|turco|sauna|gimnasio|paneles solares|minigolf|cancha|salón social|bbq|zona de juegos|senderos|lago/i;

/** "1.450.000.000" -> 1450000000 ; "152,74" -> 152.74 ; "950,000,000" -> 950000000 */
export function parseNumberCO(raw: string): number | undefined {
  let s = raw.replace(/[^\d.,]/g, '');
  if (!s) return undefined;
  const decimalComa = /,\d{1,2}$/.test(s) && !/,\d{3}/.test(s);
  if (decimalComa) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else {
    s = s.replace(/[.,](?=\d{3}(\D|$))/g, '').replace(',', '.');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function limpiarLinea(linea: string): string {
  return linea
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{2060}]/gu, '')
    .replace(/^[\s*•·\-–]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function capitalizar(texto: string): string {
  const t = texto.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function tipoDesdeTexto(texto: string): PropertyType | undefined {
  const t = texto.toLowerCase();
  if (/penthouse|\bph\b/.test(t)) return 'Penthouse';
  if (/d[uú]plex/.test(t)) return 'Dúplex';
  if (/caba[ñn]a/.test(t)) return 'Cabaña';
  if (/hacienda|finca/.test(t)) return 'Finca';
  if (/bodega/.test(t)) return 'Bodega';
  if (/oficina/.test(t)) return 'Oficina';
  if (/local comercial/.test(t)) return 'Local';
  if (/\blote\b|predio/.test(t)) return 'Lote';
  if (/apartamento|edificio|torre/.test(t)) return 'Apartamento';
  if (/campestre/.test(t)) return 'Casa campestre';
  if (/casa|conjunto|condominio/.test(t)) return 'Casa';
  return undefined;
}

export function parseCaption(texto: string): CaptionResult {
  const resultado: CaptionResult = { specs: {}, spaces: [], amenities: [], found: [] };
  const lineas = texto.split(/\r?\n/).map(limpiarLinea).filter(Boolean);
  if (!lineas.length) return resultado;

  const video = texto.match(/https?:\/\/(?:www\.)?instagram\.com\/[^\s]+/i);
  if (video) resultado.video = video[0];

  const esDato = (l: string) =>
    /^(área|area|atea|\d+\s*habitaci|habitaci|\d+\s*baño|baño|parqueader|dep[oó]sito|valor|valir|vslor|vallr|precio|admon|administraci|canon|piso|pido|sala|estrato)/i.test(l);

  const tieneCiudad = (l: string) => CIUDADES.some((c) => l.toLowerCase().includes(c.toLowerCase()));

  // Zona: "(Bucaramanga/Ruitoque condominio)", "(Lagos del cacique Bucaramanga)" o "Pan de Azúcar – Bucaramanga",
  // siempre en las primeras líneas y sin números (así no se confunde con "(incluye servicio)").
  const primeras = lineas.slice(0, 4);
  const zona =
    primeras.find((l) => /^\(.+\)$/.test(l) && !/\d/.test(l)) ||
    primeras.find((l) => /\(.+\)/.test(l) && !/\d/.test(l) && tieneCiudad(l)) ||
    primeras.find((l) => tieneCiudad(l) && /[–\-\/,]/.test(l) && !/\d/.test(l) && l.length < 60);
  if (zona) {
    const dentro = (zona.match(/\(([^)]+)\)/) || [])[1] || zona;
    const partes = dentro.split(/[\/,–-]/).map((p) => p.trim()).filter(Boolean);
    const ciudad = partes.find((p) => tieneCiudad(p));
    if (ciudad) resultado.city = CIUDADES.find((c) => ciudad.toLowerCase().includes(c.toLowerCase()));
    let sector = partes.find((p) => p !== ciudad && !/^santander$/i.test(p)) || '';
    if (!sector && ciudad) sector = ciudad.replace(new RegExp(resultado.city || '', 'i'), '').trim();
    if (sector) resultado.sector = sector.split(' ').map((w) => capitalizar(w)).join(' ').replace(/\b(Del|De|La|Los)\b/g, (m) => m.toLowerCase());
    resultado.found.push('zona');
  }
  // Si no hay línea de zona, se busca una zona conocida en todo el texto (Ruitoque Condominio, Cañaveral…).
  if (!resultado.sector) {
    const conocida = Object.keys(ZONAS)
      .sort((a, b) => b.length - a.length)
      .find((z) => texto.toLowerCase().includes(z.toLowerCase()));
    if (conocida) resultado.sector = conocida;
    else if (resultado.city) resultado.sector = resultado.city;
  }
  if (resultado.sector) {
    const igual = Object.keys(ZONAS).find((z) => z.toLowerCase() === resultado.sector!.toLowerCase());
    if (igual) resultado.sector = igual;
  }

  // Nombre: la primera línea corta en mayúsculas o que empiece por Conjunto/Edificio/Casa…
  const candidata = lineas.find(
    (l) =>
      l !== zona &&
      !esDato(l) &&
      !/^\(/.test(l) &&
      (l === l.toUpperCase() || /^(conjunto|edificio|condominio|casa|cabaña|hacienda|torre|apartamento)/i.test(l)) &&
      /[A-ZÁÉÍÓÚÑ]{3}/i.test(l)
  );
  const nombre = candidata;
  if (candidata) {
    const corto = candidata
      .replace(/^(apartamento|casa|penthouse|lote)\s+en\s+(venta|arriendo)\s*[–-]\s*/i, '')
      .split(/\s+(?:ubicad[oa]|en venta|para estrenar|es\s)|[,.!¡]/i)[0]
      .trim();
    resultado.name = corto.toUpperCase();
    resultado.found.push('nombre');
  }

  // Frase de apertura: la primera línea que no es nombre, zona ni dato.
  const apertura = lineas.find(
    (l) =>
      l !== nombre &&
      l !== zona &&
      !esDato(l) &&
      !/^\(/.test(l) &&
      l.length > 25 &&
      !/\$|\d{7,}|#|^(carrera|calle|cra|cl|avenida|av)\b/i.test(l)
  );
  if (apertura) resultado.headline = capitalizar(apertura.replace(/^est[aá]\s/i, 'Esta ').replace(/[!¡]{2,}/g, '.'));

  for (const l of lineas) {
    const bajo = l.toLowerCase();
    const numero = (re: RegExp) => {
      const m = l.match(re);
      return m ? parseNumberCO(m[1]) : undefined;
    };

    if (/(área|area|atea)\s*(de\s*)?lote/i.test(l)) {
      resultado.specs.plotArea = numero(/lote\s*:?\s*([\d.,]+)/i);
    } else if (/(área|area)\s*privada/i.test(l)) {
      resultado.specs.privateArea = numero(/([\d.,]+)\s*m/i);
    } else if (/(área|area|atea)\s*(construida|total|casa)?\s*:?\s*[\d]/i.test(l) && !resultado.specs.builtArea) {
      resultado.specs.builtArea = numero(/([\d.,]+)\s*(m|metros)/i) ?? numero(/([\d.,]+)/);
    }

    if (/(habitaci[oó]n(es)?\s*:?\s*\d|^\d+\s*habitaci)/i.test(l) && !resultado.specs.bedrooms) {
      resultado.specs.bedrooms = numero(/habitaci[oó]n(?:es)?\s*:?\s*(\d+)/i) ?? numero(/^(\d+)\s*habitaci/i);
      if (/incluye(n)?\s+servicio/i.test(l)) resultado.specs.includesServiceRoom = true;
    }
    if (/(baños?\s*:?\s*\d|^\d+\s*baños)/i.test(l) && !resultado.specs.bathrooms) {
      resultado.specs.bathrooms = numero(/baños?\s*:?\s*(\d+)/i) ?? numero(/^(\d+)\s*baños/i);
    }
    if (/parqueader/i.test(l) && !resultado.specs.parkingSpots) {
      resultado.specs.parkingSpots =
        numero(/parqueader\w*\s*:?\s*(\d+)/i) ?? numero(/capacidad para\s*(\d+)/i) ?? numero(/^(\d+)\s*parqueader/i);
    }
    if (/^dep[oó]sito|bodega amplia/i.test(l)) {
      resultado.specs.storageRooms = numero(/(\d+)/) ?? 1;
    }
    if (/estrato\s*\d/i.test(l)) resultado.specs.stratum = numero(/estrato\s*(\d)/i);

    if (/(admon|administraci[oó]n)\s*:?\s*\$?\s*[\d]/i.test(l) && !/incluid|incluye|renta|canon/i.test(l)) {
      resultado.adminFee = numero(/(?:admon|administraci[oó]n)\s*:?\s*\$?\s*([\d.,]+)/i);
    }
    if (/canon/i.test(l)) {
      resultado.operation = 'Arriendo';
      resultado.price = numero(/\$\s*([\d.,]+)/);
      if (/incluye\s+administraci/i.test(l)) resultado.adminIncluded = true;
    } else if (/(valor|valir|vslor|vallr|precio)/i.test(l) && /\$/.test(l) && !/admon|administraci|renta/i.test(l) && !resultado.price) {
      resultado.price = numero(/\$\s*([\d.,]+)/);
    }
    if (/negociable/i.test(bajo)) resultado.negotiable = true;

    // Línea de espacios: "sala/comedor/cocina concepto abierto/terraza"
    if (l.includes('/') && /sala|comedor|cocina|hall|terraza|balc|estudio/i.test(l) && !/\(/.test(l)) {
      const items = l
        .replace(/^piso\s*-?\d+\s*:/i, '')
        .split('/')
        .map((s) => capitalizar(s.replace(/\bstar\b/gi, 'estar').replace(/\bBQ\b/g, 'BBQ').trim()))
        .filter((s) => s.length > 1);
      for (const item of items) {
        (AMENIDADES.test(item) ? resultado.amenities : resultado.spaces).push(item);
      }
    } else if (AMENIDADES.test(l) && !/\$|\(/.test(l) && l.length < 60 && !esDato(l) && l !== nombre && l !== zona && l !== apertura) {
      resultado.amenities.push(capitalizar(l));
    }
  }

  if (resultado.price) resultado.found.push('precio');
  if (resultado.specs.builtArea || resultado.specs.plotArea) resultado.found.push('áreas');
  if (resultado.specs.bedrooms) resultado.found.push('habitaciones');
  if (resultado.specs.bathrooms) resultado.found.push('baños');
  if (resultado.specs.parkingSpots) resultado.found.push('parqueaderos');
  if (resultado.adminFee) resultado.found.push('administración');
  if (resultado.spaces.length) resultado.found.push('espacios');

  resultado.propertyType = tipoDesdeTexto(`${resultado.name || ''} ${resultado.headline || ''}`);
  if (!resultado.operation && resultado.price) resultado.operation = 'Venta';
  return resultado;
}
