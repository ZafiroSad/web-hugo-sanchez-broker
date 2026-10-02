import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Columns3, FileDown, MapPin, Share2 } from 'lucide-react';
import type { Property } from '../types/property';
import { useProperties } from '../context/PropertyContext';
import {
  formatArea,
  formatCurrency,
  formatDate,
  formatPricePerSqm,
  priceLabel,
  propertyUrl,
  titleCase,
  visitMessage,
  whatsappUrl,
} from '../utils/formatters';
import { navigate } from '../utils/router';
import { CURVA, revelar } from '../utils/motion';
import { MapaPerezoso } from './MapaPerezoso';
import { PropertyCard } from './PropertyCard';
import { PropertyCover } from './PropertyCover';
import { PropertyDossierModal } from './PropertyDossierModal';
import { VideoEmbed } from './VideoEmbed';
import { InstagramIcon, WhatsAppIcon } from './marca';
import { MARCA } from '../config/marca';

const ESTADO_VISIBLE: Partial<Record<Property['status'], string>> = {
  Próximamente: 'Próximamente',
  Reservado: 'Reservada',
  Vendido: 'Vendida',
  Arrendado: 'Arrendada',
};

/** La ficha en el mismo orden en que Hugo la escribe. */
function filasFicha(p: Property): { etiqueta: string; valor: string }[] {
  const s = p.specs;
  const filas: { etiqueta: string; valor: string }[] = [];
  const esApto = ['Apartamento', 'Penthouse', 'Dúplex'].includes(p.propertyType);
  if (s.plotArea) filas.push({ etiqueta: 'Área de lote', valor: formatArea(s.plotArea) });
  if (s.builtArea) filas.push({ etiqueta: esApto ? 'Área total' : 'Área construida', valor: formatArea(s.builtArea) });
  if (s.privateArea) filas.push({ etiqueta: 'Área privada', valor: formatArea(s.privateArea) });
  if (s.bedrooms)
    filas.push({
      etiqueta: 'Habitaciones',
      valor: `${s.bedrooms}${s.includesServiceRoom ? ' (incluye servicio)' : ''}`,
    });
  if (s.bathrooms) filas.push({ etiqueta: 'Baños', valor: String(s.bathrooms) });
  if (s.parkingSpots) filas.push({ etiqueta: 'Parqueaderos', valor: String(s.parkingSpots) });
  if (s.storageRooms) filas.push({ etiqueta: 'Depósito', valor: String(s.storageRooms) });
  if (s.floors) filas.push({ etiqueta: 'Niveles', valor: String(s.floors) });
  if (s.stratum) filas.push({ etiqueta: 'Estrato', valor: String(s.stratum) });
  if (p.adminFee) filas.push({ etiqueta: 'Administración', valor: `${formatCurrency(p.adminFee)} / mes` });
  if (p.adminIncluded) filas.push({ etiqueta: 'Administración', valor: 'Incluida en el canon' });
  if (p.operation === 'Venta' && !p.priceOnRequest && !p.priceIsFrom && p.price && s.builtArea)
    filas.push({ etiqueta: 'Valor por m²', valor: formatPricePerSqm(p.price, s.builtArea) });
  return filas;
}

const Chips: React.FC<{ titulo: string; items: string[] }> = ({ titulo, items }) =>
  items.length ? (
    <motion.div {...revelar()} className="border-t border-negro/10 pt-8">
      <h2 className="versalitas text-[10px] text-taupe">{titulo}</h2>
      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-negro/12 bg-white/60 px-4 py-2 text-[12.5px] text-grafito"
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  ) : null;

export const PropertyDetail: React.FC<{ id: string }> = ({ id }) => {
  const { getProperty, publicProperties, compareIds, toggleCompareProperty } = useProperties();
  const property = getProperty(id);
  const [fichaAbierta, setFichaAbierta] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const relacionadas = useMemo(() => {
    if (!property) return [];
    const otras = publicProperties.filter((p) => p.id !== property.id && p.status !== 'Vendido');
    const mismaZona = otras.filter((p) => p.sector === property.sector);
    const resto = otras
      .filter((p) => p.sector !== property.sector)
      .sort((a, b) => Math.abs((a.price ?? 0) - (property.price ?? 0)) - Math.abs((b.price ?? 0) - (property.price ?? 0)));
    return [...mismaZona, ...resto].slice(0, 3);
  }, [property, publicProperties]);

  if (!property || property.status === 'Oculto') {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-hueso px-6 pt-24 text-center">
        <p className="versalitas text-[10px] text-taupe">Propiedad no disponible</p>
        <h1 className="mt-5 text-[clamp(1.6rem,3vw,2.4rem)] font-extralight uppercase tracking-[0.1em]">
          Esta propiedad ya no está publicada
        </h1>
        <p className="mt-4 max-w-md text-[14px] font-light text-grafito">
          Puede que se haya vendido. Escríbele a Hugo y te muestra opciones parecidas.
        </p>
        <button
          type="button"
          onClick={() => navigate('propiedades')}
          className="mt-8 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-hueso"
        >
          Ver propiedades disponibles
        </button>
      </div>
    );
  }

  const precio = priceLabel(property);
  const ficha = filasFicha(property);
  const comparando = compareIds.includes(property.id);
  const estado = ESTADO_VISIBLE[property.status];
  const enlaceVisita = whatsappUrl(visitMessage(property));
  const parrafos = property.description.split(/\n\n+/).filter((p) => p.trim());

  const compartir = async () => {
    const url = propertyUrl(property.id);
    const datos = { title: `${titleCase(property.name)} · Hugo Sánchez`, text: property.headline, url };
    try {
      if (navigator.share) {
        await navigator.share(datos);
        return;
      }
    } catch {
      /* el usuario canceló */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt('Copia el enlace de la propiedad:', url);
    }
  };

  return (
    <article className="bg-hueso pb-32 pt-[96px] sm:pt-[104px]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <button
          type="button"
          onClick={() => navigate('propiedades')}
          className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-taupe transition-colors hover:text-negro"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-500 ease-ios group-hover:-translate-x-1" />
          Propiedades
        </button>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Video del recorrido */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: CURVA.ios }}
          >
            <div className="mx-auto max-w-[400px] lg:sticky lg:top-28">
              {property.video ? (
                <>
                  <p className="versalitas mb-4 text-center text-[9.5px] text-taupe lg:text-left">Recorrido en video</p>
                  <VideoEmbed url={property.video} title={titleCase(property.name)} carga="auto" />
                </>
              ) : (
                <div className="aspect-[4/5] overflow-hidden rounded-[3px]">
                  <PropertyCover property={property} size="hero" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Información */}
          <div className="space-y-10 lg:col-span-7">
            <motion.header
              initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: CURVA.ios, delay: 0.08 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="versalitas text-[10px] text-taupe">
                  {property.operation} · {property.propertyType}
                </span>
                {estado && (
                  <span className="rounded-full bg-negro px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-hueso">
                    {estado}
                  </span>
                )}
              </div>
              <h1 className="mt-5 font-extralight uppercase leading-[1.14] tracking-[0.11em] text-[clamp(1.9rem,3.6vw,3.1rem)] text-negro">
                {property.name}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-[13px] text-taupe">
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                {property.sector}
                {property.sector !== property.city ? `, ${property.city}` : ''}
              </p>
              <p className="mt-6 max-w-2xl text-[18px] font-light leading-relaxed text-grafito">{property.headline}</p>
            </motion.header>

            {/* Precio y acciones */}
            <motion.div
              initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: CURVA.ios, delay: 0.16 }}
              className="border-y border-negro/10 py-8"
            >
              <p className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-light tabular-nums text-negro">{precio.principal}</p>
              {precio.detalle && <p className="versalitas mt-2 text-[10px] text-bronce">{precio.detalle}</p>}

              <div className="mt-8 flex flex-wrap gap-2.5">
                <a
                  href={enlaceVisita}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-hueso transition-colors hover:bg-grafito"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Coordina tu visita
                </a>
                <button
                  type="button"
                  onClick={compartir}
                  className="inline-flex items-center gap-2 rounded-full border border-negro/15 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-negro transition-colors hover:bg-negro/[0.04]"
                >
                  <Share2 className="h-3.5 w-3.5" /> {copiado ? 'Enlace copiado' : 'Compartir'}
                </button>
                <button
                  type="button"
                  onClick={() => setFichaAbierta(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-negro/15 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-negro transition-colors hover:bg-negro/[0.04]"
                >
                  <FileDown className="h-3.5 w-3.5" /> Ficha PDF
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompareProperty(property.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    comparando ? 'border-negro bg-negro text-hueso' : 'border-negro/15 text-negro hover:bg-negro/[0.04]'
                  }`}
                >
                  {comparando ? <Check className="h-3.5 w-3.5" /> : <Columns3 className="h-3.5 w-3.5" />}
                  {comparando ? 'Comparando' : 'Comparar'}
                </button>
              </div>
            </motion.div>

            {/* Ficha técnica */}
            {ficha.length > 0 && (
              <motion.section {...revelar()}>
                <h2 className="versalitas text-[10px] text-taupe">Ficha técnica</h2>
                <dl className="mt-6 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
                  {ficha.map((fila) => (
                    <div key={fila.etiqueta + fila.valor} className="border-t border-negro/10 py-4">
                      <dt className="text-[10.5px] uppercase tracking-[0.16em] text-taupe">{fila.etiqueta}</dt>
                      <dd className="mt-1.5 text-[15px] font-medium tabular-nums text-negro">{fila.valor}</dd>
                    </div>
                  ))}
                </dl>
              </motion.section>
            )}

            {/* Unidades (conjuntos con varias casas) */}
            {property.units && property.units.length > 0 && (
              <motion.section {...revelar()} className="border-t border-negro/10 pt-8">
                <h2 className="versalitas text-[10px] text-taupe">{property.units.length} unidades a la venta</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[460px] text-left text-[13.5px]">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-[0.16em] text-taupe">
                        <th className="py-3 pr-4 font-medium">Unidad</th>
                        <th className="py-3 pr-4 font-medium">Área de lote</th>
                        <th className="py-3 pr-4 font-medium">Área construida</th>
                        <th className="py-3 text-right font-medium">Valor de venta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.units.map((u) => (
                        <tr key={u.name} className="border-t border-negro/10 tabular-nums text-grafito">
                          <td className="py-3.5 pr-4 font-medium text-negro">{u.name}</td>
                          <td className="py-3.5 pr-4">{formatArea(u.plotArea)}</td>
                          <td className="py-3.5 pr-4">{formatArea(u.builtArea)}</td>
                          <td className="py-3.5 text-right font-medium text-negro">{formatCurrency(u.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            )}

            <Chips titulo="Espacios" items={property.spaces} />
            <Chips titulo="Zonas comunes y dotaciones" items={property.amenities} />

            {/* Descripción */}
            {parrafos.length > 0 && (
              <motion.section {...revelar()} className="border-t border-negro/10 pt-8">
                <h2 className="versalitas text-[10px] text-taupe">En palabras de Hugo</h2>
                <div className="mt-5 max-w-2xl space-y-4 text-[15.5px] font-light leading-[1.8] text-grafito">
                  {parrafos.map((parrafo) => (
                    <p key={parrafo.slice(0, 24)}>{parrafo}</p>
                  ))}
                </div>
                <p className="mt-6 text-[11px] text-taupe">Publicada el {formatDate(property.publishedAt)}</p>
              </motion.section>
            )}

            {/* Ubicación */}
            {property.coordinates && (
              <motion.section {...revelar()} className="border-t border-negro/10 pt-8">
                <h2 className="versalitas text-[10px] text-taupe">Ubicación</h2>
                <div className="mt-5">
                  <MapaPerezoso
                    coordinates={property.coordinates}
                    locationPrecision={property.locationPrecision}
                    sector={property.sector}
                    city={property.city}
                  />
                </div>
              </motion.section>
            )}

            {/* Cierre */}
            <motion.section {...revelar()} className="rounded-[3px] bg-negro p-8 text-hueso sm:p-10">
              <p className="font-script text-[clamp(1.7rem,3vw,2.4rem)] leading-tight text-arena">
                {MARCA.slogan}
              </p>
              <p className="mt-4 max-w-lg text-[14px] font-light leading-relaxed text-piedra">
                Escríbele a Hugo para coordinar tu visita a {titleCase(property.name)}. Te responde directamente por
                WhatsApp.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={enlaceVisita}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-negro transition-colors hover:bg-hueso"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Coordina tu visita
                </a>
                <a
                  href={MARCA.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-hueso transition-colors hover:bg-white/10"
                >
                  <InstagramIcon className="h-3.5 w-3.5" /> Más en Instagram
                </a>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Relacionadas */}
        {relacionadas.length > 0 && (
          <section className="mt-28 border-t border-negro/10 pt-16">
            <motion.h2
              {...revelar()}
              className="font-extralight uppercase tracking-[0.1em] text-[clamp(1.5rem,2.6vw,2.2rem)] text-negro"
            >
              También te pueden interesar
            </motion.h2>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {relacionadas.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Barra fija en el teléfono */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-negro/10 bg-hueso/95 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-[9.5px] font-semibold uppercase tracking-[0.18em] text-taupe">{property.name}</p>
          <p className="truncate text-[15px] font-medium tabular-nums text-negro">{precio.principal}</p>
        </div>
        <a
          href={enlaceVisita}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-negro px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-hueso"
        >
          <WhatsAppIcon className="h-4 w-4" /> Coordina tu visita
        </a>
      </div>

      <PropertyDossierModal property={property} isOpen={fichaAbierta} onClose={() => setFichaAbierta(false)} />
    </article>
  );
};
