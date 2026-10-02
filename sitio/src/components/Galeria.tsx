import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { CURVA } from '../utils/motion';
import { Foto } from './Foto';

/**
 * Las fotos de una propiedad. En el teléfono, un carrusel que se desliza con el
 * dedo; en el computador, un mosaico con las tres primeras. Cualquier foto abre
 * el visor a pantalla completa, con flechas, teclado y deslizamiento.
 */
export const Galeria: React.FC<{ fotos: string[]; nombre: string }> = ({ fotos, nombre }) => {
  const [abierta, setAbierta] = useState<number | null>(null);
  const [actual, setActual] = useState(0);
  const pista = useRef<HTMLDivElement>(null);

  const alt = (i: number) => `${nombre}, foto ${i + 1} de ${fotos.length}`;
  const mosaico = fotos.slice(0, 3);
  const columnas = ['', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3'][mosaico.length];

  return (
    <>
      {/* Teléfono y tableta: carrusel a lo ancho */}
      <div className="relative -mx-5 sm:-mx-8 lg:hidden">
        <div
          ref={pista}
          onScroll={() => {
            const el = pista.current;
            if (el) setActual(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="sin-scroll flex snap-x snap-mandatory overflow-x-auto"
        >
          {fotos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setAbierta(i)}
              className="relative aspect-[4/5] w-full shrink-0 snap-center bg-stone-100 sm:aspect-[4/3]"
              aria-label={`Ampliar ${alt(i)}`}
            >
              <Foto
                src={src}
                alt={alt(i)}
                sizes="100vw"
                prioridad={i === 0}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        {fotos.length > 1 && (
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white backdrop-blur-sm">
            {actual + 1} / {fotos.length}
          </span>
        )}
      </div>

      {/* Computador: mosaico */}
      <div className={`hidden h-[clamp(420px,64vh,660px)] gap-2 overflow-hidden rounded-2xl lg:grid ${columnas}`}>
        {mosaico.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setAbierta(i)}
            className={`group relative h-full overflow-hidden bg-stone-100 ${
              mosaico.length === 1 ? 'mx-auto w-[min(100%,540px)] rounded-2xl' : ''
            }`}
            aria-label={`Ampliar ${alt(i)}`}
          >
            <Foto
              src={src}
              alt={alt(i)}
              sizes="(min-width: 1280px) 420px, 34vw"
              prioridad={i === 0}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-ios group-hover:scale-[1.03]"
            />
            {i === mosaico.length - 1 && fotos.length > mosaico.length && (
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-negro shadow-md">
                <Images className="h-3.5 w-3.5" /> Ver las {fotos.length} fotos
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {abierta !== null && (
          <Visor key="visor" fotos={fotos} inicio={abierta} nombre={nombre} onClose={() => setAbierta(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

const Visor: React.FC<{ fotos: string[]; inicio: number; nombre: string; onClose: () => void }> = ({
  fotos,
  inicio,
  nombre,
  onClose,
}) => {
  const [i, setI] = useState(inicio);
  const toque = useRef<number | null>(null);
  const ir = useCallback((paso: number) => setI((v) => (v + paso + fotos.length) % fotos.length), [fotos.length]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') ir(1);
      else if (e.key === 'ArrowLeft') ir(-1);
    };
    window.addEventListener('keydown', tecla);
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', tecla);
      document.body.style.overflow = previo;
    };
  }, [ir, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${nombre}`}
      className="fixed inset-0 z-[80] flex flex-col bg-black/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: CURVA.ios }}
      onTouchStart={(e) => {
        toque.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (toque.current === null) return;
        const dx = e.changedTouches[0].clientX - toque.current;
        if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1);
        toque.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate text-[11px] font-medium uppercase tracking-[0.2em] text-stone-300">{nombre}</p>
        <div className="flex shrink-0 items-center gap-4">
          <span className="text-[12px] tabular-nums text-stone-400">
            {i + 1} / {fotos.length}
          </span>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar fotos"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={fotos[i]}
            src={fotos[i]}
            alt={`${nombre}, foto ${i + 1} de ${fotos.length}`}
            referrerPolicy="no-referrer"
            draggable={false}
            className="max-h-full max-w-full select-none rounded-md object-contain"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: CURVA.ios }}
          />
        </AnimatePresence>
        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(-1)}
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:block"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => ir(1)}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:block"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="sin-scroll flex gap-2 overflow-x-auto px-4 py-4 sm:justify-center">
          {fotos.map((src, j) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(j)}
              className={`relative h-16 w-12 shrink-0 overflow-hidden rounded transition-opacity ${
                j === i ? 'ring-2 ring-white' : 'opacity-45 hover:opacity-90'
              }`}
              aria-label={`Ver foto ${j + 1}`}
              aria-current={j === i}
            >
              <Foto src={src} alt="" sizes="48px" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};
