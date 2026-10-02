import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Check, Columns3, Play } from 'lucide-react';
import type { Property } from '../types/property';
import { useProperties } from '../context/PropertyContext';
import { priceLabel, specsLine } from '../utils/formatters';
import { navigate } from '../utils/router';
import { CURVA } from '../utils/motion';
import { PropertyCover } from './PropertyCover';

const ETIQUETA_ESTADO: Partial<Record<Property['status'], string>> = {
  Próximamente: 'Próximamente',
  Reservado: 'Reservada',
  Vendido: 'Vendida',
  Arrendado: 'Arrendada',
};

export const PropertyCard: React.FC<{ property: Property; index?: number }> = ({ property, index = 0 }) => {
  const { compareIds, toggleCompareProperty } = useProperties();
  const comparando = compareIds.includes(property.id);
  const precio = priceLabel(property);
  const estado = ETIQUETA_ESTADO[property.status];

  return (
    <motion.article
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.95, ease: CURVA.ios, delay: (index % 3) * 0.08 }}
      className="group relative flex min-w-0 flex-col"
    >
      <a
        href={`#/propiedad/${property.id}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`propiedad/${property.id}`);
        }}
        className="block"
        aria-label={`${property.name}, ${property.propertyType} en ${property.sector}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
          <PropertyCover property={property} />

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {property.operation === 'Arriendo' && (
              <span className="rounded-full bg-white/95 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-negro">
                Arriendo
              </span>
            )}
            {estado && (
              <span className="rounded-full bg-negro/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-hueso ring-1 ring-white/15 backdrop-blur">
                {estado}
              </span>
            )}
          </div>

          {property.video && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white ring-1 ring-white/15 backdrop-blur">
              <Play className="h-2.5 w-2.5 fill-white" /> Video
            </span>
          )}
        </div>
      </a>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="versalitas truncate text-[9.5px] text-taupe">
              {property.sector} · {property.propertyType}
            </p>
            <p className="mt-2 text-[17px] font-medium tabular-nums text-negro">{precio.principal}</p>
            {precio.detalle && <p className="mt-0.5 text-[11px] text-taupe">{precio.detalle}</p>}
          </div>
          <button
            type="button"
            onClick={() => toggleCompareProperty(property.id)}
            className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              comparando
                ? 'border-negro bg-negro text-hueso'
                : 'border-negro/15 text-taupe hover:border-negro/40 hover:text-negro'
            }`}
            title={comparando ? 'Quitar de la comparación' : 'Comparar'}
          >
            {comparando ? <Check className="h-3 w-3" /> : <Columns3 className="h-3 w-3" />}
            {comparando ? 'Comparando' : 'Comparar'}
          </button>
        </div>

        <p className="mt-3 text-[12.5px] text-grafito">{specsLine(property)}</p>

        <a
          href={`#/propiedad/${property.id}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`propiedad/${property.id}`);
          }}
          className="mt-4 inline-flex w-fit items-center gap-1.5 border-b border-negro/20 pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-negro transition-colors hover:border-negro"
        >
          Ver propiedad <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-ios group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.article>
  );
};
