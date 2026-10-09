import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Link2, Printer, Share2, X } from 'lucide-react';
import type { Property } from '../types/property';
import { MARCA } from '../config/marca';
import { formatArea, formatCurrency, priceLabel, propertyUrl, specsLine, titleCase, whatsappUrl } from '../utils/formatters';
import { PropertyCover } from './PropertyCover';
import { WhatsAppIcon } from './marca';

/**
 * Ficha de la propiedad, como un recibo: se lee en pantalla, se imprime o se
 * guarda en PDF, y se comparte. En el teléfono ocupa toda la pantalla con la
 * barra de acciones fija arriba; en el computador es una hoja centrada.
 * Al imprimir, las reglas de index.css ocultan todo lo demás de la página.
 *
 * Compartir manda el enlace de la ficha: el teléfono abre su menú de compartir
 * (WhatsApp, correo…); en el computador, WhatsApp o copiar el enlace.
 */
export const PropertyDossierModal: React.FC<{ property: Property; isOpen: boolean; onClose: () => void }> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [copiado, setCopiado] = useState(false);

  // Sin scroll de la página de fondo y con Escape para cerrar.
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const previo = html.style.overflow;
    html.style.overflow = 'hidden';
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', alTeclear);
    return () => {
      html.style.overflow = previo;
      window.removeEventListener('keydown', alTeclear);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const precio = priceLabel(property);
  const s = property.specs;
  const url = propertyUrl(property.id);
  const nombre = titleCase(property.name);
  const mensaje = `${nombre} · ${property.sector}\n${precio.principal}\n${url}`;
  const datos: [string, string][] = [
    ['Área de lote', formatArea(s.plotArea)],
    ['Área construida', formatArea(s.builtArea)],
    ['Habitaciones', s.bedrooms ? `${s.bedrooms}${s.includesServiceRoom ? ' (incl. servicio)' : ''}` : ''],
    ['Baños', s.bathrooms ? String(s.bathrooms) : ''],
    ['Parqueaderos', s.parkingSpots ? String(s.parkingSpots) : ''],
    ['Depósito', s.storageRooms ? String(s.storageRooms) : ''],
    ['Estrato', s.stratum ? String(s.stratum) : ''],
    ['Administración', property.adminFee ? formatCurrency(property.adminFee) : property.adminIncluded ? 'Incluida' : ''],
  ].filter(([, v]) => v) as [string, string][];

  const puedeCompartir = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const compartir = async () => {
    try {
      await navigator.share({ title: `${nombre} · Hugo Sánchez`, text: `${nombre} · ${property.sector} · ${precio.principal}`, url });
    } catch {
      /* canceló el menú de compartir */
    }
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt('Copia el enlace de la ficha:', url);
    }
  };

  const boton =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] transition-colors sm:px-4';

  // Se monta directo en <body>: dentro de la vista animada quedaría debajo de la barra del sitio.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ficha de ${nombre}`}
      className="ficha-capa fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-white sm:bg-black/70 sm:p-6 sm:backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="zona-impresion relative mx-auto min-h-full w-full bg-white sm:my-4 sm:min-h-0 sm:max-w-3xl sm:overflow-hidden sm:rounded-2xl sm:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de acciones: fija arriba mientras se recorre la ficha */}
        <div className="no-imprimir sticky top-0 z-10 flex items-center gap-2 border-b border-negro/10 bg-white/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur sm:px-5">
          <span className="versalitas mr-auto hidden text-[9.5px] text-taupe sm:inline">Ficha de la propiedad</span>
          {puedeCompartir ? (
            <button type="button" onClick={compartir} className={`${boton} bg-negro text-white`}>
              <Share2 className="h-3.5 w-3.5" /> Compartir
            </button>
          ) : (
            <>
              <a
                href={whatsappUrl(mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${boton} bg-negro text-white`}
              >
                <WhatsAppIcon className="h-3.5 w-3.5" /> Enviar
              </a>
              <button type="button" onClick={copiar} className={`${boton} border border-negro/15 text-negro hover:bg-stone-100`}>
                {copiado ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                {copiado ? (
                  'Copiado'
                ) : (
                  <span>
                    Copiar<span className="hidden sm:inline"> enlace</span>
                  </span>
                )}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className={`${boton} border border-negro/15 text-negro hover:bg-stone-100`}
            aria-label="Imprimir o guardar en PDF"
          >
            <Printer className="h-3.5 w-3.5" /> PDF
          </button>
          <button type="button" onClick={onClose} className="ml-auto p-2 text-taupe hover:text-negro sm:ml-0" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-6 sm:space-y-7 sm:p-10">
          <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-negro pb-4">
            <div>
              <p className="text-[11px] font-light tracking-[0.3em] text-negro">HUGO SÁNCHEZ</p>
              <p className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.28em] text-taupe">Broker inmobiliario</p>
            </div>
            <p className="text-[10.5px] text-taupe sm:text-right">
              {MARCA.telefonoVisible} · @{MARCA.instagram.usuario}
            </p>
          </header>

          <div className="aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[16/7]">
            <PropertyCover property={property} size="hero" />
          </div>

          <div>
            <p className="versalitas text-[9.5px] leading-relaxed text-taupe">
              {property.operation} · {property.propertyType} · {property.sector}
            </p>
            <h1 className="mt-2 text-[24px] font-light uppercase leading-tight tracking-[0.02em] text-negro font-stretch-semi-expanded sm:text-[28px]">
              {property.name}
            </h1>
            {property.headline && <p className="mt-2 text-[14px] leading-relaxed text-grafito">{property.headline}</p>}
          </div>

          {/* Valor y datos: en el teléfono, el valor arriba y los datos en dos columnas con línea entre filas */}
          <div className="rounded-xl bg-hueso p-5 sm:grid sm:grid-cols-[1fr_2fr] sm:gap-8 sm:p-6">
            <div className="border-b border-negro/10 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
              <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Valor</p>
              <p className="mt-1 text-[24px] font-light tabular-nums text-negro">{precio.principal}</p>
              {precio.detalle && <p className="mt-1 text-[11px] text-bronce">{precio.detalle}</p>}
            </div>
            {datos.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-5 pt-2 sm:grid-cols-3 sm:gap-y-4 sm:pt-0">
                {datos.map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="border-b border-negro/[0.07] py-2.5 sm:border-0 sm:py-0">
                    <dt className="text-[9.5px] uppercase tracking-[0.12em] text-taupe">{etiqueta}</dt>
                    <dd className="mt-0.5 text-[14px] font-medium tabular-nums text-negro">{valor}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {property.units && property.units.length > 0 && (
            <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[420px] text-left text-[12.5px]">
                <thead>
                  <tr className="text-[9.5px] uppercase tracking-[0.14em] text-taupe">
                    <th className="py-2 pr-3">Unidad</th>
                    <th className="py-2 pr-3">Lote</th>
                    <th className="py-2 pr-3">Construida</th>
                    <th className="py-2 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {property.units.map((u) => (
                    <tr key={u.name} className="border-t border-negro/10 tabular-nums">
                      <td className="py-2 pr-3">{u.name}</td>
                      <td className="py-2 pr-3">{formatArea(u.plotArea)}</td>
                      <td className="py-2 pr-3">{formatArea(u.builtArea)}</td>
                      <td className="py-2 text-right">{formatCurrency(u.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(property.spaces.length > 0 || property.amenities.length > 0) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {property.spaces.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Espacios</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-grafito">{property.spaces.join(' · ')}</p>
                </div>
              )}
              {property.amenities.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Zonas comunes y dotaciones</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-grafito">{property.amenities.join(' · ')}</p>
                </div>
              )}
            </div>
          )}

          {property.description && (
            <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-grafito">{property.description}</p>
          )}

          <footer className="space-y-1.5 border-t border-negro/10 pt-5 text-[10.5px] text-taupe sm:flex sm:justify-between sm:gap-4 sm:space-y-0">
            <p>{specsLine(property)}</p>
            <p className="break-all">{url}</p>
          </footer>
          <p className="titular pb-[env(safe-area-inset-bottom)] text-center text-[16px] font-light text-negro">{MARCA.slogan}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
};
