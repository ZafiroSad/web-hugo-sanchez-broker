import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RotateCcw, X } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import type { PriceRange, PropertyOperation, PropertyType } from '../types/property';
import { CURVA } from '../utils/motion';

const RANGOS: { valor: PriceRange; etiqueta: string }[] = [
  { valor: 'Todos', etiqueta: 'Todos' },
  { valor: 'hasta-1000', etiqueta: 'Hasta $1.000 M' },
  { valor: '1000-2000', etiqueta: '$1.000 a 2.000 M' },
  { valor: '2000-4000', etiqueta: '$2.000 a 4.000 M' },
  { valor: 'mas-4000', etiqueta: 'Más de $4.000 M' },
];

const Opcion: React.FC<{ activa: boolean; onClick: () => void; children: React.ReactNode }> = ({
  activa,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-[12px] transition-colors ${
      activa ? 'border-negro bg-negro text-hueso' : 'border-negro/12 bg-white text-grafito hover:border-negro/40'
    }`}
  >
    {children}
  </button>
);

const Grupo: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div>
    <p className="versalitas mb-3 text-[9.5px] text-taupe">{titulo}</p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export const FilterDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { filters, setFilters, filteredProperties, resetFilters, activeFilterCount, sectors, publicProperties } =
    useProperties();

  const tipos = Array.from(new Set(publicProperties.map((p) => p.propertyType))) as PropertyType[];
  const fijar = <K extends keyof typeof filters>(clave: K, valor: (typeof filters)[K]) =>
    setFilters((prev) => ({ ...prev, [clave]: valor }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end">
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.aside
            className="relative mt-auto flex h-[90vh] w-full flex-col rounded-t-[14px] bg-hueso shadow-2xl md:mt-0 md:h-full md:max-w-md md:rounded-none"
            initial={{ x: '100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.6 }}
            transition={{ duration: 0.6, ease: CURVA.ios }}
            aria-label="Filtros"
          >
            <div className="flex items-center justify-between border-b border-negro/10 px-6 py-5">
              <div>
                <p className="text-[15px] font-medium uppercase tracking-[0.12em] text-negro">Filtros</p>
                <p className="text-[12px] text-taupe">{filteredProperties.length} propiedades</p>
              </div>
              <div className="flex items-center gap-1">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] text-taupe hover:text-negro"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Limpiar
                  </button>
                )}
                <button type="button" onClick={onClose} className="p-2 text-taupe hover:text-negro" aria-label="Cerrar filtros">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-7">
              <Grupo titulo="Operación">
                {(['Todas', 'Venta', 'Arriendo'] as ('Todas' | PropertyOperation)[]).map((op) => (
                  <Opcion key={op} activa={filters.operation === op} onClick={() => fijar('operation', op)}>
                    {op}
                  </Opcion>
                ))}
              </Grupo>

              <Grupo titulo="Zona">
                <Opcion activa={!filters.sector} onClick={() => fijar('sector', '')}>
                  Todas
                </Opcion>
                {sectors.map((s) => (
                  <Opcion key={s} activa={filters.sector === s} onClick={() => fijar('sector', s)}>
                    {s}
                  </Opcion>
                ))}
              </Grupo>

              <Grupo titulo="Tipo de inmueble">
                <Opcion activa={filters.propertyType === 'Todos'} onClick={() => fijar('propertyType', 'Todos')}>
                  Todos
                </Opcion>
                {tipos.map((t) => (
                  <Opcion key={t} activa={filters.propertyType === t} onClick={() => fijar('propertyType', t)}>
                    {t}
                  </Opcion>
                ))}
              </Grupo>

              <Grupo titulo="Precio de venta">
                {RANGOS.map((r) => (
                  <Opcion key={r.valor} activa={filters.priceRange === r.valor} onClick={() => fijar('priceRange', r.valor)}>
                    {r.etiqueta}
                  </Opcion>
                ))}
              </Grupo>

              <Grupo titulo="Habitaciones">
                {[undefined, 2, 3, 4, 5].map((n) => (
                  <Opcion key={n ?? 'todas'} activa={filters.bedrooms === n} onClick={() => fijar('bedrooms', n)}>
                    {n === undefined ? 'Todas' : `${n} o más`}
                  </Opcion>
                ))}
              </Grupo>

              <Grupo titulo="Área mínima">
                {[undefined, 150, 250, 400, 600].map((n) => (
                  <Opcion key={n ?? 'todas'} activa={filters.minArea === n} onClick={() => fijar('minArea', n)}>
                    {n === undefined ? 'Cualquiera' : `${n} m² o más`}
                  </Opcion>
                ))}
              </Grupo>
            </div>

            <div className="border-t border-negro/10 p-5">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full bg-negro py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-hueso"
              >
                Ver {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad' : 'propiedades'}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
