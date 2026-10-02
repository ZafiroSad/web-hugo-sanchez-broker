import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { BIO, MARCA, PORTADA } from '../config/marca';
import { useProperties } from '../context/PropertyContext';
import type { Property } from '../types/property';
import { priceLabel, titleCase, whatsappUrl } from '../utils/formatters';
import { navigate } from '../utils/router';
import { CURVA } from '../utils/motion';
import { Foto } from './Foto';
import { InstagramIcon, WhatsAppIcon } from './marca';

/**
 * La portada: el nombre de Hugo, su slogan y sus propiedades a la vista desde
 * el primer momento. En el teléfono, una foto a sangre con un velo oscuro,
 * como la beta; en el computador, tres propiedades destacadas a la derecha.
 * Las cifras de confianza bajaron a «Sobre Hugo» para que la primera
 * propiedad quede a un paso.
 */

const OCULTO = { opacity: 0, y: 22, filter: 'blur(8px)' };
const VISIBLE = { opacity: 1, y: 0, filter: 'blur(0px)' };

function irAPropiedades() {
  document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const TarjetaPortada: React.FC<{ property: Property; desfase: string; retraso: number; animar: boolean }> = ({
  property,
  desfase,
  retraso,
  animar,
}) => (
  <motion.a
    href={`#/propiedad/${property.id}`}
    onClick={(e) => {
      e.preventDefault();
      navigate(`propiedad/${property.id}`);
    }}
    className={`group relative block aspect-[3/5] flex-1 overflow-hidden rounded-2xl bg-white/5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 ${desfase}`}
    initial={{ opacity: 0, y: 40 }}
    animate={animar ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
    transition={{ duration: 1.3, ease: CURVA.ios, delay: animar ? retraso : 0 }}
  >
    <Foto
      src={property.images[0]}
      alt={`${titleCase(property.name)}, ${property.sector}`}
      sizes="260px"
      prioridad
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-ios group-hover:scale-[1.05]"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-4">
      <p className="versalitas text-[8.5px] text-arena">{property.sector}</p>
      <p className="mt-1.5 text-[12.5px] font-normal uppercase leading-snug tracking-[0.12em] text-white">
        {property.name}
      </p>
      <p className="mt-2 flex items-center justify-between text-[12px] tabular-nums text-arena">
        {priceLabel(property).principal}
        <ArrowUpRight className="h-4 w-4 text-white/70 transition-transform duration-500 ease-ios group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </p>
    </div>
  </motion.a>
);

/** `animar` llega en falso mientras la intro tapa la portada: así entra cuando la intro se va. */
export const HomeHero: React.FC<{ animar?: boolean }> = ({ animar = true }) => {
  const entrada = (retraso: number) => ({
    initial: OCULTO,
    animate: animar ? VISIBLE : OCULTO,
    transition: { duration: 1.1, ease: CURVA.ios, delay: animar ? retraso + 0.15 : 0 },
  });
  const { publicProperties } = useProperties();
  const conFoto = publicProperties.filter((p) => p.images.length > 0 && p.status !== 'Vendido');
  const porId = (id: string) => conFoto.find((p) => p.id === id);
  const fondo = porId(PORTADA.fondo) ?? conFoto[0];
  const elegidas = PORTADA.tarjetas.map(porId).filter((p): p is Property => Boolean(p));
  const tarjetas = [...elegidas, ...conFoto.filter((p) => !elegidas.includes(p))].slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden bg-tinta text-white">
      {/* Fondo: en el teléfono la foto nítida; en el computador, la misma desenfocada como luz ambiente */}
      {fondo && (
        <Foto
          src={fondo.images[0]}
          alt=""
          sizes="100vw"
          prioridad
          className="absolute inset-0 -z-10 h-full w-full object-cover lg:scale-110 lg:opacity-35 lg:blur-2xl"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/35 lg:bg-gradient-to-r lg:from-tinta lg:via-tinta/85 lg:to-tinta/50" />
      <div aria-hidden="true" className="grano absolute inset-0 -z-10 opacity-[0.05]" />

      <div className="mx-auto grid min-h-[62svh] max-w-7xl items-end gap-12 px-5 pb-8 pt-24 sm:min-h-[70svh] sm:px-8 lg:min-h-[min(86vh,820px)] lg:grid-cols-12 lg:items-center lg:pb-14 lg:pt-28">
        <div className="lg:col-span-5">
          <motion.p className="versalitas text-[10px] text-arena" {...entrada(0.05)}>
            {MARCA.titulo} · {MARCA.ciudad}
            <span className="hidden sm:inline">, {MARCA.pais}</span>
          </motion.p>

          <motion.h1
            className="mt-4 font-extralight uppercase leading-[0.98] tracking-[0.12em] text-[clamp(2.6rem,12vw,4.4rem)] lg:mt-5 lg:text-[clamp(3.2rem,5.4vw,5.4rem)]"
            {...entrada(0.12)}
          >
            Hugo
            <br />
            Sánchez
          </motion.h1>

          <motion.p
            className="mt-3 max-w-xl text-balance font-script text-[clamp(1.55rem,3vw,2.5rem)] leading-[1.25] text-oro lg:mt-4"
            {...entrada(0.24)}
          >
            {MARCA.slogan}
          </motion.p>

          <motion.p
            className="mt-6 hidden max-w-md text-[14.5px] font-light leading-relaxed text-arena sm:block"
            {...entrada(0.32)}
          >
            {BIO.corta}
          </motion.p>

          <motion.div className="mt-6 flex items-center gap-2.5 sm:mt-8 sm:gap-3" {...entrada(0.42)}>
            <button
              type="button"
              onClick={irAPropiedades}
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-negro transition-colors hover:bg-stone-100 sm:py-4"
            >
              Ver propiedades
              <ArrowDown className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:translate-y-0.5" />
            </button>
            <a
              href={whatsappUrl('Hola Hugo, vi tu página web y quiero coordinar una visita.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-w-0 items-center gap-2.5 rounded-full border border-white/30 px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10 sm:px-6 sm:py-4 lg:inline-flex"
              aria-label="Coordina tu visita por WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              <span className="hidden min-[400px]:inline">Coordina tu visita</span>
              <span className="min-[400px]:hidden">WhatsApp</span>
            </a>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[9.5px] font-medium uppercase tracking-[0.2em] text-arena sm:mt-8 sm:text-[10px]"
            {...entrada(0.5)}
          >
            <a
              href={MARCA.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 transition-colors hover:text-white lg:inline-flex"
            >
              <InstagramIcon className="h-4 w-4" /> @{MARCA.instagram.usuario}
            </a>
            {fondo && (
              <a
                href={`#/propiedad/${fondo.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`propiedad/${fondo.id}`);
                }}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-white lg:hidden"
              >
                En la foto: {titleCase(fondo.name)} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Computador: tres propiedades destacadas */}
        <div className="hidden items-center gap-4 lg:col-span-7 lg:flex xl:gap-5">
          {tarjetas.map((p, i) => (
            <TarjetaPortada
              key={p.id}
              property={p}
              desfase={['translate-y-6', '-translate-y-6', 'translate-y-10'][i]}
              retraso={0.35 + i * 0.12}
              animar={animar}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
