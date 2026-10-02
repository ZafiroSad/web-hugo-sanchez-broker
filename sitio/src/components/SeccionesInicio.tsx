import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Handshake, House, KeyRound } from 'lucide-react';
import { BIO, MARCA, PILARES, PROCESO } from '../config/marca';
import { CIERRES, INVERSION, MANIFIESTO_VIDEO, reelUrl } from '../data/contenido';
import { useProperties } from '../context/PropertyContext';
import { formatDate, whatsappUrl } from '../utils/formatters';
import { navigate } from '../utils/router';
import { revelar } from '../utils/motion';
import { FirmaHS, InstagramIcon, WhatsAppIcon } from './marca';
import { PropertyCard } from './PropertyCard';
import { VideoEmbed } from './VideoEmbed';

/* ------------------------------------------------------------------ */
/* Piezas comunes                                                      */
/* ------------------------------------------------------------------ */

const Encabezado: React.FC<{
  antetitulo: string;
  titulo: React.ReactNode;
  tono?: 'claro' | 'oscuro';
  centrado?: boolean;
  medio?: boolean;
  children?: React.ReactNode;
}> = ({ antetitulo, titulo, tono = 'claro', centrado = false, medio = false, children }) => (
  <motion.div {...revelar()} className={centrado ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
    <p className={`versalitas text-[10px] ${tono === 'oscuro' ? 'text-piedra' : 'text-taupe'}`}>{antetitulo}</p>
    <h2
      className={`mt-5 font-extralight uppercase leading-[1.12] tracking-[0.1em] ${
        medio ? 'text-[clamp(1.7rem,3vw,2.6rem)]' : 'text-[clamp(1.9rem,4vw,3.3rem)]'
      } ${
        tono === 'oscuro' ? 'text-hueso' : 'text-negro'
      }`}
    >
      {titulo}
    </h2>
    {children}
  </motion.div>
);

/** Portada oscura para los videos que cargan al pulsar. */
const PortadaVideo: React.FC<{ etiqueta: string; texto: string }> = ({ etiqueta, texto }) => (
  <div className="absolute inset-0 flex flex-col justify-between bg-negro p-6 text-hueso">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(70% 50% at 30% 20%, rgba(217,208,195,0.14), transparent 70%), linear-gradient(170deg,#1b1916,#0b0b0b)',
      }}
    />
    <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.07]" />
    <span className="versalitas relative text-[9px] text-arena">{etiqueta}</span>
    <span className="relative pr-6 text-[15px] font-light leading-snug text-hueso/90">{texto}</span>
  </div>
);

const ICONOS = { casa: House, llave: KeyRound, trato: Handshake } as const;

/* ------------------------------------------------------------------ */
/* Sobre Hugo                                                          */
/* ------------------------------------------------------------------ */

export const SobreHugo: React.FC = () => (
  <section id="sobre" className="scroll-mt-20 bg-hueso py-24 sm:py-32">
    <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <Encabezado medio antetitulo="Sobre Hugo" titulo={<>Te acompaño en la búsqueda de tu propiedad ideal o inversión</>} />

        <motion.div {...revelar(0.1)} className="mt-10 max-w-2xl space-y-5 text-[16px] font-light leading-[1.8] text-grafito">
          {BIO.larga.map((parrafo) => (
            <p key={parrafo.slice(0, 20)}>{parrafo}</p>
          ))}
        </motion.div>

        <motion.blockquote {...revelar(0.18)} className="mt-12 border-l border-negro/15 pl-6">
          <p className="font-script text-[clamp(2rem,3.6vw,3rem)] leading-tight text-negro">{BIO.cita}</p>
          <footer className="versalitas mt-3 text-[10px] text-taupe">Hugo Sánchez</footer>
        </motion.blockquote>

        <motion.ul {...revelar(0.24)} className="mt-12 grid gap-3 text-[13px] text-grafito sm:grid-cols-2">
          {[
            'Cuenta verificada en Instagram',
            'Nominado por Horror Brokers Colombia (2025)',
            'Aliado comercial de Sumas Construcciones',
            'Presente en ExpoVivienda Santander 2026',
          ].map((dato) => (
            <li key={dato} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-bronce" strokeWidth={1.75} />
              {dato}
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div {...revelar(0.12)} className="lg:col-span-5">
        <div className="mx-auto max-w-[360px] lg:sticky lg:top-28">
          <VideoEmbed
            url={reelUrl(MANIFIESTO_VIDEO.codigo)}
            title="El verdadero lujo"
            carga="clic"
            portada={<PortadaVideo etiqueta="Hugo Sánchez · Reel fijado" texto={MANIFIESTO_VIDEO.texto} />}
          />
        </div>
      </motion.div>
    </div>

    {/* Por qué Hugo */}
    <div className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
      <div className="grid gap-px overflow-hidden rounded-[3px] bg-negro/10 sm:grid-cols-2 lg:grid-cols-4">
        {PILARES.map((pilar, i) => (
          <motion.div key={pilar.titulo} {...revelar(i * 0.07)} className="bg-hueso p-8">
            <span className="text-[12px] font-light tabular-nums text-piedra">0{i + 1}</span>
            <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-negro">{pilar.titulo}</h3>
            <p className="mt-4 text-[14px] font-light leading-relaxed text-grafito">{pilar.texto}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Cómo trabajo: casa, llave y apretón de manos                         */
/* ------------------------------------------------------------------ */

export const ComoTrabajo: React.FC = () => (
  <section className="relative overflow-hidden bg-negro py-24 text-hueso sm:py-28">
    <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.06]" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Así trabajo" titulo="Tres pasos, una sola persona contigo" tono="oscuro" />
      <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
        {PROCESO.map((paso, i) => {
          const Icono = ICONOS[paso.icono];
          return (
            <motion.div key={paso.titulo} {...revelar(i * 0.1)} className="relative">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15">
                  <Icono className="h-5 w-5 text-arena" strokeWidth={1.3} />
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
              </div>
              <h3 className="mt-7 text-[13px] font-semibold uppercase tracking-[0.2em]">{paso.titulo}</h3>
              <p className="mt-3 max-w-sm text-[14px] font-light leading-relaxed text-piedra">{paso.texto}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Book de propiedades (destacadas)                                    */
/* ------------------------------------------------------------------ */

export const Destacadas: React.FC = () => {
  const { publicProperties } = useProperties();
  const recientes = [...publicProperties].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const destacadas = [...recientes.filter((p) => p.featured), ...recientes.filter((p) => !p.featured)].slice(0, 6);

  return (
    <section id="propiedades" className="scroll-mt-20 bg-hueso pb-24 pt-8 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 border-t border-negro/10 pt-20 md:flex-row md:items-end">
          <Encabezado antetitulo="Book de propiedades" titulo="Recién publicadas por Hugo">
            <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-grafito">
              Cada propiedad tiene su recorrido en video, su ficha completa y su precio. Coordina tu visita
              directamente con Hugo.
            </p>
          </Encabezado>
          <motion.button
            {...revelar(0.1)}
            type="button"
            onClick={() => navigate('propiedades')}
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-hueso transition-colors hover:bg-grafito"
          >
            Ver las {publicProperties.length} propiedades
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:translate-x-1" />
          </motion.button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {destacadas.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Manifiesto                                                          */
/* ------------------------------------------------------------------ */

export const Manifiesto: React.FC = () => (
  <section className="relative overflow-hidden bg-tinta py-28 text-hueso sm:py-40">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ background: 'radial-gradient(50% 60% at 50% 50%, rgba(217,208,195,0.09), transparent 72%)' }}
    />
    <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.06]" />
    <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
      <motion.p {...revelar()} className="versalitas text-[10px] text-piedra">
        Manifiesto
      </motion.p>
      <motion.p
        {...revelar(0.1)}
        className="mt-8 font-extralight uppercase leading-[1.25] tracking-[0.1em] text-[clamp(1.6rem,4.4vw,3.6rem)]"
      >
        El verdadero lujo en el sector inmobiliario es el acceso
      </motion.p>
      <motion.p {...revelar(0.25)} className="mt-6 font-script text-[clamp(2.2rem,5vw,4rem)] text-arena">
        y no todos lo tienen.
      </motion.p>
      <motion.div {...revelar(0.35)} className="mt-12 flex justify-center">
        <FirmaHS className="text-5xl text-hueso/70" />
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Inversión: proyectos sobre planos y Panamá                          */
/* ------------------------------------------------------------------ */

export const Inversion: React.FC = () => (
  <section id="inversion" className="scroll-mt-20 bg-hueso py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Inversión" titulo="Proyectos sobre planos e inversión en dólares">
        <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-grafito">
          Además de su portafolio de reventa, Hugo comercializa proyectos nuevos en Bucaramanga y en ciudad de Panamá.
        </p>
      </Encabezado>

      <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-10">
        {INVERSION.map((linea, i) => (
          <motion.article
            key={linea.codigo}
            {...revelar(i * 0.1)}
            className="grid gap-8 border-t border-negro/10 pt-10 sm:grid-cols-[minmax(0,220px)_1fr]"
          >
            <VideoEmbed
              url={reelUrl(linea.codigo)}
              title={linea.titulo}
              carga="clic"
              portada={<PortadaVideo etiqueta={linea.etiqueta} texto={linea.titulo} />}
              className="mx-auto max-w-[260px] sm:mx-0"
            />
            <div>
              <p className="versalitas text-[10px] text-bronce">{linea.etiqueta}</p>
              <h3 className="mt-4 text-[22px] font-light uppercase tracking-[0.1em] text-negro">{linea.titulo}</h3>
              <p className="mt-4 text-[14.5px] font-light leading-relaxed text-grafito">{linea.texto}</p>
              <ul className="mt-6 space-y-3">
                {linea.puntos.map((punto) => (
                  <li key={punto} className="flex gap-3 text-[13.5px] leading-relaxed text-grafito">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-negro/40" />
                    {punto}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappUrl(linea.mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 border-b border-negro/25 pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-negro transition-colors hover:border-negro"
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
/* Vendidas: cada cierre, contado por Hugo                             */
/* ------------------------------------------------------------------ */

export const Cierres: React.FC = () => (
  <section id="vendidas" className="relative scroll-mt-20 overflow-hidden bg-negro py-24 text-hueso sm:py-32">
    <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.06]" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <Encabezado antetitulo="Vendidas" titulo="Cada cierre, contado por Hugo" tono="oscuro">
        <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-piedra">
          Después de cada negocio, Hugo publica un video con los nuevos propietarios. Estas son sus palabras.
        </p>
      </Encabezado>

      <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {CIERRES.map((cierre, i) => (
          <motion.figure key={cierre.codigo} {...revelar(i * 0.08)}>
            <VideoEmbed
              url={reelUrl(cierre.codigo)}
              title={cierre.titulo}
              carga="clic"
              telefono={false}
              portada={
                <div className="absolute inset-0 flex flex-col items-center justify-end bg-grafito pb-9">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(60% 50% at 50% 35%, rgba(217,208,195,0.16), transparent 70%)' }}
                  />
                  <span className="relative text-[22px] font-extralight uppercase tracking-[0.34em] text-white">Vendida</span>
                  <span className="versalitas relative mt-3 text-[9px] text-arena">{formatDate(cierre.fecha)}</span>
                </div>
              }
            />
            <figcaption className="mt-6">
              <p className="text-[13.5px] font-light leading-relaxed text-arena/90">«{cierre.texto}»</p>
              <p className="versalitas mt-4 text-[9.5px] text-piedra">{cierre.titulo}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <motion.a
        {...revelar(0.2)}
        href={MARCA.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-16 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-hueso transition-colors hover:border-white"
      >
        <InstagramIcon className="h-3.5 w-3.5" /> Ver todos los cierres en Instagram
      </motion.a>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Vende tu propiedad                                                  */
/* ------------------------------------------------------------------ */

export const VendeTuPropiedad: React.FC<{ onContacto: () => void }> = ({ onContacto }) => (
  <section id="vender" className="scroll-mt-20 bg-arena/45 py-24 sm:py-32">
    <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Encabezado medio antetitulo="Para propietarios" titulo="¿Quieres que tu propiedad tenga alcance en venta y visual?">
          <p className="mt-6 font-script text-[clamp(1.9rem,3.2vw,2.7rem)] leading-tight text-negro">{MARCA.captacion}</p>
        </Encabezado>
      </div>
      <motion.div {...revelar(0.12)} className="lg:col-span-5">
        <ul className="space-y-5">
          {[
            'Tu propiedad recorrida en video y publicada para una comunidad de 24,5 mil seguidores en Instagram.',
            'Una ficha completa, con áreas, espacios, administración y precio, como la de cada propiedad de esta página.',
            'Acompañamiento personal en cada visita, en la negociación y hasta el cierre.',
          ].map((punto) => (
            <li key={punto} className="flex gap-4 text-[15px] font-light leading-relaxed text-grafito">
              <Check className="mt-1 h-4 w-4 shrink-0 text-bronce" strokeWidth={1.75} />
              {punto}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={whatsappUrl('Hola Hugo, quiero vender mi propiedad. Te cuento los detalles:')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-hueso transition-colors hover:bg-grafito"
          >
            <WhatsAppIcon className="h-4 w-4" /> Quiero vender mi propiedad
          </a>
          <button
            type="button"
            onClick={onContacto}
            className="inline-flex items-center gap-2 rounded-full border border-negro/25 px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-negro transition-colors hover:bg-negro/[0.04]"
          >
            Escríbeme
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);
