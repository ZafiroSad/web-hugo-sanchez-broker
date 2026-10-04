import React from 'react';
import { ArrowRight, Trash2, X } from 'lucide-react';
import type { Property } from '../types/property';
import { formatArea, formatCurrency, formatPricePerSqm, priceLabel } from '../utils/formatters';
import { navigate } from '../utils/router';
import { PropertyCover } from './PropertyCover';

/** Compara hasta tres propiedades con los datos de la ficha de Hugo. */
export const PropertyComparisonModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}> = ({ isOpen, onClose, properties, onRemove, onClearAll }) => {
  if (!isOpen || properties.length === 0) return null;

  const filas: { etiqueta: string; valor: (p: Property) => string }[] = [
    { etiqueta: 'Valor', valor: (p) => priceLabel(p).principal },
    { etiqueta: 'Operación', valor: (p) => `${p.operation} · ${p.propertyType}` },
    { etiqueta: 'Zona', valor: (p) => p.sector },
    { etiqueta: 'Área construida', valor: (p) => formatArea(p.specs.builtArea) || '—' },
    { etiqueta: 'Área de lote', valor: (p) => formatArea(p.specs.plotArea) || '—' },
    {
      etiqueta: 'Valor por m²',
      valor: (p) => (p.operation === 'Venta' && !p.priceOnRequest ? formatPricePerSqm(p.price, p.specs.builtArea) : '') || '—',
    },
    {
      etiqueta: 'Habitaciones',
      valor: (p) => (p.specs.bedrooms ? `${p.specs.bedrooms}${p.specs.includesServiceRoom ? ' (incl. servicio)' : ''}` : '—'),
    },
    { etiqueta: 'Baños', valor: (p) => (p.specs.bathrooms ? String(p.specs.bathrooms) : '—') },
    { etiqueta: 'Parqueaderos', valor: (p) => (p.specs.parkingSpots ? String(p.specs.parkingSpots) : '—') },
    {
      etiqueta: 'Administración',
      valor: (p) => (p.adminFee ? formatCurrency(p.adminFee) : p.adminIncluded ? 'Incluida' : '—'),
    },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-negro/10 px-6 py-5">
          <div>
            <p className="versalitas text-[9.5px] text-taupe">Comparar</p>
            <h3 className="titular mt-1 text-[20px] font-light leading-tight">
              {properties.length} {properties.length === 1 ? 'propiedad' : 'propiedades'}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onClearAll} className="text-[11px] text-taupe underline underline-offset-4 hover:text-negro">
              Limpiar
            </button>
            <button type="button" onClick={onClose} className="p-2 text-taupe hover:text-negro" aria-label="Cerrar">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40 pb-6" />
                {properties.map((p) => (
                  <th key={p.id} className="px-3 pb-6 align-top font-normal">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
                      <PropertyCover property={p} size="mini" />
                      <button
                        type="button"
                        onClick={() => onRemove(p.id)}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black"
                        title="Quitar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.1em] text-negro">{p.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(`propiedad/${p.id}`);
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-negro underline underline-offset-4"
                    >
                      Ver propiedad <ArrowRight className="h-3 w-3" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {filas.map((fila) => (
                <tr key={fila.etiqueta} className="border-t border-negro/10">
                  <td className="py-3 pr-3 text-[10.5px] uppercase tracking-[0.14em] text-taupe">{fila.etiqueta}</td>
                  {properties.map((p) => (
                    <td key={p.id} className="px-3 py-3 tabular-nums text-negro">
                      {fila.valor(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
