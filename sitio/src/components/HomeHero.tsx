import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { BIO, CONFIANZA, MARCA } from '../config/marca';
import { useProperties } from '../context/PropertyContext';
import { formatMillions, whatsappUrl } from '../utils/formatters';
import { navigate } from '../utils/router';
import { CURVA } from '../utils/motion';
import { FirmaHS, InstagramIcon, WhatsAppIcon } from './marca';

/**
 * La vista principal: un resumen de Hugo. Su nombre donde la beta decía
 * «LUXURY REAL ESTATE», su descripción debajo y, al pie, las cifras que dan
 * confianza. Abajo del todo corre la marquesina con sus propiedades reales.
 */

const OCULTO = { opacity: 0, y: 22, filter: 'blur(8px)' };
const VISIBLE = { opacity: 1, y: 0, filter: 'blur(0px)' };

/** `animar` llega en falso mientras la intro tapa la portada: así entra cuando la intro se va. */
export const HomeHero: React.FC<{ animar?: boolean }> = ({ animar = true }) => {
  const entrada = (retraso: number) => ({
    initial: OCULTO,
    animate: animar ? VISIBLE : OCULTO,
    transition: { duration: 1.1, ease: CURVA.ios, delay: animar ? retraso + 0.15 : 0 },
  });
  const { publicProperties } = useProperties();
  const marquesina = [...publicProperties]
    .filter((p) => p.status !== 'Vendido' && p.status !== 'Arrendado')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 14);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-tinta text-hueso">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 48% at 78% 30%, rgba(217,208,195,0.11) 0%, transparent 70%), radial-gradient(45% 40% at 8% 88%, rgba(138,111,78,0.13) 0%, transparent 70%)',
        }}
      />
      <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.06]" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[4vw] top-[10vh] hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: animar ? 1 : 0 }}
        transition={{ duration: 2.4, ease: CURVA.ios, delay: 0.4 }}
      >
        <FirmaHS className="text-[34vw] text-white/[0.035]" />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-10 pt-32 sm:px-8 lg:pb-12">
        <motion.p className="versalitas text-[10px] text-piedra" {...entrada(0.05)}>
          {MARCA.titulo} · {MARCA.ciudad}, {MARCA.pais}
        </motion.p>

        <motion.h1
          className="mt-6 font-extralight uppercase leading-[0.98] tracking-[0.13em] text-[clamp(3.1rem,15vw,5rem)] sm:whitespace-nowrap sm:text-[clamp(3rem,8.2vw,8.6rem)]"
          {...entrada(0.12)}
        >
          Hugo <br className="sm:hidden" />
          Sánchez
        </motion.h1>

        <motion.p
          className="mt-3 max-w-3xl text-balance font-script text-[clamp(1.75rem,3.3vw,2.9rem)] leading-[1.25] text-arena"
          {...entrada(0.24)}
        >
          {MARCA.slogan}
        </motion.p>

        <motion.div className="mt-8 max-w-2xl space-y-3 text-[15px] font-light leading-relaxed text-arena/80" {...entrada(0.34)}>
          <p className="text-hueso/90">{BIO.corta}</p>
          <p>{BIO.trayectoria}</p>
        </motion.div>

        <motion.div className="mt-9 flex flex-wrap items-center gap-3" {...entrada(0.44)}>
          <button
            type="button"
            onClick={() => navigate('propiedades')}
            className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-negro transition-colors hover:bg-hueso"
          >
            Ver propiedades
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:translate-x-1" />
          </button>
          <a
            href={whatsappUrl('Hola Hugo, vi tu página web y quiero coordinar una visita.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-hueso transition-colors hover:bg-white/10"
          >
            <WhatsAppIcon className="h-4 w-4" /> Coordina tu visita
          </a>
          <a
            href={MARCA.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-4 text-[10.5px] font-medium uppercase tracking-[0.22em] text-piedra transition-colors hover:text-hueso"
          >
            <InstagramIcon className="h-4 w-4" /> @{MARCA.instagram.usuario}
          </a>
        </motion.div>

        {/* Lo que da confianza */}
        <motion.dl
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-9 border-t border-white/12 pt-9 lg:grid-cols-4"
          {...entrada(0.56)}
        >
          {[
            ...CONFIANZA,
            {
              valor: String(publicProperties.filter((p) => p.status === 'Disponible').length),
              etiqueta: 'Propiedades disponibles',
              detalle: 'Cada una con su recorrido en video, su ficha y su precio.',
            },
          ].map((item) => (
            <div key={item.etiqueta}>
              <dt className="sr-only">{item.etiqueta}</dt>
              <dd className="text-[clamp(1.7rem,2.7vw,2.5rem)] font-extralight leading-none tabular-nums text-white">
                {item.valor}
              </dd>
              <dd className="versalitas mt-3 text-[9.5px] text-arena">{item.etiqueta}</dd>
              <dd className="mt-2 max-w-[24ch] text-[12px] leading-snug text-piedra">{item.detalle}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Marquesina con sus propiedades publicadas */}
      {marquesina.length > 0 && (
        <div className="group/marquesina relative border-t border-white/10 py-4">
          <div className="flex w-max animate-marquesina group-hover/marquesina:[animation-play-state:paused]">
            {[0, 1].map((copia) => (
              <ul key={copia} className="flex shrink-0 items-center" aria-hidden={copia === 1}>
                {marquesina.map((p) => (
                  <li key={`${copia}-${p.id}`} className="flex items-center">
                    <a
                      href={`#/propiedad/${p.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`propiedad/${p.id}`);
                      }}
                      tabIndex={copia === 1 ? -1 : 0}
                      className="whitespace-nowrap px-6 text-[10px] font-medium uppercase tracking-[0.3em] text-piedra transition-colors hover:text-hueso"
                    >
                      {p.name}
                      {p.price && !p.priceOnRequest && (
                        <span className="ml-3 text-arena/70">
                          {p.priceIsFrom ? 'desde ' : ''}
                          {formatMillions(p.price)}
                          {p.operation === 'Arriendo' ? ' / mes' : ''}
                        </span>
                      )}
                    </a>
                    <span aria-hidden="true" className="text-white/20">
                      ·
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
