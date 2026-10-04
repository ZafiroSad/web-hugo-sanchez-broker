import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ENTRADA, MARCA } from '../config/marca';
import { useProperties } from '../context/PropertyContext';
import { CATEGORIAS, enCategoria, ordenarDestacadas } from '../data/categorias';
import { titleCase, whatsappUrl } from '../utils/formatters';
import { CURVA } from '../utils/motion';
import { Foto } from './Foto';
import { FirmaHS, InstagramIcon, WhatsAppIcon } from './marca';

/**
 * El primer vistazo, sobre blanco:
 *   1. «HUGO SÁNCHEZ» sube letra a letra desde una línea, en la Mona Sans ancha,
 *      y una línea dorada lo subraya de lado a lado.
 *   2. Debajo, el slogan y la pregunta «¿Qué estás buscando?».
 *   3. Cada respuesta lleva a un lugar distinto del inicio (casas, apartamentos,
 *      inversión o vender), así la visita no empieza siempre igual. En el
 *      computador, la foto de la derecha cambia al pasar por cada opción y las
 *      letras del nombre engruesan cerca del cursor.
 * Un toque o una tecla durante la animación la completa de una vez. Al elegir,
 * la hoja blanca sube y deja ver el inicio ya colocado en su sitio.
 */

interface Opcion {
  id: string;
  titulo: string;
  detalle: string;
  destino: string;
  foto?: string;
  pie?: string;
}

/** Las respuestas, con sus cifras y fotos tomadas del inventario actual. */
function useOpciones(): Opcion[] {
  const { publicProperties } = useProperties();
  return useMemo(() => {
    const disponibles = publicProperties.filter((p) => p.status !== 'Vendido' && p.status !== 'Arrendado');
    const opciones: Opcion[] = [];
    for (const entrada of ENTRADA) {
      if (!entrada.categoria) {
        opciones.push({
          id: entrada.id,
          titulo: entrada.titulo,
          detalle: entrada.detalle ?? '',
          destino: entrada.destino ?? 'inicio',
          foto: entrada.foto,
          pie: entrada.pie,
        });
        continue;
      }
      const categoria = entrada.categoria;
      const lista = disponibles.filter((p) => enCategoria(p, categoria));
      if (lista.length === 0) continue;
      const elegida = ordenarDestacadas(lista).find((p) => p.images.length > 0);
      const nombre = CATEGORIAS.find((c) => c.id === categoria)?.nombre ?? entrada.titulo;
      opciones.push({
        id: entrada.id,
        titulo: entrada.titulo || nombre,
        detalle: `${lista.length} ${lista.length === 1 ? 'disponible' : 'disponibles'}`,
        destino: `inicio/propiedades/${categoria}`,
        foto: elegida?.images[0],
        pie: elegida
          ? elegida.name.toLowerCase().includes(elegida.sector.toLowerCase())
            ? titleCase(elegida.name)
            : `${titleCase(elegida.name)} · ${elegida.sector}`
          : undefined,
      });
    }
    return opciones;
  }, [publicProperties]);
}

/* Tiempos de la entrada, en segundos */
const T = {
  letras: 0.2,
  paso: 0.034,
  etiqueta: 0.5,
  linea: 0.75,
  slogan: 0.95,
  filas: 1.2,
  imagen: 1.15,
  listo: 1.75,
};

const PALABRAS = MARCA.nombreMayusculas.split(' ');

export const Intro: React.FC<{ onEnter: (destino: string) => void }> = ({ onEnter }) => {
  const reducir = Boolean(useReducedMotion());
  const opciones = useOpciones();
  const [saltada, setSaltada] = useState(false);
  const [listo, setListo] = useState(reducir);
  const [activa, setActiva] = useState(0);
  const [sobreLista, setSobreLista] = useState(false);
  const [elegida, setElegida] = useState<string | null>(null);
  const letras = useRef<(HTMLSpanElement | null)[]>([]);
  const animar = !reducir && !saltada;
  const t = (s: number) => (animar ? s : 0);

  // La animación espera a la fuente (como mucho un segundo): así las letras no
  // cambian de forma a medio subir.
  const [fuente, setFuente] = useState(() => !document.fonts || document.fonts.check('300 16px "Mona Sans"'));
  useEffect(() => {
    if (fuente) return;
    let vigente = true;
    const listaYa = () => vigente && setFuente(true);
    const plazo = window.setTimeout(listaYa, 1000);
    document.fonts.load('300 16px "Mona Sans"').then(listaYa, listaYa);
    return () => {
      vigente = false;
      window.clearTimeout(plazo);
    };
  }, [fuente]);

  useEffect(() => {
    if (!animar || !fuente) return;
    const id = window.setTimeout(() => setListo(true), T.listo * 1000);
    return () => window.clearTimeout(id);
  }, [animar, fuente]);

  const completar = useCallback(() => {
    setSaltada(true);
    setListo(true);
  }, []);

  const elegir = useCallback(
    (opcion: Pick<Opcion, 'id' | 'destino'>) => {
      if (elegida) return;
      setElegida(opcion.id);
      // Un instante para ver la elección marcada; la salida la anima AnimatePresence (ver App).
      window.setTimeout(() => onEnter(opcion.destino), reducir ? 0 : 200);
    },
    [elegida, onEnter, reducir],
  );

  // Sin scroll de la página mientras la intro está en pantalla.
  useEffect(() => {
    const html = document.documentElement;
    const previo = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = previo;
    };
  }, []);

  // Teclado: cualquier tecla completa la animación; luego 1-4 eligen.
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!listo) {
        completar();
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= opciones.length) elegir(opciones[n - 1]);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [listo, completar, elegir, opciones]);

  // Computador: las letras del nombre engruesan cerca del cursor (la fuente es variable).
  const moverSobreNombre = (e: React.PointerEvent) => {
    if (reducir || e.pointerType !== 'mouse') return;
    for (const letra of letras.current) {
      if (!letra) continue;
      const caja = letra.getBoundingClientRect();
      const distancia = Math.abs(e.clientX - (caja.left + caja.width / 2));
      const cerca = Math.max(0, 1 - distancia / 220);
      letra.style.fontWeight = String(Math.round(300 + 330 * cerca * cerca));
    }
  };
  const salirDelNombre = () => {
    for (const letra of letras.current) if (letra) letra.style.fontWeight = '';
  };

  let indice = 0;

  return (
    <motion.section
      aria-label="Bienvenida"
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overflow-x-hidden bg-white text-negro shadow-[0_40px_100px_rgba(12,10,9,0.35)]"
      initial={false}
      exit={
        reducir
          ? { opacity: 0, transition: { duration: 0.3 } }
          : { y: '-100%', transition: { duration: 1.05, ease: CURVA.ios } }
      }
      onClick={() => !listo && completar()}
    >
      {/* Saltar la animación vuelve a montar el contenido ya en su estado final. */}
      {fuente && (
        <React.Fragment key={animar ? 'animada' : 'quieta'}>
          {/* Barra superior: firma y Instagram */}
          <motion.div
            className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-10 sm:pt-8 baja:sm:pt-5"
            initial={animar ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: CURVA.ios, delay: t(0.3) }}
          >
            <FirmaHS className="text-[30px] text-negro baja:text-[26px]" />
            <a
              href={MARCA.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-taupe transition-colors hover:text-negro"
            >
              <InstagramIcon className="h-4 w-4" />
              <span className="hidden min-[400px]:inline">@{MARCA.instagram.usuario}</span>
            </a>
          </motion.div>

          <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pb-6 pt-7 sm:px-10 sm:pb-10 lg:pt-4 baja:pb-4 baja:pt-4 baja:sm:pb-6 baja:lg:pt-2">
            {/* El nombre */}
            <motion.p
              className="versalitas text-[9.5px] text-taupe sm:text-[10.5px]"
              initial={animar ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: CURVA.ios,
                delay: t(T.etiqueta),
              }}
            >
              {MARCA.titulo} — {MARCA.ciudad}
            </motion.p>

            <h1
              aria-label={MARCA.nombre}
              onPointerMove={moverSobreNombre}
              onPointerLeave={salirDelNombre}
              className="nombre-marca mt-3 text-[clamp(2.6rem,15.6vw,8rem)] leading-[1.02] sm:mt-4 lg:whitespace-nowrap lg:text-[min(9.5vw,10.4rem)] lg:leading-[0.98] baja:text-[clamp(2.4rem,13.4vw,6rem)] baja:lg:text-[min(9vw,16.5svh)]"
            >
              {PALABRAS.map((palabra) => (
                // El margen de arriba deja sitio a la tilde de la Á dentro de la máscara.
                <span
                  key={palabra}
                  aria-hidden="true"
                  className="-mt-[0.22em] block overflow-hidden pt-[0.22em] lg:mr-[0.26em] lg:inline-block lg:last:mr-0"
                >
                  {palabra.split('').map((letra) => {
                    const i = indice++;
                    return (
                      <motion.span
                        key={i}
                        ref={(nodo) => {
                          letras.current[i] = nodo;
                        }}
                        className="inline-block transition-[font-weight] duration-300 ease-out"
                        initial={animar ? { y: '108%' } : false}
                        animate={{ y: '0%' }}
                        transition={{
                          duration: 1.05,
                          ease: CURVA.expo,
                          delay: t(T.letras + i * T.paso),
                        }}
                      >
                        {letra}
                      </motion.span>
                    );
                  })}
                </span>
              ))}
            </h1>

            <motion.div
              aria-hidden="true"
              className="mt-5 h-px origin-left bg-gradient-to-r from-oro via-oro/60 to-oro/0 sm:mt-7 baja:mt-3.5 baja:sm:mt-5"
              initial={animar ? { scaleX: 0 } : false}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.3, ease: CURVA.ios, delay: t(T.linea) }}
            />

            <div className="mt-6 grid gap-7 sm:mt-9 lg:grid-cols-12 lg:gap-8 xl:gap-10 baja:mt-4 baja:gap-5 baja:sm:mt-6">
              {/* Slogan; en el computador, debajo, el contacto directo */}
              <div className="lg:col-span-3 lg:flex lg:flex-col lg:justify-between lg:gap-8">
                <p className="max-w-[26ch] text-[16.5px] font-light leading-[1.45] text-grafito sm:text-[19px] lg:max-w-[20ch] lg:text-[19px] xl:text-[20px] baja:text-[15.5px] baja:lg:text-[18px]">
                  {MARCA.slogan.split(' ').map((palabra, i) => (
                    <motion.span
                      key={i}
                      className="mr-[0.26em] inline-block"
                      initial={animar ? { opacity: 0, y: 10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: CURVA.ios,
                        delay: t(T.slogan + i * 0.03),
                      }}
                    >
                      {palabra}
                    </motion.span>
                  ))}
                </p>
                <motion.a
                  href={whatsappUrl('Hola Hugo, vi tu página web y quiero hablar contigo.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group hidden w-fit lg:block"
                  initial={animar ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: CURVA.ios, delay: t(T.filas + 0.4) }}
                >
                  <span className="versalitas block text-[9.5px] text-taupe">¿Prefieres hablar con Hugo?</span>
                  <span className="mt-2 inline-flex items-center gap-2 text-[14px] text-negro">
                    <WhatsAppIcon className="h-4 w-4" />
                    <span className="border-b border-negro/20 pb-0.5 transition-colors group-hover:border-negro">
                      {MARCA.telefonoVisible}
                    </span>
                  </span>
                </motion.a>
              </div>

              {/* La pregunta */}
              <div className="lg:col-span-6">
                <motion.p
                  className="versalitas text-[9.5px] text-bronce sm:text-[10px]"
                  initial={animar ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: CURVA.ios,
                    delay: t(T.filas - 0.1),
                  }}
                >
                  ¿Qué estás buscando?
                </motion.p>
                <ul
                  className="mt-3 sm:mt-4"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setSobreLista(true)}
                  onPointerLeave={() => setSobreLista(false)}
                >
                  {opciones.map((opcion, i) => {
                    const atenuada = (elegida && elegida !== opcion.id) || (sobreLista && !elegida && activa !== i);
                    return (
                      <motion.li
                        key={opcion.id}
                        className="border-t border-negro/[0.08] last:border-b"
                        initial={animar ? { opacity: 0, y: 16 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.9,
                          ease: CURVA.ios,
                          delay: t(T.filas + i * 0.07),
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!listo) completar();
                            else elegir(opcion);
                          }}
                          onPointerEnter={() => setActiva(i)}
                          onFocus={() => setActiva(i)}
                          className={`group flex w-full items-center gap-4 py-3 text-left transition-opacity duration-500 ease-ios sm:py-3.5 lg:gap-5 lg:py-4 baja:py-2 baja:sm:py-2.5 baja:lg:py-3 ${
                            atenuada ? 'opacity-35' : 'opacity-100'
                          }`}
                        >
                          {/* Teléfono: miniatura; computador: número */}
                          <span className="relative h-[54px] w-11 shrink-0 overflow-hidden rounded-lg bg-stone-100 lg:hidden baja:h-[46px] baja:w-[38px]">
                            {opcion.foto && (
                              <Foto
                                src={opcion.foto}
                                alt=""
                                sizes="88px"
                                prioridad
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            )}
                          </span>
                          <span className="hidden w-6 shrink-0 text-[11px] tabular-nums text-piedra transition-colors group-hover:text-bronce lg:inline">
                            0{i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="titular block text-[21px] font-normal leading-tight text-negro transition-transform duration-500 ease-ios sm:text-[24px] lg:text-[clamp(1.6rem,2.2vw,2.1rem)] lg:group-hover:translate-x-1.5 baja:text-[19px] baja:sm:text-[22px] baja:lg:text-[1.75rem]">
                              {opcion.titulo}
                            </span>
                            <span className="mt-0.5 block text-[12px] text-taupe xl:hidden">{opcion.detalle}</span>
                          </span>
                          <span className="hidden shrink-0 text-[12.5px] text-taupe xl:inline">{opcion.detalle}</span>
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                              elegida === opcion.id
                                ? 'border-negro bg-negro text-white'
                                : 'border-negro/10 text-negro group-hover:border-negro group-hover:bg-negro group-hover:text-white'
                            }`}
                          >
                            <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!listo) completar();
                    else elegir({ id: 'todo', destino: 'inicio' });
                  }}
                  className="group mt-4 inline-flex items-center gap-2 py-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-negro sm:mt-5 baja:mt-2"
                  initial={animar ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: CURVA.ios,
                    delay: t(T.filas + 0.35),
                  }}
                >
                  Ver todo
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>
              </div>

              {/* Computador: la foto de la opción señalada */}
              <motion.figure
                className="relative hidden overflow-hidden rounded-2xl bg-stone-100 lg:col-span-3 lg:block lg:aspect-[4/5] lg:max-h-[calc(100svh-24rem)] lg:min-h-[260px] lg:w-full"
                initial={animar ? { clipPath: 'inset(100% 0% 0% 0%)' } : false}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{
                  duration: 1.3,
                  ease: CURVA.expo,
                  delay: t(T.imagen),
                }}
              >
                {opciones.map((opcion, i) =>
                  opcion.foto ? (
                    <Foto
                      key={opcion.id}
                      src={opcion.foto}
                      alt=""
                      sizes="(min-width: 1024px) 26vw, 1px"
                      prioridad={i === 0}
                      className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-ios ${
                        activa === i ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
                      }`}
                    />
                  ) : null,
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="versalitas text-[9px] text-white/70">{opciones[activa]?.titulo}</p>
                  <p className="mt-1.5 text-[13px] leading-snug">{opciones[activa]?.pie}</p>
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </React.Fragment>
      )}
    </motion.section>
  );
};
