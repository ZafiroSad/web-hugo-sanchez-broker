import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Handshake, House, KeyRound } from 'lucide-react';
import { BIO, CONFIANZA, MARCA, PILARES, PROCESO, RETRATO } from '../config/marca';
import { CATEGORIAS, enCategoria, esCategoria, ordenarDestacadas, type CategoriaId } from '../data/categorias';
import { CIERRES, INVERSION, reelUrl } from '../data/contenido';
import { useProperties } from '../context/PropertyContext';
import { whatsappUrl } from '../utils/formatters';
import { navigate } from '../utils/router';
import { CURVA, revelar } from '../utils/motion';
import { FirmaHS, InstagramIcon, WhatsAppIcon } from './marca';
import { Foto } from './Foto';
import { PropertyCard } from './PropertyCard';

/* ------------------------------------------------------------------ */
/* Piezas comunes                                                      */
/* ------------------------------------------------------------------ */

const Encabezado: React.FC<{
  antetitulo: string;
  titulo: React.ReactNode;
  tono?: 'claro' | 'oscuro';
  medio?: boolean;
  children?: React.ReactNode;
}> = ({ antetitulo, titulo, tono = 'claro', medio = false, children }) => (
  <motion.div {...revelar()} className="max-w-3xl">
    <p className={`versalitas text-[10px] ${tono === 'oscuro' ? 'text-oro' : 'text-bronce'}`}>{antetitulo}</p>
    <h2
      className={`titular mt-4 font-light leading-[1.08] ${
        medio ? 'text-[clamp(1.5rem,5.8vw,2.55rem)]' : 'text-[clamp(1.65rem,6.6vw,3.1rem)]'
      } ${tono === 'oscuro' ? 'text-white' : 'text-negro'}`}
    >
      {titulo}
    </h2>
    {children}
  </motion.div>
);

const ICONOS = { casa: House, llave: KeyRound, trato: Handshake } as const;

/**
 * En el teléfono, una fila que se desliza con el dedo y asoma la siguiente
 * pieza, con puntos que dicen dónde va; desde tableta, una rejilla normal.
 * Así una sección de seis tarjetas ocupa una pantalla y no seis.
 */
const Deslizable: React.FC<{ items: React.ReactNode[]; ancho?: string; rejilla: string; separacion?: string }> = ({
  items,
  ancho = 'w-[82%]',
  rejilla,
  separacion = 'sm:gap-6',
}) => {
  const pista = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const alDesplazar = () => {
    const el = pista.current;
    const primero = el?.firstElementChild as HTMLElement | null;
    if (!el || !primero) return;
    setActivo(Math.min(items.length - 1, Math.round(el.scrollLeft / (primero.offsetWidth + 12))));
  };
  return (
    <>
      <div
        ref={pista}
        onScroll={alDesplazar}
        className={`sin-scroll -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 ${separacion} ${rejilla}`}
      >
        {items.map((item, i) => (
          <div key={i} className={`${ancho} shrink-0 snap-start *:h-full sm:w-auto`}>
            {item}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div aria-hidden="true" className="mt-4 flex justify-center gap-1.5 sm:hidden">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activo ? 'w-5 bg-negro' : 'w-1.5 bg-negro/20'}`}
            />
          ))}
        </div>
      )}
    </>
  );
};

const botonOscuro =
  'group inline-flex items-center gap-3 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-grafito';

/* ------------------------------------------------------------------ */
/* Propiedades: justo debajo de la portada                             */
/* ------------------------------------------------------------------ */

/**
 * Con pestañas por tipo de propiedad. Va debajo del menú de inicio;
 * #/inicio/propiedades/<categoría> baja hasta aquí con esa pestaña abierta.
 */
export const Destacadas: React.FC<{ filtro?: string }> = ({ filtro }) => {
  const { publicProperties } = useProperties();
  const [pestana, setPestana] = useState<CategoriaId | 'todas'>(esCategoria(filtro) ? filtro : 'todas');
  useEffect(() => {
    if (esCategoria(filtro)) setPestana(filtro);
  }, [filtro]);

  const pestanas = [
    { id: 'todas' as const, nombre: 'Todas', total: publicProperties.length },
    ...CATEGORIAS.map((c) => ({ id: c.id, nombre: c.nombre, total: publicProperties.filter((p) => enCategoria(p, c.id)).length })),
  ].filter((t) => t.total > 0);
  const lista = pestana === 'todas' ? publicProperties : publicProperties.filter((p) => enCategoria(p, pestana));
  const destacadas = ordenarDestacadas(lista).slice(0, 6);
  const verTodas = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('propiedades');
  };

  return (
    <section id="propiedades" className="scroll-mt-16 bg-hueso pb-14 pt-7 sm:pb-28 sm:pt-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p className="versalitas text-[10px] text-bronce">Book de propiedades</p>
            <h2 className="titular mt-3 text-[clamp(1.6rem,6.6vw,2.6rem)] font-light leading-[1.05] text-negro">
              Propiedades destacadas
            </h2>
          </div>
          <a
            href="#/propiedades"
            onClick={verTodas}
            className="group hidden items-center gap-2 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-negro sm:inline-flex"
          >
            Ver las {publicProperties.length}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:translate-x-1" />
          </a>
        </div>

        {/* Pestañas por tipo */}
        <div
          role="tablist"
          aria-label="Tipo de propiedad"
          className="sin-scroll -mx-5 mt-5 flex gap-2 overflow-x-auto border-b border-negro/[0.08] px-5 pb-4 sm:mx-0 sm:mt-7 sm:px-0 sm:pb-6"
        >
          {pestanas.map((t) => {
            const activa = pestana === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => setPestana(t.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[12px] transition-colors duration-300 ${
                  activa ? 'border-negro bg-negro text-white' : 'border-negro/[0.1] bg-white text-grafito hover:border-negro/40'
                }`}
              >
                {t.nombre}
                <span className={`text-[10.5px] tabular-nums ${activa ? 'text-white/55' : 'text-piedra'}`}>{t.total}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 sm:mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pestana}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: CURVA.ios }}
            >
              <Deslizable
                rejilla="sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                items={destacadas.map((p, i) => <PropertyCard key={p.id} property={p} index={i} prioridad={i < 2} />)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center sm:mt-12">
          <a href="#/propiedades" onClick={verTodas} className={botonOscuro}>
            Ver todas las propiedades
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Sobre Hugo                                                          */
/* ------------------------------------------------------------------ */

export const SobreHugo: React.FC = () => {
  const { publicProperties } = useProperties();
  const [bioCompleta, setBioCompleta] = useState(false);
  const cifras = [
    ...CONFIANZA,
    {
      valor: String(publicProperties.filter((p) => p.status === 'Disponible').length),
      etiqueta: 'Propiedades disponibles',
      detalle: 'Cada una con sus fotos, su ficha y su precio.',
    },
  ];

  return (
    <section id="sobre" className="scroll-mt-20 border-y border-negro/[0.06] bg-white py-16 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-5 sm:gap-16 sm:px-8 lg:grid-cols-12 lg:gap-14">
        <motion.figure {...revelar()} className="relative mx-auto w-full max-w-[300px] sm:max-w-[420px] lg:col-span-5 lg:mx-0">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
            <Foto
              src={RETRATO}
              alt="Hugo Sánchez, broker inmobiliario"
              sizes="(min-width: 1024px) 420px, 90vw"
              className="h-full w-full object-cover object-[50%_20%]"
            />
          </div>
          <figcaption className="absolute -bottom-6 left-5 right-5 rounded-xl bg-white px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.09)] ring-1 ring-negro/[0.06]">
            <p className="text-[12.5px] font-medium uppercase tracking-[0.2em] text-negro">{MARCA.nombre}</p>
            <p className="mt-1 text-[11.5px] text-taupe">
              {MARCA.titulo} · {MARCA.ciudad}
            </p>
          </figcaption>
        </motion.figure>

        <div className="lg:col-span-7">
          <Encabezado medio antetitulo="Sobre Hugo" titulo="Te acompaño en la búsqueda de tu propiedad ideal o inversión" />

          <motion.div
            {...revelar(0.08)}
            className="mt-6 max-w-2xl space-y-4 text-[15px] font-light leading-[1.75] text-grafito sm:mt-8 sm:space-y-5 sm:text-[15.5px] sm:leading-[1.8]"
          >
            <p className="text-negro">{BIO.trayectoria}</p>
            {/* En el teléfono, los dos últimos párrafos esperan a «Leer más» */}
            {BIO.larga.map((parrafo, i) => (
              <p key={parrafo.slice(0, 20)} className={i > 0 && !bioCompleta ? 'hidden sm:block' : ''}>
                {parrafo}
              </p>
            ))}
          </motion.div>
          {!bioCompleta && (
            <button
              type="button"
              onClick={() => setBioCompleta(true)}
              className="mt-4 inline-flex items-center gap-1.5 border-b border-negro/25 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-negro sm:hidden"
            >
              Leer más
            </button>
          )}

          <motion.blockquote {...revelar(0.14)} className="mt-8 border-l-2 border-oro/60 pl-5 sm:mt-10 sm:pl-6">
            <p className="titular text-[clamp(1.4rem,2.6vw,2.05rem)] font-light leading-[1.15] text-negro">«{BIO.cita}»</p>
            <footer className="versalitas mt-2 text-[10px] text-taupe">{MARCA.nombre}</footer>
          </motion.blockquote>

          <motion.ul {...revelar(0.2)} className="mt-8 grid gap-3 text-[13px] text-grafito sm:mt-10 sm:grid-cols-2">
            {[
              'Cuenta verificada en Instagram',
              'Nominado por Horror Brokers Colombia (2025)',
              'Aliado comercial de Sumas Construcciones',
              'Presente en ExpoVivienda Santander 2026',
            ].map((dato) => (
              <li key={dato} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-oro" strokeWidth={2} />
                {dato}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Lo que da confianza */}
      <div className="mx-auto mt-14 max-w-7xl px-5 sm:mt-20 sm:px-8">
        <dl className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {cifras.map((item, i) => (
            <motion.div
              key={item.etiqueta}
              {...revelar(i * 0.06)}
              className="rounded-2xl border border-negro/[0.06] bg-hueso p-4 sm:p-6"
            >
              <dt className="sr-only">{item.etiqueta}</dt>
              <dd className="titular text-[clamp(1.5rem,2.6vw,2.3rem)] font-light leading-none tabular-nums text-negro">{item.valor}</dd>
              <dd className="mt-2.5 text-[9px] font-semibold uppercase leading-snug tracking-[0.16em] text-bronce sm:mt-3 sm:text-[9.5px] sm:tracking-[0.24em]">
                {item.etiqueta}
              </dd>
              <dd className="mt-2 hidden text-[12px] leading-snug text-taupe sm:block">{item.detalle}</dd>
            </motion.div>
          ))}
        </dl>

        <div className="mt-2.5 sm:mt-3">
          <Deslizable
            ancho="w-[76%]"
            separacion="sm:gap-3"
            rejilla="sm:grid-cols-2 lg:grid-cols-4"
            items={PILARES.map((pilar, i) => (
              <motion.div
                key={pilar.titulo}
                {...revelar(i * 0.06)}
                className="rounded-2xl border border-negro/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-6"
              >
                <span className="text-[12px] font-light tabular-nums text-oro">0{i + 1}</span>
                <h3 className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-negro sm:mt-4 sm:text-[12.5px] sm:tracking-[0.18em]">
                  {pilar.titulo}
                </h3>
                <p className="mt-2.5 text-[13.5px] font-light leading-relaxed text-grafito sm:mt-3">{pilar.texto}</p>
              </motion.div>
            ))}
          />
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Cómo trabajo: casa, llave y apretón de manos                         */
/* ------------------------------------------------------------------ */

export const ComoTrabajo: React.FC = () => (
  <section className="bg-hueso py-16 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Así trabajo" titulo="Tres pasos, una sola persona contigo" />
      <div className="mt-8 grid gap-2.5 sm:mt-12 sm:gap-4 md:grid-cols-3">
        {PROCESO.map((paso, i) => {
          const Icono = ICONOS[paso.icono];
          return (
            <motion.div
              key={paso.titulo}
              {...revelar(i * 0.1)}
              className="flex gap-4 rounded-2xl border border-negro/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:block sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 sm:h-12 sm:w-12">
                  <Icono className="h-5 w-5 text-bronce" strokeWidth={1.5} />
                </span>
                <span className="hidden text-[12px] font-light tabular-nums text-piedra sm:inline">Paso {i + 1}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10.5px] font-light tabular-nums text-piedra sm:hidden">Paso {i + 1}</p>
                <h3 className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-negro sm:mt-6 sm:text-[13px] sm:tracking-[0.18em]">
                  {paso.titulo}
                </h3>
                <p className="mt-2 text-[13.5px] font-light leading-relaxed text-grafito sm:mt-3 sm:text-[14px]">{paso.texto}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Inversión: proyectos sobre planos y Panamá                          */
/* ------------------------------------------------------------------ */

export const Inversion: React.FC = () => (
  <section id="inversion" className="scroll-mt-20 border-t border-negro/[0.06] bg-white py-16 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Inversión" titulo="Proyectos sobre planos e inversión en dólares">
        <p className="mt-4 max-w-xl text-[14.5px] font-light leading-relaxed text-grafito sm:mt-5 sm:text-[15px]">
          Además de su portafolio de reventa, Hugo comercializa proyectos nuevos en Bucaramanga y en ciudad de Panamá.
        </p>
      </Encabezado>

      <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-2">
        {INVERSION.map((linea, i) => (
          <motion.article
            key={linea.codigo}
            {...revelar(i * 0.1)}
            className="grid overflow-hidden rounded-2xl border border-negro/[0.08] bg-hueso sm:grid-cols-[minmax(0,0.85fr)_1fr]"
          >
            {linea.foto && (
              <div className="relative aspect-[16/9] bg-stone-100 sm:aspect-auto">
                <Foto
                  src={linea.foto}
                  alt={linea.titulo}
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-5 sm:p-8">
              <p className="versalitas text-[10px] text-bronce">{linea.etiqueta}</p>
              <h3 className="titular mt-2.5 text-[21px] font-normal leading-tight text-negro sm:mt-3 sm:text-[25px]">{linea.titulo}</h3>
              <p className="mt-4 text-[14px] font-light leading-relaxed text-grafito">{linea.texto}</p>
              <ul className="mt-5 space-y-3">
                {linea.puntos.map((punto) => (
                  <li key={punto} className="flex gap-3 text-[13px] leading-relaxed text-grafito">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-oro" />
                    {punto}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappUrl(linea.mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 border-b border-negro/25 pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-negro transition-colors hover:border-negro"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" /> Pedir información
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Manifiesto                                                          */
/* ------------------------------------------------------------------ */

export const Manifiesto: React.FC = () => (
  <section className="relative isolate overflow-hidden bg-tinta py-20 text-white sm:py-36">
    <Foto
      src="./fotos/orizon-sky-home/08.webp"
      alt=""
      sizes="100vw"
      className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-tinta/80 via-tinta/55 to-tinta/85" />
    <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
      <motion.p {...revelar()} className="versalitas text-[10px] text-oro">
        Manifiesto
      </motion.p>
      <motion.p
        {...revelar(0.1)}
        className="titular mx-auto mt-6 max-w-[22ch] text-balance font-extralight leading-[1.08] text-[clamp(1.85rem,6.6vw,4.2rem)] sm:mt-8"
      >
        El verdadero lujo en el sector inmobiliario es el acceso,
      </motion.p>
      <motion.p
        {...revelar(0.25)}
        className="titular mt-2 font-extralight leading-[1.08] text-[clamp(1.85rem,6.6vw,4.2rem)] text-oro sm:mt-3"
      >
        y no todos lo tienen.
      </motion.p>
      <motion.div {...revelar(0.35)} className="mt-8 flex justify-center sm:mt-10">
        <FirmaHS className="text-5xl text-white/70" />
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Vendidas: cada cierre, contado por Hugo                             */
/* ------------------------------------------------------------------ */

export const Cierres: React.FC = () => (
  <section id="vendidas" className="scroll-mt-20 bg-hueso py-16 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Vendidas" titulo="Cada cierre, contado por Hugo">
        <p className="mt-4 max-w-xl text-[14.5px] font-light leading-relaxed text-grafito sm:mt-5 sm:text-[15px]">
          Después de cada negocio, Hugo agradece a los propietarios y a los nuevos dueños. Estas son sus palabras.
        </p>
      </Encabezado>

      <div className="mt-8 sm:mt-12">
        <Deslizable
          ancho="w-[80%]"
          rejilla="sm:grid-cols-2 lg:grid-cols-4"
          items={CIERRES.map((cierre, i) => (
          <motion.figure
            key={cierre.codigo}
            {...revelar(i * 0.08)}
            className="flex flex-col overflow-hidden rounded-2xl border border-negro/[0.08] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          >
            {cierre.foto && (
              <div className="relative aspect-[4/5] bg-stone-100">
                <Foto
                  src={cierre.foto}
                  alt={`${cierre.titulo}, vendida`}
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <figcaption className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="versalitas text-[9.5px] text-bronce">{cierre.titulo}</p>
              <p className="mt-3 flex-1 text-[13.5px] font-light leading-relaxed text-grafito">«{cierre.texto}»</p>
              <a
                href={reelUrl(cierre.codigo)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-fit items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-negro hover:text-bronce"
              >
                <InstagramIcon className="h-3.5 w-3.5" /> Ver en Instagram
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </figcaption>
          </motion.figure>
          ))}
        />
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Vende tu propiedad                                                  */
/* ------------------------------------------------------------------ */

export const VendeTuPropiedad: React.FC<{ onContacto: () => void }> = ({ onContacto }) => (
  <section id="vender" className="scroll-mt-20 border-t border-negro/[0.06] bg-stone-100 py-16 sm:py-28">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:gap-12 sm:px-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Encabezado medio antetitulo="Para propietarios" titulo="¿Quieres que tu propiedad tenga alcance en venta y visual?">
          <p className="titular mt-4 text-[clamp(1.25rem,2.4vw,1.85rem)] font-light leading-[1.2] text-bronce sm:mt-6">{MARCA.captacion}</p>
        </Encabezado>
      </div>
      <motion.div {...revelar(0.12)} className="lg:col-span-5">
        <ul className="space-y-4 sm:space-y-5">
          {[
            'Tu propiedad recorrida por Hugo, fotografiada y publicada para una comunidad de 24,5 mil seguidores en Instagram.',
            'Una ficha completa, con áreas, espacios, administración y precio, como la de cada propiedad de esta página.',
            'Acompañamiento personal en cada visita, en la negociación y hasta el cierre.',
          ].map((punto) => (
            <li key={punto} className="flex gap-3.5 text-[14.5px] font-light leading-relaxed text-grafito sm:gap-4 sm:text-[15px]">
              <Check className="mt-1 h-4 w-4 shrink-0 text-oro" strokeWidth={2} />
              {punto}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-2.5 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-3">
          <a
            href={whatsappUrl('Hola Hugo, quiero vender mi propiedad. Te cuento los detalles:')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-grafito sm:tracking-[0.24em]"
          >
            <WhatsAppIcon className="h-4 w-4" /> Quiero vender mi propiedad
          </a>
          <button
            type="button"
            onClick={onContacto}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-negro/20 bg-white px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-negro transition-colors hover:bg-stone-50 sm:tracking-[0.24em]"
          >
            Escríbeme
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);
