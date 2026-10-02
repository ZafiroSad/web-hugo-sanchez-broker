import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Camera, Check, Columns3 } from 'lucide-react';
import type { Property } from '../types/property';
import { useProperties } from '../context/PropertyContext';
import { priceLabel, specsLine, titleCase } from '../utils/formatters';
import { navigate } from '../utils/router';
import { CURVA } from '../utils/motion';
import { Foto } from './Foto';
import { PropertyCover } from './PropertyCover';

const ETIQUETA_ESTADO: Partial<Record<Property['status'], string>> = {
  Próximamente: 'Próximamente',
  Reservado: 'Reservada',
  Vendido: 'Vendida',
  Arrendado: 'Arrendada',
};

/** Tarjeta como la de la beta: foto arriba y ficha corta en blanco debajo. */
export const PropertyCard: React.FC<{ property: Property; index?: number; prioridad?: boolean }> = ({
  property,
  index = 0,
  prioridad = false,
}) => {
  const { compareIds, toggleCompareProperty } = useProperties();
  const comparando = compareIds.includes(property.id);
  const precio = priceLabel(property);
  const estado = ETIQUETA_ESTADO[property.status];
  const foto = property.images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.9, ease: CURVA.ios, delay: (index % 3) * 0.07 }}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-negro/[0.08] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-shadow duration-500 hover:shadow-[0_14px_36px_rgba(0,0,0,0.09)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {foto ? (
          <Foto
            src={foto}
            alt={`${titleCase(property.name)}, ${property.propertyType.toLowerCase()} en ${property.sector}`}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            prioridad={prioridad}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-ios group-hover:scale-[1.04]"
          />
        ) : (
          <PropertyCover property={property} />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-white/95 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-negro shadow-sm">
            {property.operation}
          </span>
          {estado && (
            <span className="rounded-md bg-negro/90 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm">
              {estado}
            </span>
          )}
        </div>

        {property.images.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium tabular-nums text-white backdrop-blur-sm">
            <Camera className="h-3 w-3" /> {property.images.length}
          </span>
        )}
      </div>

      {/* Va por encima del enlace que cubre la tarjeta */}
      <button
        type="button"
        onClick={() => toggleCompareProperty(property.id)}
        className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] shadow-sm transition-colors ${
          comparando ? 'bg-negro text-white' : 'bg-white/90 text-negro backdrop-blur hover:bg-white'
        }`}
        title={comparando ? 'Quitar de la comparación' : 'Comparar'}
      >
        {comparando ? <Check className="h-3 w-3 text-oro" /> : <Columns3 className="h-3 w-3" />}
        {comparando ? 'Comparando' : 'Comparar'}
      </button>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="versalitas truncate text-[9.5px] text-bronce">
          {property.sector} · {property.propertyType}
        </p>
        <h3 className="mt-2.5 text-[15.5px] font-normal uppercase leading-snug tracking-[0.12em] text-negro">
          <a
            href={`#/propiedad/${property.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`propiedad/${property.id}`);
            }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {property.name}
          </a>
        </h3>
        <p className="mt-2 text-[12.5px] text-taupe">{specsLine(property)}</p>

        {/* Empuja el precio al pie para que las tarjetas de una fila queden alineadas */}
        <div aria-hidden="true" className="min-h-5 flex-1" />
        <div className="flex items-end justify-between gap-3 border-t border-negro/[0.06] pt-4">
          <div className="min-w-0">
            <p className="text-[18px] font-medium tabular-nums text-negro">{precio.principal}</p>
            {precio.detalle && <p className="mt-0.5 truncate text-[11px] text-taupe">{precio.detalle}</p>}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-negro">
            Ver
            <ArrowRight className="h-4 w-4 text-piedra transition-all duration-500 ease-ios group-hover:translate-x-1 group-hover:text-negro" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};
