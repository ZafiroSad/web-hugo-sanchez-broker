import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '../types/property';
import { priceLabel, titleCase } from '../utils/formatters';
import { navigate } from '../utils/router';
import { CURVA } from '../utils/motion';
import { Foto } from './Foto';
import { FirmaHS } from './marca';

/**
 * Las propiedades destacadas como historias de Instagram, que es donde Hugo
 * las muestra: avanzan solas cada pocos segundos con su barra de progreso,
 * se pasan tocando a la derecha o a la izquierda, se pausan al mantener el
 * dedo (o el cursor) encima, y «Ver propiedad» abre la ficha. Fuera de la
 * pantalla, o con movimiento reducido, no avanzan solas.
 */

const DURACION = 6; // segundos por historia

export const Historias: React.FC<{ propiedades: Property[]; className?: string; animar?: boolean }> = ({
  propiedades,
  className = '',
  animar = true,
}) => {
  const reducir = Boolean(useReducedMotion());
  const [actual, setActual] = useState(0);
  const [encima, setEncima] = useState(false);
  const [pulsando, setPulsando] = useState(false);
  const [visible, setVisible] = useState(true);
  const caja = useRef<HTMLDivElement>(null);
  const pulso = useRef<{ t: number; x: number } | null>(null);
  const total = propiedades.length;
  const corriendo = animar && !reducir && visible && !encima && !pulsando && total > 1;

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') return;
    const vigia = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    vigia.observe(nodo);
    return () => vigia.disconnect();
  }, []);

  if (total === 0) return null;
  const i = actual % total;
  const p = propiedades[i];
  const siguiente = () => setActual((v) => (v + 1) % total);
  const anterior = () => setActual((v) => (v - 1 + total) % total);
  const abrir = () => navigate(`propiedad/${p.id}`);

  // Toque corto: a la izquierda vuelve, en el resto avanza. Mantener: pausa.
  const alBajar = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a,button')) return;
    pulso.current = { t: performance.now(), x: e.clientX };
    if (e.pointerType !== 'mouse') setPulsando(true);
  };
  const alSubir = (e: React.PointerEvent) => {
    const inicio = pulso.current;
    pulso.current = null;
    setPulsando(false);
    if (!inicio || performance.now() - inicio.t > 280 || Math.abs(e.clientX - inicio.x) > 12) return;
    const r = caja.current?.getBoundingClientRect();
    if (r && e.clientX - r.left < r.width * 0.32) anterior();
    else siguiente();
  };

  return (
    <div
      ref={caja}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Propiedades destacadas"
      className={`group/historias relative isolate cursor-pointer touch-manipulation select-none overflow-hidden rounded-2xl bg-tinta text-white ${className}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setEncima(true)}
      onPointerLeave={() => {
        setEncima(false);
        setPulsando(false);
        pulso.current = null;
      }}
      onPointerDown={alBajar}
      onPointerUp={alSubir}
      onPointerCancel={() => {
        setPulsando(false);
        pulso.current = null;
      }}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') siguiente();
        if (e.key === 'ArrowLeft') anterior();
      }}
    >
      {propiedades.map((q, k) => (
        <Foto
          key={q.id}
          src={q.images[0]}
          alt={k === i ? `${titleCase(q.name)}, ${q.sector}` : ''}
          sizes="(min-width: 1024px) 50vw, 100vw"
          prioridad={k === 0}
          draggable={false}
          className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ease-ios ${
            k === i ? 'opacity-100' : 'opacity-0'
          }`}
          style={
            k === i && !reducir
              ? {
                  animation: `acercar ${DURACION + 1}s ease-out forwards`,
                  animationPlayState: corriendo ? 'running' : 'paused',
                }
              : undefined
          }
        />
      ))}
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* Barras de progreso, una por historia */}
      <div className="absolute inset-x-3 top-3 flex gap-1 sm:inset-x-4 sm:top-4">
        {propiedades.map((q, k) => (
          <span key={q.id} className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/30">
            {k === i ? (
              <span
                key={`activa-${i}`}
                className="block h-full origin-left rounded-full bg-white"
                style={{
                  animation: `llenar ${DURACION}s linear forwards`,
                  animationPlayState: corriendo ? 'running' : 'paused',
                }}
                onAnimationEnd={siguiente}
              />
            ) : (
              <span className={`block h-full rounded-full bg-white ${k < i ? 'w-full' : 'w-0'}`} />
            )}
          </span>
        ))}
      </div>

      {/* Cabecera, como la de una historia de Instagram */}
      <div className="absolute inset-x-3 top-6 flex items-center gap-2.5 sm:inset-x-4 sm:top-7">
        <FirmaHS className="text-[26px] text-white" />
        <p className="text-[12px] leading-tight">
          <span className="font-semibold">Hugo Sánchez</span>
          <span className="ml-2 text-white/70">Destacadas</span>
        </p>
        <span className="ml-auto text-[11px] tabular-nums text-white/70">
          {i + 1} / {total}
        </span>
      </div>

      {/* La propiedad */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: CURVA.ios }}
          >
            <p className="versalitas text-[9px] text-white/75 sm:text-[9.5px]">
              {p.sector} · {p.propertyType}
            </p>
            <h3 className="mt-2 max-w-[18ch] text-[clamp(1.35rem,5.6vw,2.2rem)] font-light uppercase leading-[1.08] tracking-[0.01em] font-stretch-semi-expanded">
              {p.name}
            </h3>
            <p className="mt-2.5 text-[14px] tabular-nums text-white/90 sm:text-[15px]">{priceLabel(p).principal}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex items-center gap-2">
          <a
            href={`#/propiedad/${p.id}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              abrir();
            }}
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-negro transition-colors hover:bg-stone-100"
          >
            Ver propiedad <ArrowRight className="h-3.5 w-3.5" />
          </a>
          {total > 1 && (
            <span className="ml-auto hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  anterior();
                }}
                aria-label="Propiedad anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  siguiente();
                }}
                aria-label="Propiedad siguiente"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
