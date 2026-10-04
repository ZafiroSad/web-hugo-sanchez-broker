import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MARCA } from '../config/marca';
import { CURVA } from '../utils/motion';
import { Estela } from './Estela';

/**
 * La puerta, como la de la entrada de Stick Industries: sobre negro corren
 * hilos de luz, «HUGO SÁNCHEZ» se asienta letra a letra con su eco, debajo
 * aparece el slogan y abajo el botón blanco «Encontrar mi propiedad». Se entra
 * con el botón, tocando la pantalla o con Intro / Espacio. Al abrir, el nombre
 * se aleja y se desenfoca mientras la capa se disuelve, y el inicio entra por
 * debajo (sus animaciones esperan a ese momento).
 */

const PALABRAS = MARCA.nombreMayusculas.split(' ');

export const Intro: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const reducir = Boolean(useReducedMotion());
  const [abriendo, setAbriendo] = useState(false);
  const abierta = useRef(false);

  // El nombre espera a su fuente (como mucho un segundo): así las letras no
  // cambian de forma a medio asentarse.
  const [fuente, setFuente] = useState(() => !document.fonts || document.fonts.check('300 16px "Mona Sans"'));
  useEffect(() => {
    if (fuente) return;
    let vigente = true;
    const lista = () => vigente && setFuente(true);
    const plazo = window.setTimeout(lista, 1000);
    document.fonts.load('300 16px "Mona Sans"').then(lista, lista);
    return () => {
      vigente = false;
      window.clearTimeout(plazo);
    };
  }, [fuente]);

  const entrar = useCallback(() => {
    if (abierta.current) return;
    abierta.current = true;
    // Abierta, la capa deja de recibir el puntero mientras se disuelve.
    setAbriendo(true);
    onEnter();
  }, [onEnter]);

  // Sin scroll de la página mientras la puerta está cerrada.
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
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        entrar();
      }
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [entrar]);

  let indice = 0;

  return (
    <motion.section
      aria-label="Bienvenida"
      className="fixed inset-0 z-[70] cursor-pointer overflow-hidden bg-tinta text-white"
      style={{ pointerEvents: abriendo ? 'none' : 'auto' }}
      initial={false}
      // La única salida con `exit` es la de la capa: si sus hijos también la
      // tienen, la capa se retira cuando acaba la más corta y la disolución se corta.
      exit={{
        opacity: 0,
        transition: reducir ? { duration: 0.3 } : { duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.12 },
      }}
      onClick={entrar}
    >
      <Estela intensidad={1.05} className="absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.05]" />

      {fuente && (
        <motion.div
          className="relative flex h-full flex-col items-center justify-center px-5 pb-24 text-center"
          initial={false}
          animate={abriendo && !reducir ? { scale: 1.09, filter: 'blur(7px)' } : { scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.9, ease: CURVA.expo }}
        >
          <motion.p
            className="versalitas text-[9.5px] text-white/60 sm:text-[10.5px]"
            initial={reducir ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: CURVA.ios, delay: 0.55 }}
          >
            {MARCA.titulo} · {MARCA.ciudad}
          </motion.p>

          <h1
            aria-label={MARCA.nombre}
            className="nombre-marca mt-5 text-[clamp(2.7rem,15vw,5rem)] leading-[1.04] sm:mt-6 sm:whitespace-nowrap sm:text-[clamp(3rem,8.4vw,8.6rem)] sm:leading-none"
          >
            {PALABRAS.map((palabra) => (
              <span key={palabra} aria-hidden="true" className="block sm:mr-[0.26em] sm:inline-block sm:last:mr-0">
                {palabra.split('').map((letra) => {
                  const i = indice++;
                  return (
                    <span
                      key={i}
                      className="letra"
                      style={{ '--retraso': `${(0.12 + i * 0.045).toFixed(3)}s` } as React.CSSProperties}
                    >
                      {letra}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.div
            aria-hidden="true"
            className="mt-6 h-px w-[min(420px,62vw)] bg-gradient-to-r from-oro/0 via-oro to-oro/0 sm:mt-8"
            initial={reducir ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: CURVA.ios, delay: 0.7 }}
          />

          <p className="mt-5 max-w-[24ch] text-balance text-[16px] font-light leading-[1.45] text-white/85 sm:mt-6 sm:max-w-none sm:text-[clamp(1.05rem,1.6vw,1.3rem)]">
            {MARCA.slogan.split(' ').map((palabra, i) => (
              <motion.span
                key={i}
                className="mr-[0.26em] inline-block last:mr-0"
                initial={reducir ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, ease: CURVA.ios, delay: 0.75 + i * 0.04 }}
              >
                {palabra}
              </motion.span>
            ))}
          </p>
        </motion.div>
      )}

      {/* El botón: blanco con letra negra, abajo al centro */}
      {fuente && (
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            entrar();
          }}
          className="absolute bottom-[max(9vh,3rem,calc(env(safe-area-inset-bottom)+2rem))] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-9 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-negro shadow-[0_14px_50px_rgba(0,0,0,0.5)] transition-[scale] duration-500 ease-ios hover:scale-[1.04] sm:px-11"
          initial={reducir ? false : { opacity: 0, y: 14 }}
          animate={abriendo ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
          transition={abriendo ? { duration: 0.5, ease: CURVA.ios } : { duration: 0.9, ease: CURVA.expo, delay: 1.05 }}
        >
          Encontrar mi propiedad
        </motion.button>
      )}
    </motion.section>
  );
};
