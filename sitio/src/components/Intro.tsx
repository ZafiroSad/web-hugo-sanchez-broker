import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { MARCA } from '../config/marca';
import { CURVA } from '../utils/motion';
import { InstagramIcon } from './marca';

/**
 * El primer vistazo. Mismo lenguaje que el reel de Stick Industries:
 *   1. «HUGO SÁNCHEZ» entra letra a letra: sube, se enfoca y aparece.
 *   2. El nombre sube y su slogan se escribe debajo, en cursiva.
 *   3. Aparece el botón blanco «Conoce tu nuevo hogar».
 * Un clic o una tecla durante la animación salta directo al botón.
 */

const NOMBRE = MARCA.nombreMayusculas;

export const Intro: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const reducir = useReducedMotion();
  const [fase, setFase] = useState(reducir ? 2 : 0);
  const saliendo = useRef(false);

  useEffect(() => {
    if (reducir) return;
    const t1 = window.setTimeout(() => setFase((f) => Math.max(f, 1)), 2000);
    const t2 = window.setTimeout(() => setFase((f) => Math.max(f, 2)), 3900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reducir]);

  // La salida la anima AnimatePresence (ver App): la vista principal ya está
  // montada debajo y empieza su propia entrada mientras la intro se desvanece.
  const entrar = useCallback(() => {
    if (saliendo.current) return;
    saliendo.current = true;
    onEnter();
  }, [onEnter]);

  // Sin scroll mientras la intro está en pantalla.
  useEffect(() => {
    const html = document.documentElement;
    const previo = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = previo;
    };
  }, []);

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (fase < 2) setFase(2);
      else if (e.key === 'Enter') entrar();
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [fase, entrar]);

  return (
    <motion.section
      aria-label="Bienvenida"
      className="fixed inset-0 z-[70] overflow-hidden bg-tinta text-hueso"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: CURVA.ios, delay: 0.25 } }}
      onClick={() => fase < 2 && setFase(2)}
    >
      {/* Luz ambiental cálida que se enciende despacio */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(52% 42% at 50% 47%, rgba(214,211,209,0.12) 0%, rgba(197,160,89,0.05) 45%, transparent 76%)',
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3.4, ease: CURVA.expo }}
      />
      <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.07]" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-hueso/[0.07] sm:inset-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 2.2, ease: CURVA.ios }}
      />

      <motion.div
        className="relative flex h-full w-full flex-col items-center justify-center px-5 text-center"
        initial={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
        animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
        exit={{ scale: 1.035, filter: 'blur(10px)', opacity: 0, transition: { duration: 0.9, ease: CURVA.ios } }}
      >
        {/* El nombre, que sube cuando entra el slogan */}
        <motion.div
          className="flex flex-col items-center"
          initial={false}
          animate={{ y: fase >= 1 ? -34 : 0 }}
          transition={{ duration: 1.7, ease: CURVA.ios }}
        >
          <motion.span
            className="versalitas mb-7 text-[10px] text-piedra sm:text-[11px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducir ? 0 : 1.55, duration: 1.2, ease: CURVA.ios }}
          >
            Broker inmobiliario · Bucaramanga
          </motion.span>

          <h1
            aria-label={MARCA.nombre}
            className="whitespace-nowrap pl-[0.17em] text-[clamp(2.05rem,8.4vw,7.6rem)] font-extralight leading-none tracking-[0.17em]"
          >
            {NOMBRE.split('').map((letra, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="inline-block"
                initial={reducir ? false : { opacity: 0, y: 34, filter: 'blur(14px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3 + i * 0.075, duration: 1.35, ease: CURVA.ios }}
              >
                {letra === ' ' ? ' ' : letra}
              </motion.span>
            ))}
          </h1>

          <motion.div
            aria-hidden="true"
            className="mt-7 h-px bg-gradient-to-r from-transparent via-oro/70 to-transparent"
            initial={reducir ? false : { width: 0, opacity: 0 }}
            animate={{ width: 'min(440px, 64vw)', opacity: 1 }}
            transition={{ delay: 1.35, duration: 1.5, ease: CURVA.ios }}
          />
        </motion.div>

        {/* El slogan se escribe de izquierda a derecha */}
        <motion.p
          className="mt-3 max-w-[16ch] text-balance px-4 py-3 font-script text-[clamp(1.85rem,4.7vw,3.5rem)] leading-[1.22] text-oro sm:max-w-none"
          initial={reducir ? false : { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)', filter: 'blur(5px)' }}
          animate={
            fase >= 1
              ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)' }
              : { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)', filter: 'blur(5px)' }
          }
          transition={{ duration: 2.1, ease: CURVA.escritura }}
        >
          {MARCA.slogan}
        </motion.p>

        {/* Botón blanco con texto negro */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            entrar();
          }}
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-negro shadow-[0_0_60px_rgba(255,255,255,0.10)] transition-[background-color,box-shadow,transform] duration-500 ease-ios hover:bg-hueso hover:shadow-[0_0_80px_rgba(255,255,255,0.18)] active:scale-[0.98] sm:px-11"
          initial={{ opacity: 0, y: 14 }}
          animate={fase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 1, ease: CURVA.ios, delay: fase >= 2 ? 0.15 : 0 }}
          tabIndex={fase >= 2 ? 0 : -1}
        >
          Conoce tu nuevo hogar
          <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:translate-x-1" />
        </motion.button>
      </motion.div>

      {/* Instagram, también aquí */}
      <motion.a
        href={MARCA.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-piedra transition-colors hover:text-hueso sm:bottom-9"
        initial={{ opacity: 0 }}
        animate={{ opacity: fase >= 2 ? 1 : 0 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        transition={{ duration: 1.2, ease: CURVA.ios, delay: 0.5 }}
      >
        <InstagramIcon className="h-3.5 w-3.5" />@{MARCA.instagram.usuario}
      </motion.a>
    </motion.section>
  );
};
