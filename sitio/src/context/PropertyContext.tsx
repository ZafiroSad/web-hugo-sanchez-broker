import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Property, PropertyFilterState, PropertyStatus, PriceRange } from '../types/property';
import { INITIAL_PROPERTIES, SEED_VERSION } from '../data/propiedades';
import { ORDEN_ZONAS } from '../data/zonas';

/**
 * Inventario de propiedades.
 *
 * De dónde salen los datos, en orden de prioridad:
 *   1. Los cambios hechos en el panel desde ESTE navegador (localStorage).
 *   2. `propiedades.json` publicado junto al sitio, si existe: así se publican
 *      cambios para todos sin backend (se exporta desde el panel y se sube).
 *   3. Las propiedades que trae el código (src/data/propiedades.ts).
 *
 * Los visitantes nunca escriben en localStorage: solo se guarda cuando alguien
 * edita desde el panel. Así una actualización publicada siempre les llega.
 */

const STORAGE_KEY = 'hs_inventario_v1';

export type PropertySortOption = 'recientes' | 'precio_desc' | 'precio_asc' | 'area_desc';

interface Guardado {
  seed: string;
  guardadoEn: string;
  propiedades: Property[];
}

export type Origen = 'codigo' | 'publicado' | 'local';

interface PropertyContextType {
  properties: Property[];
  publicProperties: Property[];
  filteredProperties: Property[];
  getProperty: (id: string) => Property | undefined;
  sectors: string[];
  filters: PropertyFilterState;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilterState>>;
  resetFilters: () => void;
  activeFilterCount: number;
  sortBy: PropertySortOption;
  setSortBy: (option: PropertySortOption) => void;
  compareIds: string[];
  toggleCompareProperty: (id: string) => void;
  clearCompare: () => void;
  addProperty: (property: Omit<Property, 'createdAt' | 'updatedAt'>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  duplicateProperty: (id: string) => Property | null;
  setPropertyStatus: (id: string, status: PropertyStatus) => void;
  toggleFeatured: (id: string) => void;
  replaceAll: (items: Property[]) => void;
  resetToPublished: () => void;
  origen: Origen;
  guardadoEn?: string;
  metrics: {
    total: number;
    disponibles: number;
    proximamente: number;
    reservadas: number;
    vendidas: number;
    arrendadas: number;
    ocultas: number;
    destacadas: number;
    sinFotos: number;
    valorEnVenta: number;
  };
}

export const defaultFilters: PropertyFilterState = {
  operation: 'Todas',
  propertyType: 'Todos',
  sector: '',
  priceRange: 'Todos',
  bedrooms: undefined,
  minArea: undefined,
  searchQuery: '',
};

const RANGOS: Record<Exclude<PriceRange, 'Todos'>, [number, number]> = {
  'hasta-1000': [0, 1_000_000_000],
  '1000-2000': [1_000_000_000, 2_000_000_000],
  '2000-4000': [2_000_000_000, 4_000_000_000],
  'mas-4000': [4_000_000_000, Number.POSITIVE_INFINITY],
};

function leerGuardado(): Guardado | null {
  try {
    const crudo = localStorage.getItem(STORAGE_KEY);
    if (!crudo) return null;
    const datos = JSON.parse(crudo) as Guardado;
    if (datos.seed !== SEED_VERSION || !Array.isArray(datos.propiedades)) return null;
    return datos;
  } catch {
    return null;
  }
}

export function esInventarioValido(datos: unknown): datos is Property[] {
  return (
    Array.isArray(datos) &&
    datos.every(
      (p) =>
        p &&
        typeof p === 'object' &&
        typeof (p as Property).id === 'string' &&
        typeof (p as Property).name === 'string' &&
        typeof (p as Property).specs === 'object'
    )
  );
}

export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const guardadoInicial = useRef(leerGuardado());
  const [properties, setProperties] = useState<Property[]>(
    () => guardadoInicial.current?.propiedades ?? INITIAL_PROPERTIES
  );
  const [origen, setOrigen] = useState<Origen>(guardadoInicial.current ? 'local' : 'codigo');
  const [guardadoEn, setGuardadoEn] = useState<string | undefined>(guardadoInicial.current?.guardadoEn);
  const [publicadas, setPublicadas] = useState<Property[] | null>(null);
  const editado = useRef(false);

  const [filters, setFilters] = useState<PropertyFilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState<PropertySortOption>('recientes');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Inventario publicado junto al sitio (opcional).
  useEffect(() => {
    let vivo = true;
    fetch('./propiedades.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((datos) => {
        const lista = Array.isArray(datos) ? datos : datos?.propiedades;
        if (!vivo || !esInventarioValido(lista)) return;
        setPublicadas(lista);
        if (!guardadoInicial.current) {
          setProperties(lista);
          setOrigen('publicado');
        }
      })
      .catch(() => undefined);
    return () => {
      vivo = false;
    };
  }, []);

  // Solo se persiste lo que se edita en el panel.
  useEffect(() => {
    if (!editado.current) return;
    const ahora = new Date().toISOString();
    try {
      const datos: Guardado = { seed: SEED_VERSION, guardadoEn: ahora, propiedades: properties };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
      setOrigen('local');
      setGuardadoEn(ahora);
    } catch (e) {
      console.error('No se pudo guardar el inventario en este navegador:', e);
    }
  }, [properties]);

  const mutar = useCallback((fn: (prev: Property[]) => Property[]) => {
    editado.current = true;
    setProperties(fn);
  }, []);

  const publicProperties = useMemo(() => properties.filter((p) => p.status !== 'Oculto'), [properties]);

  const getProperty = useCallback((id: string) => properties.find((p) => p.id === id), [properties]);

  const sectors = useMemo(() => {
    const presentes = Array.from(new Set(publicProperties.map((p) => p.sector).filter(Boolean)));
    return presentes.sort((a, b) => {
      const ia = ORDEN_ZONAS.indexOf(a);
      const ib = ORDEN_ZONAS.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b, 'es');
    });
  }, [publicProperties]);

  const filteredProperties = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    const lista = publicProperties.filter((p) => {
      if (filters.operation !== 'Todas' && p.operation !== filters.operation) return false;
      if (filters.propertyType !== 'Todos' && p.propertyType !== filters.propertyType) return false;
      if (filters.sector && p.sector !== filters.sector) return false;
      if (filters.priceRange !== 'Todos') {
        if (!p.price || p.priceOnRequest || p.operation === 'Arriendo') return false;
        const [min, max] = RANGOS[filters.priceRange];
        if (p.price < min || p.price >= max) return false;
      }
      if (filters.bedrooms !== undefined && (p.specs.bedrooms ?? 0) < filters.bedrooms) return false;
      if (filters.minArea !== undefined && (p.specs.builtArea ?? p.specs.plotArea ?? 0) < filters.minArea) return false;
      if (q) {
        const texto = `${p.name} ${p.sector} ${p.city} ${p.propertyType} ${p.headline} ${p.description}`.toLowerCase();
        if (!texto.includes(q)) return false;
      }
      return true;
    });

    const area = (p: Property) => p.specs.builtArea ?? p.specs.plotArea ?? 0;
    return [...lista].sort((a, b) => {
      if (sortBy === 'precio_desc') return (b.price ?? 0) - (a.price ?? 0);
      if (sortBy === 'precio_asc') return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (sortBy === 'area_desc') return area(b) - area(a);
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }, [publicProperties, filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.operation !== 'Todas') n++;
    if (filters.propertyType !== 'Todos') n++;
    if (filters.sector) n++;
    if (filters.priceRange !== 'Todos') n++;
    if (filters.bedrooms !== undefined) n++;
    if (filters.minArea !== undefined) n++;
    if (filters.searchQuery.trim()) n++;
    return n;
  }, [filters]);

  const metrics = useMemo(() => {
    const cuenta = (s: PropertyStatus) => properties.filter((p) => p.status === s).length;
    return {
      total: properties.length,
      disponibles: cuenta('Disponible'),
      proximamente: cuenta('Próximamente'),
      reservadas: cuenta('Reservado'),
      vendidas: cuenta('Vendido'),
      arrendadas: cuenta('Arrendado'),
      ocultas: cuenta('Oculto'),
      destacadas: properties.filter((p) => p.featured && p.status !== 'Oculto').length,
      sinFotos: properties.filter((p) => p.images.length === 0).length,
      valorEnVenta: properties
        .filter((p) => p.status === 'Disponible' && p.operation === 'Venta' && !p.priceOnRequest)
        .reduce((suma, p) => suma + (p.price ?? 0), 0),
    };
  }, [properties]);

  const idUnico = useCallback(
    (base: string) => {
      const raiz = slugify(base) || 'propiedad';
      let id = raiz;
      let i = 2;
      while (properties.some((p) => p.id === id)) id = `${raiz}-${i++}`;
      return id;
    },
    [properties]
  );

  const addProperty = (data: Omit<Property, 'createdAt' | 'updatedAt'>): Property => {
    const ahora = new Date().toISOString();
    const nueva: Property = { ...data, id: idUnico(data.id || data.name), createdAt: ahora, updatedAt: ahora };
    mutar((prev) => [nueva, ...prev]);
    return nueva;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    mutar((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, id, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProperty = (id: string) => {
    mutar((prev) => prev.filter((p) => p.id !== id));
    setCompareIds((prev) => prev.filter((x) => x !== id));
  };

  const duplicateProperty = (id: string): Property | null => {
    const original = properties.find((p) => p.id === id);
    if (!original) return null;
    const ahora = new Date().toISOString();
    const copia: Property = {
      ...original,
      id: idUnico(`${original.id}-copia`),
      name: `${original.name} (COPIA)`,
      status: 'Oculto',
      featured: false,
      createdAt: ahora,
      updatedAt: ahora,
    };
    mutar((prev) => [copia, ...prev]);
    return copia;
  };

  const setPropertyStatus = (id: string, status: PropertyStatus) => updateProperty(id, { status });

  const toggleFeatured = (id: string) => {
    const p = properties.find((x) => x.id === id);
    if (p) updateProperty(id, { featured: !p.featured });
  };

  const replaceAll = (items: Property[]) => mutar(() => items);

  const resetToPublished = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* sin almacenamiento disponible */
    }
    editado.current = false;
    setProperties(publicadas ?? INITIAL_PROPERTIES);
    setOrigen(publicadas ? 'publicado' : 'codigo');
    setGuardadoEn(undefined);
    setCompareIds([]);
  };

  const toggleCompareProperty = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        publicProperties,
        filteredProperties,
        getProperty,
        sectors,
        filters,
        setFilters,
        resetFilters: () => setFilters(defaultFilters),
        activeFilterCount,
        sortBy,
        setSortBy,
        compareIds,
        toggleCompareProperty,
        clearCompare: () => setCompareIds([]),
        addProperty,
        updateProperty,
        deleteProperty,
        duplicateProperty,
        setPropertyStatus,
        toggleFeatured,
        replaceAll,
        resetToPublished,
        origen,
        guardadoEn,
        metrics,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) throw new Error('useProperties debe usarse dentro de PropertyProvider');
  return context;
};
