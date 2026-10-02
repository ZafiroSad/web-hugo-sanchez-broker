import { useEffect, useState } from 'react';

/**
 * Rutas con hash (#/…): GitHub Pages no reescribe direcciones, y así cada
 * propiedad tiene un enlace propio que se puede mandar por WhatsApp.
 *
 *   #/                    la intro animada
 *   #/inicio              la vista principal (con #/inicio/<sección> baja a esa sección)
 *   #/propiedades         el catálogo
 *   #/propiedad/<id>      la ficha de una propiedad
 *   #/admin               el panel de administración
 */
export type Route =
  | { name: 'intro' }
  | { name: 'inicio'; section?: string }
  | { name: 'propiedades' }
  | { name: 'propiedad'; id: string }
  | { name: 'admin' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/^\/+/, '');
  const [primero, segundo] = path.split('/');
  switch (primero) {
    case '':
      return { name: 'intro' };
    case 'inicio':
      return { name: 'inicio', section: segundo || undefined };
    case 'propiedades':
      return { name: 'propiedades' };
    case 'propiedad':
      return segundo ? { name: 'propiedad', id: decodeURIComponent(segundo) } : { name: 'propiedades' };
    case 'admin':
      return { name: 'admin' };
    default:
      return { name: 'inicio' };
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
