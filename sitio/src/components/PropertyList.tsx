import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useProperties, type PropertySortOption } from '../context/PropertyContext';
import { CURVA } from '../utils/motion';
import { FilterDrawer } from './FilterDrawer';
import { PropertyCard } from './PropertyCard';

/** El catálogo completo: su «Book de propiedades». */
export const PropertyList: React.FC = () => {
  const {
    filteredProperties,
    publicProperties,
    filters,
    setFilters,
    activeFilterCount,
    resetFilters,
    sortBy,
    setSortBy,
    sectors,
  } = useProperties();
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  return (
    <section className="min-h-screen bg-hueso pb-28 pt-[120px] sm:pt-[136px]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: CURVA.ios }}
          className="max-w-3xl"
        >
          <p className="versalitas text-[10px] text-taupe">Book de propiedades</p>
          <h1 className="mt-5 font-extralight uppercase leading-[1.08] tracking-[0.1em] text-[clamp(2.2rem,5vw,4.2rem)] text-negro">
            Propiedades
          </h1>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-grafito">
            {publicProperties.length} propiedades publicadas por Hugo en Bucaramanga y su área metropolitana. Cada una
            con su recorrido en video.
          </p>
        </motion.header>

        {/* Zonas rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: CURVA.ios, delay: 0.1 }}
          className="sin-scroll -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {['', ...sectors].map((s) => (
            <button
              key={s || 'todas'}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, sector: s }))}
              className={`shrink-0 rounded-full border px-4 py-2 text-[11.5px] transition-colors ${
                filters.sector === s ? 'border-negro bg-negro text-hueso' : 'border-negro/12 bg-white/70 text-grafito hover:border-negro/40'
              }`}
            >
              {s || 'Todas las zonas'}
            </button>
          ))}
        </motion.div>

        {/* Búsqueda, orden y filtros */}
        <div className="mt-6 flex flex-col gap-3 border-b border-negro/10 pb-6 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-piedra" />
            <input
              type="search"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Buscar por nombre, zona o tipo…"
              className="w-full rounded-full border border-negro/12 bg-white py-3 pl-11 pr-10 text-[13.5px] text-negro placeholder:text-piedra focus:border-negro focus:outline-none"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-piedra hover:text-negro"
                aria-label="Borrar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <label className="relative flex-1 sm:flex-none">
              <span className="sr-only">Ordenar</span>
              <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-piedra" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as PropertySortOption)}
                className="w-full cursor-pointer appearance-none rounded-full border border-negro/12 bg-white py-3 pl-10 pr-6 text-[12.5px] text-negro focus:border-negro focus:outline-none"
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_desc">Mayor precio</option>
                <option value="precio_asc">Menor precio</option>
                <option value="area_desc">Mayor área</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => setFiltrosAbiertos(true)}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[12.5px] transition-colors ${
                activeFilterCount > 0 ? 'border-negro bg-negro text-hueso' : 'border-negro/12 bg-white text-negro hover:border-negro/40'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filtros
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-hueso text-[10px] font-semibold text-negro">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-5 text-[12px] text-taupe">
          <p>
            <span className="font-semibold text-negro">{filteredProperties.length}</span>{' '}
            {filteredProperties.length === 1 ? 'propiedad' : 'propiedades'}
          </p>
          {activeFilterCount > 0 && (
            <button type="button" onClick={resetFilters} className="underline underline-offset-4 hover:text-negro">
              Quitar filtros
            </button>
          )}
        </div>

        {filteredProperties.length === 0 ? (
          <div className="rounded-[3px] border border-dashed border-negro/15 bg-white/60 px-6 py-24 text-center">
            <p className="text-[20px] font-light uppercase tracking-[0.1em] text-negro">Sin resultados con estos filtros</p>
            <p className="mx-auto mt-3 max-w-md text-[13.5px] text-grafito">
              Hugo tiene más propiedades de las que publica. Escríbele y cuéntale qué buscas.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-7 rounded-full bg-negro px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-hueso"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>

      <FilterDrawer isOpen={filtrosAbiertos} onClose={() => setFiltrosAbiertos(false)} />
    </section>
  );
};
