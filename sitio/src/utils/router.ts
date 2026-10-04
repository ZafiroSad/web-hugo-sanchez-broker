import { useEffect, useState } from 'react';

/**
 * Rutas con hash (#/…): GitHub Pages no reescribe direcciones, y así cada
 * propiedad tiene un enlace propio que se puede mandar por WhatsApp.
 *
 *   #/                       la puerta de entrada
 *   #/inicio                 el menú de inicio (#/inicio/propiedades/<categoría> baja a
 *                            Destacadas con esa pestaña abierta)
 *   #/hugo, #/inversion,     los capítulos, cada uno en su página. Las direcciones viejas
 *   #/vendidas, #/vender     (#/inicio/sobre, #/inicio/vender…) llevan a su capítulo
 *   #/propiedades[/<cat>]    el catálogo, entero o de una categoría (casas, apartamentos…)
 *   #/propiedad/<id>         la ficha de una propiedad
 *   #/admin                  el panel de administración
 */
export const CAPITULOS_RUTA = ['hugo', 'inversion', 'vendidas', 'vender'] as const;
export type CapituloId = (typeof CAPITULOS_RUTA)[number];

/** Las secciones que antes vivían en el inicio y ahora son capítulos. */
const SECCION_A_CAPITULO: Record<string, CapituloId> = {
  sobre: 'hugo',
  inversion: 'inversion',
  vendidas: 'vendidas',
  vender: 'vender',
};

const esCapitulo = (valor: string): valor is CapituloId => (CAPITULOS_RUTA as readonly string[]).includes(valor);

export type Route =
  | { name: 'intro' }
  | { name: 'inicio'; section?: string; filtro?: string }
  | { name: 'propiedades'; categoria?: string }
  | { name: 'capitulo'; id: CapituloId }
  | { name: 'propiedad'; id: string }
  | { name: 'admin' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/^\/+/, '');
  const [primero, segundo, tercero] = path.split('/');
  switch (primero) {
    case '':
      return { name: 'intro' };
    case 'inicio': {
      const capitulo = segundo ? SECCION_A_CAPITULO[segundo] : undefined;
      if (capitulo) return { name: 'capitulo', id: capitulo };
      return { name: 'inicio', section: segundo || undefined, filtro: tercero || undefined };
    }
    case 'propiedades':
      return { name: 'propiedades', categoria: segundo || undefined };
    case 'propiedad':
      return segundo ? { name: 'propiedad', id: decodeURIComponent(segundo) } : { name: 'propiedades' };
    case 'admin':
      return { name: 'admin' };
    default:
      return esCapitulo(primero) ? { name: 'capitulo', id: primero } : { name: 'inicio' };
  }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const alCambiar = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);
  return route;
}

export function navigate(path: string) {
  const destino = `#/${path.replace(/^#?\/*/, '')}`;
  if (window.location.hash === destino) {
    // Misma ruta (por ejemplo, volver a pulsar una sección): se fuerza el aviso.
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = destino;
  }
}
