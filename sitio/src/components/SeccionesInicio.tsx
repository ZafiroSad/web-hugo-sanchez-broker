import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Handshake, House, KeyRound } from 'lucide-react';
import { BIO, CONFIANZA, MARCA, PILARES, PROCESO, RETRATO } from '../config/marca';
import { CIERRES, INVERSION, reelUrl } from '../data/contenido';
import { useProperties } from '../context/PropertyContext';
import { whatsappUrl } from '../utils/formatters';
import { navigate } from '../utils/router';
import { revelar } from '../utils/motion';
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
      className={`mt-4 font-light uppercase leading-[1.14] tracking-[0.1em] ${
        medio ? 'text-[clamp(1.6rem,2.8vw,2.4rem)]' : 'text-[clamp(1.8rem,3.6vw,3rem)]'
      } ${tono === 'oscuro' ? 'text-white' : 'text-negro'}`}
    >
      {titulo}
    </h2>
    {children}
  </motion.div>
);

const ICONOS = { casa: House, llave: KeyRound, trato: Handshake } as const;

const botonOscuro =
  'group inline-flex items-center gap-3 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-grafito';

/* ------------------------------------------------------------------ */
/* Propiedades: justo debajo de la portada                             */
/* ------------------------------------------------------------------ */

export const Destacadas: React.FC = () => {
  const { publicProperties } = useProperties();
  const recientes = [...publicProperties].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const destacadas = [...recientes.filter((p) => p.featured), ...recientes.filter((p) => !p.featured)].slice(0, 6);
  const verTodas = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('propiedades');
  };

  return (
    <section id="propiedades" className="scroll-mt-16 bg-hueso pb-20 pt-7 sm:pb-28 sm:pt-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-negro/[0.08] pb-4 sm:pb-6">
          <div>
            <p className="versalitas text-[10px] text-bronce">Book de propiedades</p>
            <h2 className="mt-3 text-[clamp(1.2rem,5vw,2.2rem)] font-light uppercase tracking-[0.1em] text-negro">
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

        <div className="mt-5 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {destacadas.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} prioridad={i < 3} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
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
  const cifras = [
    ...CONFIANZA,
    {
      valor: String(publicProperties.filter((p) => p.status === 'Disponible').length),
      etiqueta: 'Propiedades disponibles',
      detalle: 'Cada una con sus fotos, su ficha y su precio.',
    },
  ];

  return (
    <section id="sobre" className="scroll-mt-20 border-y border-negro/[0.06] bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        <motion.figure {...revelar()} className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:mx-0">
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

          <motion.div {...revelar(0.08)} className="mt-8 max-w-2xl space-y-5 text-[15.5px] font-light leading-[1.8] text-grafito">
            <p className="text-negro">{BIO.trayectoria}</p>
            {BIO.larga.map((parrafo) => (
              <p key={parrafo.slice(0, 20)}>{parrafo}</p>
            ))}
          </motion.div>

          <motion.blockquote {...revelar(0.14)} className="mt-10 border-l-2 border-oro/60 pl-6">
            <p className="font-script text-[clamp(1.9rem,3.2vw,2.7rem)] leading-tight text-negro">{BIO.cita}</p>
            <footer className="versalitas mt-2 text-[10px] text-taupe">{MARCA.nombre}</footer>
          </motion.blockquote>

          <motion.ul {...revelar(0.2)} className="mt-10 grid gap-3 text-[13px] text-grafito sm:grid-cols-2">
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
      <div className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cifras.map((item, i) => (
            <motion.div
              key={item.etiqueta}
              {...revelar(i * 0.06)}
              className="rounded-2xl border border-negro/[0.06] bg-hueso p-5 sm:p-6"
            >
              <dt className="sr-only">{item.etiqueta}</dt>
              <dd className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-light leading-none tabular-nums text-negro">{item.valor}</dd>
              <dd className="versalitas mt-3 text-[9.5px] text-bronce">{item.etiqueta}</dd>
              <dd className="mt-2 text-[12px] leading-snug text-taupe">{item.detalle}</dd>
            </motion.div>
          ))}
        </dl>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((pilar, i) => (
            <motion.div
              key={pilar.titulo}
              {...revelar(i * 0.06)}
              className="rounded-2xl border border-negro/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <span className="text-[12px] font-light tabular-nums text-oro">0{i + 1}</span>
              <h3 className="mt-4 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-negro">{pilar.titulo}</h3>
              <p className="mt-3 text-[13.5px] font-light leading-relaxed text-grafito">{pilar.texto}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Cómo trabajo: casa, llave y apretón de manos                         */
/* ------------------------------------------------------------------ */

export const ComoTrabajo: React.FC = () => (
  <section className="bg-hueso py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Así trabajo" titulo="Tres pasos, una sola persona contigo" />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PROCESO.map((paso, i) => {
          const Icono = ICONOS[paso.icono];
          return (
            <motion.div
              key={paso.titulo}
              {...revelar(i * 0.1)}
              className="rounded-2xl border border-negro/[0.06] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
                  <Icono className="h-5 w-5 text-bronce" strokeWidth={1.5} />
                </span>
                <span className="text-[12px] font-light tabular-nums text-piedra">Paso {i + 1}</span>
              </div>
              <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-negro">{paso.titulo}</h3>
              <p className="mt-3 text-[14px] font-light leading-relaxed text-grafito">{paso.texto}</p>
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
  <section id="inversion" className="scroll-mt-20 border-t border-negro/[0.06] bg-white py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Inversión" titulo="Proyectos sobre planos e inversión en dólares">
        <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-grafito">
          Además de su portafolio de reventa, Hugo comercializa proyectos nuevos en Bucaramanga y en ciudad de Panamá.
        </p>
      </Encabezado>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {INVERSION.map((linea, i) => (
          <motion.article
            key={linea.codigo}
            {...revelar(i * 0.1)}
            className="grid overflow-hidden rounded-2xl border border-negro/[0.08] bg-hueso sm:grid-cols-[minmax(0,0.85fr)_1fr]"
          >
            {linea.foto && (
              <div className="relative aspect-[4/3] bg-stone-100 sm:aspect-auto">
                <Foto
                  src={linea.foto}
                  alt={linea.titulo}
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-7 sm:p-8">
              <p className="versalitas text-[10px] text-bronce">{linea.etiqueta}</p>
              <h3 className="mt-3 text-[20px] font-light uppercase tracking-[0.1em] text-negro">{linea.titulo}</h3>
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
  <section className="relative isolate overflow-hidden bg-tinta py-28 text-white sm:py-36">
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
        className="mt-8 font-extralight uppercase leading-[1.25] tracking-[0.1em] text-[clamp(1.6rem,4.4vw,3.6rem)]"
      >
        El verdadero lujo en el sector inmobiliario es el acceso
      </motion.p>
      <motion.p {...revelar(0.25)} className="mt-6 font-script text-[clamp(2.2rem,5vw,4rem)] text-oro">
        y no todos lo tienen.
      </motion.p>
      <motion.div {...revelar(0.35)} className="mt-10 flex justify-center">
        <FirmaHS className="text-5xl text-white/70" />
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Vendidas: cada cierre, contado por Hugo                             */
/* ------------------------------------------------------------------ */

export const Cierres: React.FC = () => (
  <section id="vendidas" className="scroll-mt-20 bg-hueso py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Vendidas" titulo="Cada cierre, contado por Hugo">
        <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-grafito">
          Después de cada negocio, Hugo agradece a los propietarios y a los nuevos dueños. Estas son sus palabras.
        </p>
      </Encabezado>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CIERRES.map((cierre, i) => (
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
            <figcaption className="flex flex-1 flex-col p-6">
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
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Vende tu propiedad                                                  */
/* ------------------------------------------------------------------ */

export const VendeTuPropiedad: React.FC<{ onContacto: () => void }> = ({ onContacto }) => (
  <section id="vender" className="scroll-mt-20 border-t border-negro/[0.06] bg-stone-100 py-20 sm:py-28">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Encabezado medio antetitulo="Para propietarios" titulo="¿Quieres que tu propiedad tenga alcance en venta y visual?">
          <p className="mt-6 font-script text-[clamp(1.9rem,3.2vw,2.7rem)] leading-tight text-bronce">{MARCA.captacion}</p>
        </Encabezado>
      </div>
      <motion.div {...revelar(0.12)} className="lg:col-span-5">
        <ul className="space-y-5">
          {[
            'Tu propiedad recorrida por Hugo, fotografiada y publicada para una comunidad de 24,5 mil seguidores en Instagram.',
            'Una ficha completa, con áreas, espacios, administración y precio, como la de cada propiedad de esta página.',
            'Acompañamiento personal en cada visita, en la negociación y hasta el cierre.',
          ].map((punto) => (
            <li key={punto} className="flex gap-4 text-[15px] font-light leading-relaxed text-grafito">
              <Check className="mt-1 h-4 w-4 shrink-0 text-oro" strokeWidth={2} />
              {punto}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={whatsappUrl('Hola Hugo, quiero vender mi propiedad. Te cuento los detalles:')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-grafito"
          >
            <WhatsAppIcon className="h-4 w-4" /> Quiero vender mi propiedad
          </a>
          <button
            type="button"
            onClick={onContacto}
            className="inline-flex items-center gap-2 rounded-full border border-negro/20 bg-white px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-negro transition-colors hover:bg-stone-50"
          >
            Escríbeme
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);
