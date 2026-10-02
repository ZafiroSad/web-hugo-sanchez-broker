import React from 'react';

/**
 * Una foto de propiedad. Las propias del sitio viven en public/fotos/<id>/ con
 * dos tamaños: NN.webp (hasta 1200 px de ancho) y NN-800.webp para tarjetas y
 * teléfonos. Las fotos agregadas en el panel con un enlace externo se muestran
 * tal cual.
 */

const LOCAL = /^(\.?\/?fotos\/.+?)\.webp$/;

export function srcSetDe(src: string): string | undefined {
  const m = src.match(LOCAL);
  return m ? `${m[1]}-800.webp 800w, ${src} 1200w` : undefined;
}

export const Foto: React.FC<{
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  /** La primera foto visible al cargar: sin carga diferida. */
  prioridad?: boolean;
  draggable?: boolean;
}> = ({ src, alt, sizes = '100vw', className = '', prioridad = false, draggable }) => (
  <img
    src={src}
    srcSet={srcSetDe(src)}
    sizes={srcSetDe(src) ? sizes : undefined}
    alt={alt}
    loading={prioridad ? 'eager' : 'lazy'}
    decoding="async"
    fetchPriority={prioridad ? 'high' : undefined}
    referrerPolicy="no-referrer"
    draggable={draggable}
    className={className}
  />
);
