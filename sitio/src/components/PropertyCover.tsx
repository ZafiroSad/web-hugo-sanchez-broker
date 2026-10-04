import React from 'react';
import type { Property } from '../types/property';
import { FirmaHS } from './marca';

/**
 * La portada de una propiedad, con el mismo lenguaje de las portadas de sus
 * reels: el nombre en blanco, en mayúsculas espaciadas, y el tipo de inmueble
 * en versalitas. Si la propiedad tiene foto, el texto va sobre la foto; si no,
 * sobre un fondo casi negro con una luz distinta para cada propiedad.
 */

function semilla(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const TAMANOS = {
  mini: { nombre: 'text-[7px] tracking-[0.06em]', etiqueta: 'hidden', pie: 'hidden', firma: 'text-5xl' },
  card: {
    nombre: 'text-[17px] sm:text-[19px] tracking-[0.08em]',
    etiqueta: 'text-[9px]',
    pie: 'text-[7.5px]',
    firma: 'text-[9rem]',
  },
  hero: {
    nombre: 'text-[clamp(1.6rem,3.6vw,3rem)] tracking-[0.08em]',
    etiqueta: 'text-[10px]',
    pie: 'text-[8.5px]',
    firma: 'text-[15rem]',
  },
} as const;

export const PropertyCover: React.FC<{
  property: Pick<Property, 'id' | 'name' | 'propertyType' | 'sector' | 'images'>;
  size?: keyof typeof TAMANOS;
  className?: string;
}> = ({ property, size = 'card', className = '' }) => {
  const imagen = property.images?.[0];
  const h = semilla(property.id || property.name);
  const x = 18 + (h % 64);
  const y = 12 + ((h >> 4) % 46);
  const t = TAMANOS[size];

  // En miniatura, con foto, basta la foto: el texto no se alcanza a leer.
  if (imagen && size === 'mini') {
    return (
      <div className={`relative h-full w-full overflow-hidden bg-stone-100 ${className}`}>
        <img src={imagen} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden bg-negro text-hueso ${className}`}>
      {imagen ? (
        <>
          <img
            src={imagen}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-ios group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/70" />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-transform duration-[1600ms] ease-ios group-hover:scale-[1.06]"
          style={{
            background: `radial-gradient(70% 55% at ${x}% ${y}%, rgba(214,211,209,0.16) 0%, transparent 68%),
              radial-gradient(55% 45% at ${100 - x}% ${100 - y / 2}%, rgba(197,160,89,0.15) 0%, transparent 70%),
              linear-gradient(165deg, #1c1917 0%, #141210 55%, #0c0a09 100%)`,
          }}
        />
      )}
      <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.07]" />
      <FirmaHS
        className={`pointer-events-none absolute -bottom-[0.32em] -right-[0.06em] ${t.firma} text-white/[0.045]`}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-[9%] text-center">
        <span className={`versalitas ${t.etiqueta} text-piedra`}>{property.propertyType}</span>
        <h3
          className={`mt-3 font-light uppercase leading-[1.3] text-white font-stretch-expanded transition-[letter-spacing] duration-[1200ms] ease-ios ${t.nombre}`}
        >
          {property.name}
        </h3>
        <span aria-hidden="true" className={`mt-4 h-px w-10 bg-arena/50 ${size === 'mini' ? 'hidden' : ''}`} />
        <span className={`versalitas mt-4 ${t.etiqueta} text-arena/85`}>{property.sector}</span>
      </div>

      <span
        className={`absolute inset-x-0 bottom-4 text-center font-medium uppercase tracking-[0.32em] text-white/35 ${t.pie}`}
      >
        Hugo Sánchez · Broker inmobiliario
      </span>
    </div>
  );
};
