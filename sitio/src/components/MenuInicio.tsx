import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CAPITULOS, MARCA, type Capitulo } from '../config/marca';
import { useProperties } from '../context/PropertyContext';
import { CATEGORIAS, enCategoria, ordenarDestacadas } from '../data/categorias';
import { navigate } from '../utils/router';
import { CURVA } from '../utils/motion';
import { Foto } from './Foto';
import { Historias } from './Historias';

/**
 * El inicio no es una página larga sino un menú: cada visitante empieza por
 * lo que le interesa. A la izquierda (arriba en el teléfono), las propiedades
 * destacadas como historias; alrededor, una baldosa por capítulo del sitio y
 * una de propiedades con sus categorías. Cada baldosa lleva a su página.
 */

/** Entrada escalonada; mientras la puerta está cerrada (`animar` en falso) espera. */
const entrada = (animar: boolean, retraso: number) => ({
  initial: { opacity: 0, y: 26, filter: 'blur(8px)' },
  animate: animar ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 26, filter: 'blur(8px)' },
  transition: { duration: 1.1, ease: CURVA.ios, delay: animar ? retraso : 0 },
});

/** Una baldosa: foto (o negro) con etiqueta, título y flecha. Toda ella es el enlace. */
export const Baldosa: React.FC<{
  ruta: string;
  etiqueta: string;
  titulo: string;
  foto?: string;
  encuadre?: string;
  sizes?: string;
  className?: string;
}> = ({ ruta, etiqueta, titulo, foto, encuadre, sizes = '(min-width: 1024px) 25vw, 50vw', className = '' }) => (
  <a
    href={`#/${ruta}`}
    onClick={(e) => {
      e.preventDefault();
      navigate(ruta);
    }}
    className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl p-4 text-white sm:p-5 ${
      foto ? 'bg-stone-300' : 'bg-negro'
    } ${className}`}
  >
    {foto && (
      <>
        <Foto
          src={foto}
          alt=""
          sizes={sizes}
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1400ms] ease-ios group-hover:scale-[1.05]"
          style={encuadre ? { objectPosition: encuadre } : undefined}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-black/0" />
      </>
    )}
    {!foto && (
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(80% 70% at 85% 10%, rgba(197,160,89,0.28) 0%, transparent 60%), linear-gradient(160deg, #1c1917 0%, #0c0a09 100%)',
        }}
      />
    )}
    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors duration-500 group-hover:bg-white group-hover:text-negro sm:right-4 sm:top-4">
      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </span>
    <span className={`versalitas text-[9px] sm:text-[9.5px] ${foto ? 'text-white/75' : 'text-oro'}`}>{etiqueta}</span>
    <span className="titular mt-1.5 text-[17px] font-normal leading-[1.15] sm:text-[20px]">{titulo}</span>
  </a>
);

export const baldosaDeCapitulo = (c: Capitulo) => ({
  ruta: c.id,
  etiqueta: c.etiqueta,
  titulo: c.titulo,
  foto: c.foto,
  encuadre: c.encuadre,
});

/** La baldosa de propiedades: cuántas hay y un atajo por categoría. */
const BaldosaPropiedades: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { publicProperties } = useProperties();
  const disponibles = publicProperties.filter((p) => p.status !== 'Vendido' && p.status !== 'Arrendado');
  const categorias = CATEGORIAS.map((c) => ({
    ...c,
    total: disponibles.filter((p) => enCategoria(p, c.id)).length,
  })).filter((c) => c.total > 0);

  return (
    <div
      className={`group relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-negro/[0.07] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-5 ${className}`}
    >
      <a
        href="#/propiedades"
        onClick={(e) => {
          e.preventDefault();
          navigate('propiedades');
        }}
        aria-label={`Ver las ${disponibles.length} propiedades`}
        className="absolute inset-0"
      />
      <div className="flex items-start justify-between">
        <span className="versalitas text-[9px] text-bronce sm:text-[9.5px]">Propiedades</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-negro transition-colors duration-500 group-hover:bg-negro group-hover:text-white">
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      <p className="flex items-baseline gap-2.5">
        <span className="titular text-[clamp(2.4rem,8vw,3rem)] font-light leading-none tabular-nums text-negro">
          {disponibles.length}
        </span>
        <span className="text-[13px] text-taupe">disponibles</span>
      </p>
      <div className="relative flex flex-wrap gap-1.5">
        {categorias.map((c) => (
          <a
            key={c.id}
            href={`#/propiedades/${c.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`propiedades/${c.id}`);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-negro/[0.1] bg-hueso px-3 py-1.5 text-[11.5px] text-grafito transition-colors hover:border-negro hover:bg-negro hover:text-white"
          >
            {c.nombre}
            <span className="text-[10px] tabular-nums opacity-60">{c.total}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export const MenuInicio: React.FC<{ animar?: boolean }> = ({ animar = true }) => {
  const { publicProperties } = useProperties();
  const historias = ordenarDestacadas(
    publicProperties.filter((p) => p.images.length > 0 && p.status !== 'Vendido' && p.status !== 'Arrendado'),
  ).slice(0, 6);
  const capitulo = (id: Capitulo['id']) => baldosaDeCapitulo(CAPITULOS.find((c) => c.id === id)!);

  return (
    <section aria-labelledby="titulo-inicio" className="bg-hueso pb-6 pt-[92px] sm:pb-10 sm:pt-[112px]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.header {...entrada(animar, 0.15)} className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
          <div>
            <p className="versalitas text-[10px] text-bronce">
              {MARCA.nombre} · {MARCA.titulo}
            </p>
            <h1
              id="titulo-inicio"
              className="titular mt-3 text-[clamp(2rem,7.8vw,3.5rem)] font-light leading-[1.02] text-negro"
            >
              ¿Por dónde empezamos?
            </h1>
          </div>
          <p className="hidden max-w-sm pb-1 text-[15px] font-light leading-relaxed text-grafito sm:block">
            {MARCA.slogan}.
          </p>
        </motion.header>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 lg:mt-10 lg:h-[clamp(540px,calc(100svh-15rem),680px)] lg:grid-cols-4 lg:grid-rows-3 lg:gap-4">
          <motion.div
            {...entrada(animar, 0.25)}
            className="col-span-2 aspect-[4/5] sm:aspect-[16/12] lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:aspect-auto"
          >
            <Historias propiedades={historias} animar={animar} className="h-full w-full" />
          </motion.div>
          <motion.div {...entrada(animar, 0.35)} className="col-span-2 lg:col-span-1 lg:col-start-4 lg:row-start-1">
            <BaldosaPropiedades className="h-full" />
          </motion.div>
          <motion.div {...entrada(animar, 0.42)} className="row-span-2 lg:col-start-3 lg:row-span-2 lg:row-start-1">
            <Baldosa {...capitulo('hugo')} className="h-full" />
          </motion.div>
          <motion.div {...entrada(animar, 0.5)} className="aspect-square lg:col-start-4 lg:row-start-2 lg:aspect-auto">
            <Baldosa {...capitulo('inversion')} className="h-full" />
          </motion.div>
          <motion.div {...entrada(animar, 0.56)} className="aspect-square lg:col-start-3 lg:row-start-3 lg:aspect-auto">
            <Baldosa {...capitulo('vendidas')} className="h-full" />
          </motion.div>
          <motion.div
            {...entrada(animar, 0.62)}
            className="col-span-2 h-[132px] lg:col-span-1 lg:col-start-4 lg:row-start-3 lg:h-auto"
          >
            <Baldosa {...capitulo('vender')} className="h-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
