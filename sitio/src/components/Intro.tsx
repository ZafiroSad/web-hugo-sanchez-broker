import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MARCA } from '../config/marca';
import { CURVA } from '../utils/motion';

/**
 * La puerta, sobre blanco, en tres tiempos:
 *   1. «HUGO SÁNCHEZ» sube letra a letra al centro, macizo, con «Broker
 *      inmobiliario» debajo.
 *   2. El nombre se desplaza a su sitio y se vacía: queda en contorno.
 *   3. Debajo, el slogan se escribe como con bolígrafo, palabra por palabra,
 *      y aparece el botón «Encontrar mi propiedad», que lleva al inicio.
 * Un toque o Intro / Espacio antes de tiempo salta al final; ya con el botón,
 * Intro o Espacio también entran.
 */

type Tiempo = 'centro' | 'arriba' | 'escribe' | 'lista';

const PALABRAS_NOMBRE = MARCA.nombreMayusculas.split(' ');
const PALABRAS_SLOGAN = `${MARCA.slogan}.`.split(' ');

/** Ritmo de la mano: segundos por letra y pausa entre palabras. */
const POR_LETRA = 0.055;
const ENTRE_PALABRAS = 0.07;

/** Cuándo empieza cada palabra y cuánto tarda (las largas tardan más). */
const TRAZOS = PALABRAS_SLOGAN.reduce<{ inicio: number; dura: number }[]>((lista, palabra) => {
  const previo = lista[lista.length - 1];
  const inicio = previo ? previo.inicio + previo.dura + ENTRE_PALABRAS : 0;
  return [...lista, { inicio, dura: Math.max(0.22, palabra.length * POR_LETRA) }];
}, []);
const FIN_ESCRITURA = TRAZOS[TRAZOS.length - 1].inicio + TRAZOS[TRAZOS.length - 1].dura;

/** Momentos de cada tiempo, en milisegundos desde que la letra está lista. */
const A_ARRIBA = 1600;
const A_ESCRIBE = A_ARRIBA + 900;
const A_LISTA = A_ESCRIBE + FIN_ESCRITURA * 1000 + 250;

function fuentesListas() {
  return !document.fonts || (document.fonts.check('800 16px "Mona Sans"') && document.fonts.check('16px "Sacramento"'));
}

/** Si la pantalla es de tableta en adelante (el corte sm de Tailwind). */
function useAncho() {
  const [ancho, setAncho] = useState(() => window.matchMedia('(min-width: 640px)').matches);
  useEffect(() => {
    const consulta = window.matchMedia('(min-width: 640px)');
    const alCambiar = () => setAncho(consulta.matches);
    consulta.addEventListener('change', alCambiar);
    return () => consulta.removeEventListener('change', alCambiar);
  }, []);
  return ancho;
}

export const Intro: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const reducir = Boolean(useReducedMotion());
  const [tiempo, setTiempo] = useState<Tiempo>(reducir ? 'lista' : 'centro');
  const [saltada, setSaltada] = useState(reducir);
  const [abriendo, setAbriendo] = useState(false);
  const ancho = useAncho();
  const abierta = useRef(false);

  // La puerta espera a sus dos letras (como mucho un segundo) para que nada
  // cambie de forma a medio animarse.
  const [fuente, setFuente] = useState(fuentesListas);
  useEffect(() => {
    if (fuente) return;
    let vigente = true;
    const lista = () => vigente && setFuente(true);
    const plazo = window.setTimeout(lista, 1000);
    Promise.all([document.fonts.load('800 16px "Mona Sans"'), document.fonts.load('16px "Sacramento"')]).then(lista, lista);
    return () => {
      vigente = false;
      window.clearTimeout(plazo);
    };
  }, [fuente]);

  // El guion de los tres tiempos.
  useEffect(() => {
    if (!fuente || saltada) return;
    const relojes = [
      window.setTimeout(() => setTiempo('arriba'), A_ARRIBA),
      window.setTimeout(() => setTiempo('escribe'), A_ESCRIBE),
      // El botón sale cuando la última palabra termina de escribirse (onAnimationEnd);
      // este reloj es el respaldo por si el navegador no avisa.
      window.setTimeout(() => setTiempo('lista'), A_LISTA + 1500),
    ];
    return () => relojes.forEach(window.clearTimeout);
  }, [fuente, saltada]);

  const saltar = useCallback(() => {
    setSaltada(true);
    setTiempo('lista');
  }, []);

  const entrar = useCallback(() => {
    if (abierta.current) return;
    abierta.current = true;
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
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (tiempo === 'lista') entrar();
      else saltar();
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [tiempo, entrar, saltar]);

  const centrado = tiempo === 'centro';
  const conSlogan = !centrado;
  const escribiendo = tiempo === 'escribe' || tiempo === 'lista';
  const transicionNombre = saltada ? { duration: 0.5, ease: CURVA.ios } : { duration: 1.1, ease: CURVA.expo };

  // Las letras suben desde una línea, una tras otra. Las dos copias del nombre
  // (maciza y de contorno) usan el mismo ritmo para ir siempre a la par.
  const nombreAnimado = (copia: string) => {
    let indice = 0;
    return PALABRAS_NOMBRE.map((palabra, p) => (
      <span
        key={`${copia}-${palabra}`}
        aria-hidden="true"
        className="-mt-[0.24em] inline-block overflow-hidden pb-[0.04em] pt-[0.24em] align-bottom"
        style={{ marginRight: p < PALABRAS_NOMBRE.length - 1 ? '0.24em' : 0 }}
      >
        {palabra.split('').map((letra) => {
          const i = indice++;
          return (
            <motion.span
              key={i}
              className="inline-block"
              initial={reducir ? false : { y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.95, ease: CURVA.expo, delay: 0.1 + i * 0.04 }}
            >
              {letra}
            </motion.span>
          );
        })}
      </span>
    ));
  };

  return (
    <motion.section
      aria-label="Bienvenida"
      className="fixed inset-0 z-[70] overflow-hidden bg-white text-negro"
      style={{ pointerEvents: abriendo ? 'none' : 'auto' }}
      initial={false}
      exit={{
        opacity: 0,
        filter: reducir ? 'none' : 'blur(8px)',
        transition: reducir ? { duration: 0.3 } : { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
      }}
      onClick={() => tiempo !== 'lista' && saltar()}
    >
      {/* Fondo: blanco con una luz cálida muy suave y grano fino, nada más. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_78%_8%,rgba(197,160,89,0.10),transparent_70%),radial-gradient(ellipse_60%_50%_at_8%_100%,rgba(120,113,108,0.07),transparent_70%)]"
      />
      <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.035]" />

      {/*
        El contorno del nombre: se engorda la silueta de cada letra y se le resta
        la letra original, así queda solo el borde. Con el trazo de CSS
        (-webkit-text-stroke) la fuente variable muestra líneas por dentro de las letras.
      */}
      <svg aria-hidden="true" className="absolute h-0 w-0">
        {[
          ['contorno-hs', 2],
          ['contorno-hs-fino', 1.2],
        ].map(([id, grosor]) => (
          <filter key={id} id={String(id)} x="-5%" y="-10%" width="110%" height="120%">
            <feMorphology in="SourceAlpha" operator="dilate" radius={grosor} result="gruesa" />
            <feComposite in="gruesa" in2="SourceAlpha" operator="out" result="borde" />
            <feFlood floodColor="#1c1917" />
            <feComposite in2="borde" operator="in" />
          </filter>
        ))}
      </svg>

      {/* Esquinas: aparecen con el botón */}
      <motion.div
        aria-hidden="true"
        className="versalitas absolute inset-x-5 top-[max(1.5rem,env(safe-area-inset-top))] flex justify-between text-[9.5px] text-stone-400 sm:inset-x-10 sm:top-8"
        initial={false}
        animate={{ opacity: tiempo === 'lista' ? 1 : 0 }}
        transition={{ duration: 1, ease: CURVA.ios }}
      >
        <span>
          {MARCA.ciudad}
          <span className="hidden sm:inline"> · {MARCA.pais}</span>
        </span>
        <span>@{MARCA.instagram.usuario}</span>
      </motion.div>

      {fuente && (
        <motion.div
          className="relative flex h-full items-center justify-center px-5 sm:px-10"
          initial={false}
          animate={abriendo && !reducir ? { y: -24, opacity: 0.6 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: CURVA.ios }}
        >
          <motion.div
            className="flex w-fit flex-col items-stretch"
            initial={false}
            // En pantalla ancha el slogan sobresale a la derecha del nombre; el conjunto
            // se corre a la izquierda para quedar centrado.
            animate={{ x: conSlogan && ancho ? '-13%' : '0%' }}
            transition={transicionNombre}
          >
            {/* El nombre: el tamaño de la letra lo da este bloque; lo demás se mide en em. */}
            <motion.div
              layout="position"
              transition={transicionNombre}
              className="text-[clamp(2.15rem,10.6vw,9.5rem)] sm:text-[clamp(3rem,7.4vw,8.4rem)]"
            >
              {/* Dos copias del nombre, una sobre otra: la maciza se apaga y deja ver la de contorno. */}
              <h1
                aria-label={MARCA.nombre}
                className="relative whitespace-nowrap text-[1em] font-[780] uppercase leading-[0.92] tracking-[-0.005em] [font-stretch:108%]"
              >
                <motion.span
                  className="block"
                  initial={false}
                  animate={{ opacity: centrado ? 1 : 0 }}
                  transition={{ ...transicionNombre, delay: saltada ? 0 : 0.15 }}
                >
                  {nombreAnimado('m')}
                </motion.span>
                <motion.span
                  className="absolute inset-0 block [filter:url(#contorno-hs-fino)] sm:[filter:url(#contorno-hs)]"
                  initial={false}
                  animate={{ opacity: centrado ? 0 : 1 }}
                  transition={{ ...transicionNombre, delay: saltada ? 0 : 0.15 }}
                >
                  {nombreAnimado('c')}
                </motion.span>
              </h1>
              <motion.p
                className="mt-[0.12em] pl-[0.03em] text-[max(9px,0.17em)] font-bold uppercase leading-none tracking-[0.02em] [font-stretch:100%]"
                initial={reducir ? false : { opacity: 0, y: '0.4em' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: CURVA.ios, delay: 0.75 }}
              >
                {MARCA.titulo}
              </motion.p>
            </motion.div>

            {/* El slogan, escrito a bolígrafo, y el botón. Entran en el segundo tiempo. */}
            {conSlogan && (
              // contain: el ancho lo manda el nombre; el slogan se acomoda a él y no al revés.
              <div className="mt-[clamp(1.6rem,5vh,3rem)] flex flex-col items-center [contain:inline-size] sm:ml-[22%] sm:mr-[-30%] sm:items-end">
                <p
                  aria-label={MARCA.slogan}
                  className="max-w-[17em] text-center font-script text-[clamp(1.7rem,7.6vw,2.4rem)] leading-[1.25] text-negro sm:max-w-none sm:text-balance sm:text-right sm:text-[clamp(1.9rem,3.1vw,3.6rem)]"
                >
                  {PALABRAS_SLOGAN.map((palabra, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className={`trazo ${escribiendo && !saltada ? 'trazo-escribe' : ''} ${saltada ? 'trazo-hecho' : ''}`}
                      style={
                        {
                          '--inicio': `${TRAZOS[i].inicio.toFixed(3)}s`,
                          '--dura': `${TRAZOS[i].dura.toFixed(3)}s`,
                        } as React.CSSProperties
                      }
                      onAnimationEnd={i === PALABRAS_SLOGAN.length - 1 ? () => setTiempo('lista') : undefined}
                    >
                      {palabra}
                    </span>
                  ))}
                </p>

                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    entrar();
                  }}
                  tabIndex={tiempo === 'lista' ? 0 : -1}
                  className="mt-[clamp(2rem,6vh,3.5rem)] whitespace-nowrap rounded-full bg-negro px-9 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_14px_40px_rgba(28,25,23,0.18)] transition-[scale,background-color] duration-500 ease-ios hover:scale-[1.04] hover:bg-black sm:px-11"
                  initial={false}
                  animate={tiempo === 'lista' && !abriendo ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  style={{ pointerEvents: tiempo === 'lista' ? 'auto' : 'none' }}
                  transition={{ duration: 0.9, ease: CURVA.expo }}
                >
                  Encontrar mi propiedad
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
};
