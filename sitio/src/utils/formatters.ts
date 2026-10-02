import { MARCA } from '../config/marca';
import type { Property } from '../types/property';

/** 1450000000 -> "$1.450.000.000" */
export function formatCurrency(amount?: number): string {
  if (amount === undefined || Number.isNaN(amount)) return '';
  return `$${Math.round(amount).toLocaleString('es-CO')}`;
}

/** 9000000000 -> "$9.000 M" (para la marquesina y textos compactos). */
export function formatMillions(amount?: number): string {
  if (!amount) return '';
  const millones = amount / 1_000_000;
  return `$${millones.toLocaleString('es-CO', { maximumFractionDigits: 1 })} M`;
}

/** 152.74 -> "152,74 m²" */
export function formatArea(m2?: number): string {
  if (!m2) return '';
  return `${m2.toLocaleString('es-CO', { maximumFractionDigits: 2 })} m²`;
}

export function formatPricePerSqm(price?: number, area?: number): string {
  if (!price || !area) return '';
  return `${formatCurrency(price / area)}/m²`;
}

export function formatDate(iso: string): string {
  const fecha = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** "CONJUNTO MANSIÓN DEL LAGO" -> "Conjunto Mansión del Lago" */
export function titleCase(text: string): string {
  const menores = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'en', 'el']);
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((palabra, i) =>
      i > 0 && menores.has(palabra) ? palabra : palabra.charAt(0).toUpperCase() + palabra.slice(1)
    )
    .join(' ');
}

/** Etiqueta del precio tal como la escribe Hugo, con sus variantes. */
export function priceLabel(p: Property): { principal: string; detalle: string } {
  if (p.priceOnRequest || !p.price) {
    return { principal: 'Precio a consultar', detalle: '' };
  }
  const desde = p.priceIsFrom ? 'Desde ' : '';
  const principal = `${desde}${formatCurrency(p.price)}`;
  const partes: string[] = [];
  if (p.operation === 'Arriendo') partes.push('Canon mensual');
  if (p.adminIncluded) partes.push('incluye administración');
  if (p.negotiable) partes.push('Negociable');
  return { principal, detalle: partes.join(' · ') };
}

/** "218 m² · 4 hab. · 5 baños · 2 parq." */
export function specsLine(p: Property): string {
  const s = p.specs;
  const partes: string[] = [];
  if (p.units && p.units.length > 1) {
    const areas = p.units.map((u) => u.builtArea).filter((a): a is number => !!a);
    partes.push(`${p.units.length} casas`);
    if (areas.length) {
      partes.push(`${Math.floor(Math.min(...areas))} a ${Math.floor(Math.max(...areas))} m²`);
    }
    return partes.join(' · ');
  }
  if (s.builtArea) partes.push(formatArea(s.builtArea));
  else if (s.plotArea) partes.push(`Lote de ${formatArea(s.plotArea)}`);
  if (s.bedrooms) partes.push(`${s.bedrooms} hab.`);
  if (s.bathrooms) partes.push(`${s.bathrooms} baños`);
  if (s.parkingSpots) partes.push(`${s.parkingSpots} parq.`);
  return partes.join(' · ');
}

export function propertyUrl(id: string): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#/propiedad/${id}`;
}

export function whatsappUrl(mensaje: string): string {
  return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensaje ya escrito para coordinar la visita de una propiedad concreta. */
export function visitMessage(p: Property): string {
  return `Hola Hugo, quiero coordinar una visita a ${titleCase(p.name)} (${p.sector}). La vi en tu página: ${propertyUrl(p.id)}`;
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
