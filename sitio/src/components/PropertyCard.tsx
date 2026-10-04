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

/**
 * Tarjeta como la de la beta: foto arriba y ficha corta en blanco debajo.
 * `densa`: en el teléfono va en rejilla de dos columnas, así que queda solo lo
 * esencial (zona, nombre y precio); desde tableta se ve completa.
 */
export const PropertyCard: React.FC<{ property: Property; index?: number; prioridad?: boolean; densa?: boolean }> = ({
  property,
  index = 0,
  prioridad = false,
  densa = false,
}) => {
  const { compareIds, toggleCompareProperty } = useProperties();
  const comparando = compareIds.includes(property.id);
  const precio = priceLabel(property);
  const estado = ETIQUETA_ESTADO[property.status];
  const foto = property.images[0];
  // En modo denso, las clases sin prefijo son las del teléfono y las «sm:» devuelven la tarjeta completa
  const c = densa
    ? {
        etiquetas: 'left-2 top-2 gap-1 sm:left-3 sm:top-3 sm:gap-1.5',
        etiqueta: 'px-1.5 py-0.5 text-[8px] sm:px-2.5 sm:py-1 sm:text-[9.5px]',
        cuerpo: 'p-3 sm:p-6',
        zona: 'text-[8px] sm:text-[9.5px]',
        nombre: 'mt-1.5 line-clamp-2 text-[11.5px] leading-tight tracking-[0.02em] sm:mt-2.5 sm:line-clamp-none sm:text-[15.5px] sm:leading-snug sm:tracking-[0.03em]',
        ficha: 'hidden sm:block',
        hueco: 'min-h-2 sm:min-h-5',
        pie: 'pt-2.5 sm:pt-4',
        precio: 'text-[13.5px] sm:text-[18px]',
        detalle: 'hidden sm:block',
        ver: 'hidden sm:inline-flex',
        fotos: 'hidden sm:inline-flex',
      }
    : {
        etiquetas: 'left-3 top-3 gap-1.5',
        etiqueta: 'px-2.5 py-1 text-[9.5px]',
        cuerpo: 'p-5 sm:p-6',
        zona: 'text-[9.5px]',
        nombre: 'mt-2.5 text-[15.5px] leading-snug tracking-[0.03em]',
        ficha: '',
        hueco: 'min-h-5',
        pie: 'pt-4',
        precio: 'text-[18px]',
        detalle: '',
        ver: 'inline-flex',
        fotos: 'inline-flex',
      };

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

        <div className={`absolute flex flex-wrap ${c.etiquetas}`}>
          <span className={`rounded-md bg-white/95 font-semibold uppercase tracking-[0.16em] text-negro shadow-sm ${c.etiqueta}`}>
            {property.operation}
          </span>
          {estado && (
            <span className={`rounded-md bg-negro/90 font-semibold uppercase tracking-[0.16em] text-white shadow-sm ${c.etiqueta}`}>
              {estado}
            </span>
          )}
        </div>

        {property.images.length > 1 && (
          <span className={`absolute bottom-3 right-3 items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium tabular-nums text-white backdrop-blur-sm ${c.fotos}`}>
            <Camera className="h-3 w-3" /> {property.images.length}
          </span>
        )}
      </div>

      {/* Va por encima del enlace que cubre la tarjeta */}
      <button
        type="button"
        onClick={() => toggleCompareProperty(property.id)}
        className={`absolute right-3 top-3 z-10 hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] shadow-sm transition-colors sm:inline-flex ${
          comparando ? 'bg-negro text-white' : 'bg-white/90 text-negro backdrop-blur hover:bg-white'
        }`}
        title={comparando ? 'Quitar de la comparación' : 'Comparar'}
      >
        {comparando ? <Check className="h-3 w-3 text-oro" /> : <Columns3 className="h-3 w-3" />}
        {comparando ? 'Comparando' : 'Comparar'}
      </button>

      <div className={`flex flex-1 flex-col ${c.cuerpo}`}>
        <p className={`versalitas truncate text-bronce ${c.zona}`}>
          {property.sector} · {property.propertyType}
        </p>
        <h3 className={`font-normal uppercase text-negro font-stretch-semi-expanded ${c.nombre}`}>
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
        <p className={`mt-2 text-[12.5px] text-taupe ${c.ficha}`}>{specsLine(property)}</p>

        {/* Empuja el precio al pie para que las tarjetas de una fila queden alineadas */}
        <div aria-hidden="true" className={`flex-1 ${c.hueco}`} />
        <div className={`flex items-end justify-between gap-3 border-t border-negro/[0.06] ${c.pie}`}>
          <div className="min-w-0">
            <p className={`truncate font-medium tabular-nums text-negro ${c.precio}`}>{precio.principal}</p>
            {precio.detalle && <p className={`mt-0.5 truncate text-[11px] text-taupe ${c.detalle}`}>{precio.detalle}</p>}
          </div>
          <span className={`shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-negro ${c.ver}`}>
            Ver
            <ArrowRight className="h-4 w-4 text-piedra transition-all duration-500 ease-ios group-hover:translate-x-1 group-hover:text-negro" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};
