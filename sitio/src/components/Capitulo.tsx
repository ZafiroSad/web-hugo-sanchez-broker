import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CAPITULOS } from '../config/marca';
import { useProperties } from '../context/PropertyContext';
import { ordenarDestacadas } from '../data/categorias';
import { navigate, type CapituloId } from '../utils/router';
import { Baldosa, baldosaDeCapitulo } from './MenuInicio';
import { Cierres, ComoTrabajo, Inversion, Manifiesto, SobreHugo, VendeTuPropiedad } from './SeccionesInicio';

/**
 * Un capítulo del sitio en su propia página. Arriba, el camino de vuelta al
 * menú; abajo, «Sigue explorando» con los demás capítulos y las propiedades:
 * de cualquier página se puede saltar a cualquier otra, sin recorrer el sitio
 * en orden.
 */

const SigueExplorando: React.FC<{ actual: CapituloId }> = ({ actual }) => {
  const { publicProperties } = useProperties();
  const disponibles = publicProperties.filter((p) => p.status !== 'Vendido' && p.status !== 'Arrendado');
  const portada = ordenarDestacadas(disponibles.filter((p) => p.images.length > 0))[0];
  const otros = CAPITULOS.filter((c) => c.id !== actual);

  return (
    <section aria-labelledby="sigue-explorando" className="border-t border-negro/[0.06] bg-hueso py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="versalitas text-[10px] text-bronce">Sigue explorando</p>
        <h2
          id="sigue-explorando"
          className="titular mt-3 text-[clamp(1.5rem,5.6vw,2.4rem)] font-light leading-[1.08] text-negro"
        >
          ¿Qué más quieres ver?
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          <Baldosa
            ruta="propiedades"
            etiqueta="Propiedades"
            titulo={`Las ${disponibles.length} disponibles`}
            foto={portada?.images[0]}
            className="aspect-[4/5]"
          />
          {otros.map((c) => (
            <Baldosa key={c.id} {...baldosaDeCapitulo(c)} className="aspect-[4/5]" />
          ))}
        </div>
      </div>
    </section>
  );
};

export const PaginaCapitulo: React.FC<{ id: CapituloId; onContacto: () => void }> = ({ id, onContacto }) => (
  <>
    <div className="mx-auto max-w-7xl px-5 pt-[88px] sm:px-8 sm:pt-[104px]">
      <a
        href="#/inicio"
        onClick={(e) => {
          e.preventDefault();
          navigate('inicio');
        }}
        className="group inline-flex items-center gap-2 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-taupe transition-colors hover:text-negro"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-ios group-hover:-translate-x-1" />{' '}
        Inicio
      </a>
    </div>
    {id === 'hugo' && (
      <>
        <SobreHugo />
        <ComoTrabajo />
        <Manifiesto />
      </>
    )}
    {id === 'inversion' && <Inversion />}
    {id === 'vendidas' && <Cierres />}
    {id === 'vender' && <VendeTuPropiedad onContacto={onContacto} />}
    <SigueExplorando actual={id} />
  </>
);
