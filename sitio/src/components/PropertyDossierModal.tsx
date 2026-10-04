import React from 'react';
import { Printer, X } from 'lucide-react';
import type { Property } from '../types/property';
import { MARCA } from '../config/marca';
import { formatArea, formatCurrency, priceLabel, propertyUrl, specsLine } from '../utils/formatters';
import { PropertyCover } from './PropertyCover';

/**
 * Ficha para imprimir o guardar en PDF y mandar por WhatsApp. Al imprimir,
 * las reglas de index.css ocultan todo lo demás de la página.
 */
export const PropertyDossierModal: React.FC<{ property: Property; isOpen: boolean; onClose: () => void }> = ({
  property,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const precio = priceLabel(property);
  const s = property.specs;
  const datos: [string, string][] = [
    ['Área de lote', formatArea(s.plotArea)],
    ['Área construida', formatArea(s.builtArea)],
    ['Habitaciones', s.bedrooms ? `${s.bedrooms}${s.includesServiceRoom ? ' (incluye servicio)' : ''}` : ''],
    ['Baños', s.bathrooms ? String(s.bathrooms) : ''],
    ['Parqueaderos', s.parkingSpots ? String(s.parkingSpots) : ''],
    ['Depósito', s.storageRooms ? String(s.storageRooms) : ''],
    ['Estrato', s.stratum ? String(s.stratum) : ''],
    ['Administración', property.adminFee ? formatCurrency(property.adminFee) : property.adminIncluded ? 'Incluida' : ''],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="zona-impresion relative w-full max-w-3xl overflow-hidden rounded-[4px] bg-white shadow-2xl">
        <div className="no-imprimir flex items-center justify-between border-b border-negro/10 bg-hueso px-5 py-3">
          <span className="versalitas text-[9.5px] text-taupe">Ficha de la propiedad</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-negro px-4 py-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-hueso"
            >
              <Printer className="h-3.5 w-3.5" /> Imprimir o guardar PDF
            </button>
            <button type="button" onClick={onClose} className="p-2 text-taupe hover:text-negro" aria-label="Cerrar">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-7 p-7 sm:p-10">
          <header className="flex items-end justify-between gap-6 border-b border-negro pb-5">
            <div>
              <p className="text-[10px] font-light tracking-[0.34em] text-negro">HUGO SÁNCHEZ</p>
              <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.3em] text-taupe">Broker inmobiliario</p>
            </div>
            <p className="text-right text-[10px] text-taupe">
              {MARCA.telefonoVisible}
              <br />@{MARCA.instagram.usuario}
            </p>
          </header>

          <div className="aspect-[16/7] overflow-hidden rounded-[2px]">
            <PropertyCover property={property} size="hero" />
          </div>

          <div>
            <p className="versalitas text-[9.5px] text-taupe">
              {property.operation} · {property.propertyType} · {property.sector}
            </p>
            <h1 className="mt-3 text-[26px] font-light uppercase tracking-[0.02em] font-stretch-semi-expanded text-negro">{property.name}</h1>
            <p className="mt-2 text-[14px] text-grafito">{property.headline}</p>
          </div>

          <div className="grid gap-6 border-y border-negro/10 py-5 sm:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Valor</p>
              <p className="mt-1 text-[22px] font-light tabular-nums text-negro">{precio.principal}</p>
              {precio.detalle && <p className="mt-1 text-[11px] text-bronce">{precio.detalle}</p>}
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {datos.map(([etiqueta, valor]) => (
                <div key={etiqueta}>
                  <dt className="text-[9.5px] uppercase tracking-[0.14em] text-taupe">{etiqueta}</dt>
                  <dd className="text-[13px] font-medium tabular-nums text-negro">{valor}</dd>
                </div>
              ))}
            </dl>
          </div>

          {property.units && property.units.length > 0 && (
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="text-[9.5px] uppercase tracking-[0.14em] text-taupe">
                  <th className="py-2">Unidad</th>
                  <th className="py-2">Lote</th>
                  <th className="py-2">Construida</th>
                  <th className="py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {property.units.map((u) => (
                  <tr key={u.name} className="border-t border-negro/10 tabular-nums">
                    <td className="py-2">{u.name}</td>
                    <td className="py-2">{formatArea(u.plotArea)}</td>
                    <td className="py-2">{formatArea(u.builtArea)}</td>
                    <td className="py-2 text-right">{formatCurrency(u.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(property.spaces.length > 0 || property.amenities.length > 0) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {property.spaces.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Espacios</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-grafito">{property.spaces.join(' · ')}</p>
                </div>
              )}
              {property.amenities.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Zonas comunes y dotaciones</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-grafito">{property.amenities.join(' · ')}</p>
                </div>
              )}
            </div>
          )}

          <p className="whitespace-pre-line text-[12.5px] leading-relaxed text-grafito">{property.description}</p>

          <footer className="flex flex-col justify-between gap-2 border-t border-negro/10 pt-5 text-[10.5px] text-taupe sm:flex-row">
            <span>{specsLine(property)}</span>
            <span className="break-all">{propertyUrl(property.id)}</span>
          </footer>
          <p className="titular text-center text-[16px] font-light text-negro">{MARCA.slogan}</p>
        </div>
      </div>
    </div>
  );
};
