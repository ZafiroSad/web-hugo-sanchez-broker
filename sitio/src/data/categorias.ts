import type { Property, PropertyType } from '../types/property';

/**
 * Cómo se agrupa el inventario: la baldosa de propiedades del inicio, las
 * pestañas del catálogo (#/propiedades/<categoría>) y las de «Propiedades
 * destacadas». Una categoría sin propiedades no aparece en ninguna.
 */
export const CATEGORIAS = [
  { id: 'casas', nombre: 'Casas', tipos: ['Casa', 'Casa campestre', 'Cabaña'] },
  { id: 'apartamentos', nombre: 'Apartamentos', tipos: ['Apartamento', 'Penthouse', 'Dúplex'] },
  { id: 'lotes', nombre: 'Lotes y fincas', tipos: ['Lote', 'Finca'] },
  { id: 'comerciales', nombre: 'Comerciales', tipos: ['Bodega', 'Oficina', 'Local'] },
  { id: 'proyectos', nombre: 'Proyectos', tipos: ['Proyecto'] },
] as const satisfies readonly { id: string; nombre: string; tipos: readonly PropertyType[] }[];

export type CategoriaId = (typeof CATEGORIAS)[number]['id'];

export function esCategoria(valor: string | undefined): valor is CategoriaId {
  return CATEGORIAS.some((c) => c.id === valor);
}

/**
 * El orden de «Propiedades destacadas»: primero las marcadas como destacadas y
 * luego las demás, de la más reciente a la más antigua. Las historias del
 * inicio siguen el mismo orden.
 */
export function ordenarDestacadas(lista: Property[]): Property[] {
  const recientes = [...lista].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return [...recientes.filter((p) => p.featured), ...recientes.filter((p) => !p.featured)];
}

export function enCategoria(property: Property, id: CategoriaId): boolean {
  const categoria = CATEGORIAS.find((c) => c.id === id);
  return Boolean(categoria && (categoria.tipos as readonly PropertyType[]).includes(property.propertyType));
}
