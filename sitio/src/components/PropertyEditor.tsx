import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, Check, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';
import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type LocationPrecision,
  type Property,
  type PropertyOperation,
  type PropertySpecs,
  type PropertyStatus,
  type PropertyType,
  type PropertyUnit,
} from '../types/property';
import { ZONAS } from '../data/zonas';
import { useProperties } from '../context/PropertyContext';
import { parseCaption, parseNumberCO } from '../utils/caption';
import { parseVideo } from '../utils/video';
import { formatCurrency } from '../utils/formatters';
import { InteractiveMap } from './InteractiveMap';
import { PropertyCover } from './PropertyCover';
import { VideoEmbed } from './VideoEmbed';

/**
 * Formulario de una propiedad, ordenado como la ficha que Hugo escribe en
 * Instagram. El primer bloque permite pegar el texto de la publicación y el
 * enlace del reel para llenar casi todo de una vez.
 */

type Datos = Omit<Property, 'createdAt' | 'updatedAt'>;

const ESPACIOS_SUGERIDOS = [
  'Sala',
  'Comedor',
  'Cocina concepto abierto',
  'Hall de TV',
  'Hall de estudio',
  'Terraza',
  'Balcón',
  'Zona BBQ',
  'Zona verde',
  'Zona de ropas',
  'Estudio',
  'Vestier',
];
const DOTACIONES_SUGERIDAS = [
  'Piscina',
  'Jacuzzi',
  'Turco',
  'Sauna',
  'Gimnasio',
  'Salón social',
  'Paneles solares',
  'Cancha',
  'Zona de juegos infantiles',
  'Seguridad 24 horas',
];

function vacia(): Datos {
  const hoy = new Date().toISOString().slice(0, 10);
  return {
    id: '',
    name: '',
    operation: 'Venta',
    propertyType: 'Casa',
    status: 'Disponible',
    featured: false,
    price: undefined,
    negotiable: true,
    currency: 'COP',
    country: 'Colombia',
    city: 'Bucaramanga',
    sector: 'Ruitoque Condominio',
    coordinates: ZONAS['Ruitoque Condominio'],
    locationPrecision: 'approximated',
    headline: '',
    description: '',
    spaces: [],
    amenities: [],
    specs: {},
    video: '',
    images: [],
    publishedAt: hoy,
  };
}

/* ----------------------------- controles ----------------------------- */

const Bloque: React.FC<{ paso: string; titulo: string; ayuda?: string; children: React.ReactNode }> = ({
  paso,
  titulo,
  ayuda,
  children,
}) => (
  <section className="rounded-[4px] border border-negro/10 bg-white p-6 sm:p-8">
    <p className="versalitas text-[9.5px] text-taupe">{paso}</p>
    <h2 className="mt-2 text-[17px] font-light uppercase tracking-[0.1em] text-negro">{titulo}</h2>
    {ayuda && <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-taupe">{ayuda}</p>}
    <div className="mt-6">{children}</div>
  </section>
);

const Campo: React.FC<{ etiqueta: string; children: React.ReactNode; className?: string; nota?: string }> = ({
  etiqueta,
  children,
  className = '',
  nota,
}) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-grafito">{etiqueta}</span>
    {children}
    {nota && <span className="mt-1 block text-[11px] text-taupe">{nota}</span>}
  </label>
);

const estiloCampo =
  'w-full rounded-[3px] border border-negro/12 bg-hueso/60 px-3.5 py-2.5 text-[14px] text-negro placeholder:text-piedra focus:border-negro focus:bg-white focus:outline-none';

const CampoNumero: React.FC<{
  valor?: number;
  alCambiar: (v?: number) => void;
  placeholder?: string;
  moneda?: boolean;
}> = ({ valor, alCambiar, placeholder, moneda }) => {
  const [texto, setTexto] = useState(() =>
    valor === undefined ? '' : moneda ? Math.round(valor).toLocaleString('es-CO') : String(valor).replace('.', ',')
  );
  return (
    <div className="relative">
      {moneda && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-taupe">$</span>}
      <input
        inputMode="decimal"
        value={texto}
        placeholder={placeholder}
        onChange={(e) => {
          const crudo = e.target.value;
          const n = parseNumberCO(crudo);
          setTexto(moneda && n !== undefined ? Math.round(n).toLocaleString('es-CO') : crudo);
          alCambiar(n);
        }}
        className={`${estiloCampo} tabular-nums ${moneda ? 'pl-7' : ''}`}
      />
    </div>
  );
};

const Casilla: React.FC<{ marcada: boolean; alCambiar: (v: boolean) => void; children: React.ReactNode }> = ({
  marcada,
  alCambiar,
  children,
}) => (
  <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-grafito">
    <span
      className={`flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border transition-colors ${
        marcada ? 'border-negro bg-negro text-hueso' : 'border-negro/25 bg-white'
      }`}
    >
      {marcada && <Check className="h-3 w-3" />}
    </span>
    <input type="checkbox" className="sr-only" checked={marcada} onChange={(e) => alCambiar(e.target.checked)} />
    {children}
  </label>
);

const EditorChips: React.FC<{ items: string[]; alCambiar: (items: string[]) => void; sugeridos: string[]; placeholder: string }> = ({
  items,
  alCambiar,
  sugeridos,
  placeholder,
}) => {
  const [nuevo, setNuevo] = useState('');
  const agregar = (valor: string) => {
    const v = valor.trim();
    if (v && !items.includes(v)) alCambiar([...items, v]);
    setNuevo('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-negro px-3.5 py-1.5 text-[12px] text-hueso">
            {item}
            <button type="button" onClick={() => alCambiar(items.filter((i) => i !== item))} aria-label={`Quitar ${item}`}>
              <X className="h-3 w-3 opacity-70 hover:opacity-100" />
            </button>
          </span>
        ))}
        {!items.length && <span className="text-[12px] text-taupe">Sin elementos todavía.</span>}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              agregar(nuevo);
            }
          }}
          placeholder={placeholder}
          className={estiloCampo}
        />
        <button type="button" onClick={() => agregar(nuevo)} className="rounded-[3px] bg-negro px-4 text-hueso" aria-label="Agregar">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {sugeridos
          .filter((s) => !items.includes(s))
          .map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => agregar(s)}
              className="rounded-full border border-negro/12 px-3 py-1 text-[11px] text-taupe hover:border-negro/40 hover:text-negro"
            >
              + {s}
            </button>
          ))}
      </div>
    </div>
  );
};

/* ------------------------------ editor ------------------------------ */

export const PropertyEditor: React.FC<{
  initialProperty: Property | null;
  onSave: (datos: Datos) => void;
  onCancel: () => void;
}> = ({ initialProperty, onSave, onCancel }) => {
  const { properties } = useProperties();
  const [d, setD] = useState<Datos>(() => (initialProperty ? { ...initialProperty } : vacia()));
  const [texto, setTexto] = useState('');
  const [importado, setImportado] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nuevaFoto, setNuevaFoto] = useState('');
  const [version, setVersion] = useState(0); // fuerza a recrear los campos numéricos tras importar

  const fijar = <K extends keyof Datos>(clave: K, valor: Datos[K]) => setD((prev) => ({ ...prev, [clave]: valor }));
  const fijarSpec = <K extends keyof PropertySpecs>(clave: K, valor: PropertySpecs[K]) =>
    setD((prev) => ({ ...prev, specs: { ...prev.specs, [clave]: valor } }));

  const zonas = useMemo(
    () => Array.from(new Set([...Object.keys(ZONAS), ...properties.map((p) => p.sector)])).sort((a, b) => a.localeCompare(b, 'es')),
    [properties]
  );
  const video = parseVideo(d.video);

  const llenarDesdeInstagram = () => {
    const r = parseCaption(texto);
    setD((prev) => ({
      ...prev,
      name: r.name ?? prev.name,
      city: r.city ?? prev.city,
      sector: r.sector ?? prev.sector,
      coordinates: r.sector && ZONAS[r.sector] ? ZONAS[r.sector] : prev.coordinates,
      operation: r.operation ?? prev.operation,
      propertyType: r.propertyType ?? prev.propertyType,
      price: r.price ?? prev.price,
      negotiable: r.negotiable ?? prev.negotiable,
      adminFee: r.adminFee ?? prev.adminFee,
      adminIncluded: r.adminIncluded ?? prev.adminIncluded,
      headline: r.headline ?? prev.headline,
      spaces: r.spaces.length ? r.spaces : prev.spaces,
      amenities: r.amenities.length ? r.amenities : prev.amenities,
      specs: { ...prev.specs, ...Object.fromEntries(Object.entries(r.specs).filter(([, v]) => v !== undefined)) },
      video: r.video ?? prev.video,
      description: prev.description || texto
        .split(/\r?\n/)
        .filter((l) => !/3008905794|#|coordina tu visita/i.test(l))
        .join('\n')
        .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
        .trim(),
    }));
    setImportado(r.found);
    setVersion((v) => v + 1);
  };

  const guardar = () => {
    if (!d.name.trim()) return setError('Escribe el nombre de la propiedad.');
    if (!d.priceOnRequest && !d.price) return setError('Escribe el precio o marca «Precio a consultar».');
    if (!d.sector.trim()) return setError('Escribe la zona.');
    setError(null);
    onSave({
      ...d,
      id: initialProperty?.id ?? d.id,
      name: d.name.trim().toUpperCase(),
      headline: d.headline.trim() || `${d.propertyType} en ${d.operation.toLowerCase()} en ${d.sector}.`,
      description: d.description.trim(),
      video: d.video?.trim() || undefined,
    });
  };

  const cambiarUnidad = (i: number, cambio: Partial<PropertyUnit>) =>
    fijar(
      'units',
      (d.units ?? []).map((u, j) => (j === i ? { ...u, ...cambio } : u))
    );

  return (
    <div className="min-h-screen bg-hueso pb-24">
      <header className="sticky top-0 z-30 border-b border-negro/10 bg-hueso/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-taupe hover:text-negro"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>
          <p className="hidden truncate text-[12px] font-semibold uppercase tracking-[0.14em] sm:block">
            {initialProperty ? `Editar: ${initialProperty.name}` : 'Nueva propiedad'}
          </p>
          <button
            type="button"
            onClick={guardar}
            className="inline-flex items-center gap-2 rounded-full bg-negro px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-hueso hover:bg-grafito"
          >
            <Save className="h-4 w-4" /> {initialProperty ? 'Guardar' : 'Publicar'}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-[3px] border border-[#e3c2b8] bg-[#f8ece8] p-3 text-[13px] text-[#8a3b28]">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <Bloque
            paso="Atajo"
            titulo="Importar desde Instagram"
            ayuda="Pega el texto de la publicación tal como está en Instagram (con los checks) y el enlace del reel. La ficha se llena sola; después revisa cada campo."
          >
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={7}
              placeholder={'CONJUNTO MANSIÓN DEL LAGO\n(Bucaramanga/Lagos del cacique)\n✅Área de lote 230 m2\n✅Habitaciones 4 (incluyen servicio)\n✅Valor de venta $1.450.000.000 (negociables)\nhttps://www.instagram.com/reel/…'}
              className={`${estiloCampo} font-mono text-[12.5px]`}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={llenarDesdeInstagram}
                disabled={!texto.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-negro px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-hueso disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" /> Llenar la ficha
              </button>
              {importado && (
                <span className="text-[12px] text-taupe">
                  {importado.length ? `Se encontró: ${importado.join(', ')}.` : 'No se reconocieron datos; revisa el texto.'}
                </span>
              )}
            </div>
          </Bloque>

          <Bloque paso="Paso 1" titulo="Datos principales">
            <div className="grid gap-5 sm:grid-cols-2">
              <Campo etiqueta="Nombre de la propiedad *" className="sm:col-span-2">
                <input
                  value={d.name}
                  onChange={(e) => fijar('name', e.target.value)}
                  placeholder="Ej. CONJUNTO TERRAZAS DE MENZULY"
                  className={`${estiloCampo} uppercase`}
                />
              </Campo>
              <Campo etiqueta="Tipo de inmueble">
                <select value={d.propertyType} onChange={(e) => fijar('propertyType', e.target.value as PropertyType)} className={estiloCampo}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Campo>
              <Campo etiqueta="Operación">
                <select value={d.operation} onChange={(e) => fijar('operation', e.target.value as PropertyOperation)} className={estiloCampo}>
                  <option>Venta</option>
                  <option>Arriendo</option>
                </select>
              </Campo>
              <Campo etiqueta="Estado">
                <select value={d.status} onChange={(e) => fijar('status', e.target.value as PropertyStatus)} className={estiloCampo}>
                  {PROPERTY_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Campo>
              <Campo etiqueta="Fecha de publicación">
                <input type="date" value={d.publishedAt} onChange={(e) => fijar('publishedAt', e.target.value)} className={estiloCampo} />
              </Campo>
              <div className="sm:col-span-2">
                <Casilla marcada={!!d.featured} alCambiar={(v) => fijar('featured', v)}>
                  Destacar en el inicio
                </Casilla>
              </div>
            </div>
          </Bloque>

          <Bloque paso="Paso 2" titulo="Precio">
            <div className="grid gap-5 sm:grid-cols-2" key={`precio-${version}`}>
              <Campo
                etiqueta={d.operation === 'Arriendo' ? 'Canon mensual (COP)' : 'Valor de venta (COP)'}
                nota={d.price ? formatCurrency(d.price) : undefined}
              >
                <CampoNumero moneda valor={d.price} alCambiar={(v) => fijar('price', v)} placeholder="1.450.000.000" />
              </Campo>
              <Campo etiqueta="Valor de la administración (COP)" nota="Mensual. Déjalo vacío si no aplica.">
                <CampoNumero moneda valor={d.adminFee} alCambiar={(v) => fijar('adminFee', v)} placeholder="900.000" />
              </Campo>
              <div className="flex flex-wrap gap-x-7 gap-y-3 sm:col-span-2">
                <Casilla marcada={!!d.negotiable} alCambiar={(v) => fijar('negotiable', v)}>
                  Negociable
                </Casilla>
                <Casilla marcada={!!d.priceIsFrom} alCambiar={(v) => fijar('priceIsFrom', v)}>
                  Precio «desde»
                </Casilla>
                <Casilla marcada={!!d.priceOnRequest} alCambiar={(v) => fijar('priceOnRequest', v)}>
                  Precio a consultar (no mostrarlo)
                </Casilla>
                {d.operation === 'Arriendo' && (
                  <Casilla marcada={!!d.adminIncluded} alCambiar={(v) => fijar('adminIncluded', v)}>
                    Incluye administración
                  </Casilla>
                )}
              </div>
            </div>
          </Bloque>

          <Bloque paso="Paso 3" titulo="Ficha técnica" ayuda="Igual que en sus publicaciones. Los campos vacíos no se muestran en la página.">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3" key={`ficha-${version}`}>
              <Campo etiqueta="Área construida / total (m²)">
                <CampoNumero valor={d.specs.builtArea} alCambiar={(v) => fijarSpec('builtArea', v)} />
              </Campo>
              <Campo etiqueta="Área privada (m²)">
                <CampoNumero valor={d.specs.privateArea} alCambiar={(v) => fijarSpec('privateArea', v)} />
              </Campo>
              <Campo etiqueta="Área de lote (m²)">
                <CampoNumero valor={d.specs.plotArea} alCambiar={(v) => fijarSpec('plotArea', v)} />
              </Campo>
              <Campo etiqueta="Habitaciones">
                <CampoNumero valor={d.specs.bedrooms} alCambiar={(v) => fijarSpec('bedrooms', v)} />
              </Campo>
              <Campo etiqueta="Baños">
                <CampoNumero valor={d.specs.bathrooms} alCambiar={(v) => fijarSpec('bathrooms', v)} />
              </Campo>
              <Campo etiqueta="Parqueaderos">
                <CampoNumero valor={d.specs.parkingSpots} alCambiar={(v) => fijarSpec('parkingSpots', v)} />
              </Campo>
              <Campo etiqueta="Depósitos">
                <CampoNumero valor={d.specs.storageRooms} alCambiar={(v) => fijarSpec('storageRooms', v)} />
              </Campo>
              <Campo etiqueta="Niveles">
                <CampoNumero valor={d.specs.floors} alCambiar={(v) => fijarSpec('floors', v)} />
              </Campo>
              <Campo etiqueta="Estrato">
                <CampoNumero valor={d.specs.stratum} alCambiar={(v) => fijarSpec('stratum', v)} />
              </Campo>
              <div className="col-span-2 sm:col-span-3">
                <Casilla marcada={!!d.specs.includesServiceRoom} alCambiar={(v) => fijarSpec('includesServiceRoom', v)}>
                  Las habitaciones incluyen la de servicio
                </Casilla>
              </div>
            </div>
          </Bloque>

          <Bloque paso="Paso 4" titulo="Espacios y zonas comunes">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-grafito">Espacios</p>
                <EditorChips items={d.spaces} alCambiar={(v) => fijar('spaces', v)} sugeridos={ESPACIOS_SUGERIDOS} placeholder="Ej. Cocina en isla" />
              </div>
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-grafito">Zonas comunes y dotaciones</p>
                <EditorChips
                  items={d.amenities}
                  alCambiar={(v) => fijar('amenities', v)}
                  sugeridos={DOTACIONES_SUGERIDAS}
                  placeholder="Ej. Piscina con borde infinito"
                />
              </div>
            </div>
          </Bloque>

          <Bloque
            paso="Paso 5"
            titulo="Recorrido en video"
            ayuda="Pega el enlace del reel de Instagram (también sirve YouTube o un archivo .mp4). Es lo primero que ve el cliente en la ficha."
          >
            <input
              value={d.video ?? ''}
              onChange={(e) => fijar('video', e.target.value)}
              placeholder="https://www.instagram.com/reel/…"
              className={estiloCampo}
            />
            <p className="mt-2 text-[12px] text-taupe">
              {!d.video
                ? 'Sin video: la ficha mostrará la portada tipográfica.'
                : video
                  ? `Reconocido: ${video.kind === 'instagram' ? `reel de Instagram (${video.code})` : video.kind === 'youtube' ? 'video de YouTube' : 'archivo de video'}.`
                  : 'No se reconoce el enlace. Usa el enlace del reel, de YouTube o de un .mp4.'}
            </p>
            {video && (
              <div className="mt-6 max-w-[300px]">
                <VideoEmbed key={d.video} url={d.video} title={d.name || 'Vista previa'} carga="clic" />
              </div>
            )}
          </Bloque>

          <Bloque paso="Paso 6" titulo="Textos">
            <div className="space-y-5">
              <Campo etiqueta="Frase de apertura" nota="Una frase con su voz. Ej. «Esta cabaña en Ruitoque Condominio es perfecta para ti».">
                <input value={d.headline} onChange={(e) => fijar('headline', e.target.value)} className={estiloCampo} />
              </Campo>
              <Campo etiqueta="Descripción" nota="Separa los párrafos con una línea en blanco.">
                <textarea
                  value={d.description}
                  onChange={(e) => fijar('description', e.target.value)}
                  rows={6}
                  className={`${estiloCampo} leading-relaxed`}
                />
              </Campo>
            </div>
          </Bloque>

          <Bloque
            paso="Paso 7"
            titulo="Unidades (opcional)"
            ayuda="Para conjuntos con varias casas o apartamentos a la venta, como Green House."
          >
            <div className="space-y-3">
              {(d.units ?? []).map((u, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1fr_1.4fr_auto]">
                  <input value={u.name} onChange={(e) => cambiarUnidad(i, { name: e.target.value })} placeholder="Casa 1" className={estiloCampo} />
                  <CampoNumero valor={u.plotArea} alCambiar={(v) => cambiarUnidad(i, { plotArea: v })} placeholder="Lote m²" />
                  <CampoNumero valor={u.builtArea} alCambiar={(v) => cambiarUnidad(i, { builtArea: v })} placeholder="Construida m²" />
                  <CampoNumero moneda valor={u.price} alCambiar={(v) => cambiarUnidad(i, { price: v })} placeholder="Valor" />
                  <button
                    type="button"
                    onClick={() => fijar('units', (d.units ?? []).filter((_, j) => j !== i))}
                    className="flex items-center justify-center rounded-[3px] border border-negro/12 px-3 text-taupe hover:text-[#a2543f]"
                    aria-label="Quitar unidad"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fijar('units', [...(d.units ?? []), { name: `Casa ${(d.units?.length ?? 0) + 1}` }])}
                className="inline-flex items-center gap-2 rounded-full border border-negro/15 px-4 py-2.5 text-[11px] font-medium hover:border-negro/40"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar unidad
              </button>
            </div>
          </Bloque>

          <Bloque paso="Paso 8" titulo="Fotos (opcional)" ayuda="Enlaces a fotos de la propiedad. La primera se usa como portada; sin fotos se usa la portada tipográfica.">
            <div className="flex gap-2">
              <input
                value={nuevaFoto}
                onChange={(e) => setNuevaFoto(e.target.value)}
                placeholder="https://…/foto.jpg"
                className={estiloCampo}
              />
              <button
                type="button"
                onClick={() => {
                  if (nuevaFoto.trim()) fijar('images', [...d.images, nuevaFoto.trim()]);
                  setNuevaFoto('');
                }}
                className="rounded-[3px] bg-negro px-4 text-hueso"
                aria-label="Agregar foto"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {d.images.length > 0 && (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {d.images.map((img, i) => (
                  <li key={img + i} className="overflow-hidden rounded-[3px] border border-negro/10">
                    <img src={img} alt="" referrerPolicy="no-referrer" className="aspect-[4/3] w-full bg-arena object-cover" />
                    <div className="flex items-center justify-between px-2 py-1.5 text-taupe">
                      <span className="text-[10px]">{i === 0 ? 'Portada' : `Foto ${i + 1}`}</span>
                      <span className="flex">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => {
                            const l = [...d.images];
                            [l[i - 1], l[i]] = [l[i], l[i - 1]];
                            fijar('images', l);
                          }}
                          className="p-1 disabled:opacity-30"
                          aria-label="Mover antes"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={i === d.images.length - 1}
                          onClick={() => {
                            const l = [...d.images];
                            [l[i + 1], l[i]] = [l[i], l[i + 1]];
                            fijar('images', l);
                          }}
                          className="p-1 disabled:opacity-30"
                          aria-label="Mover después"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => fijar('images', d.images.filter((_, j) => j !== i))}
                          className="p-1 hover:text-[#a2543f]"
                          aria-label="Quitar foto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Bloque>

          <Bloque paso="Paso 9" titulo="Ubicación" ayuda="La zona aparece en la tarjeta y en los filtros. En el mapa público se muestra un círculo amplio, no la dirección.">
            <div className="grid gap-5 sm:grid-cols-3">
              <Campo etiqueta="Zona *">
                <input
                  list="zonas-hugo"
                  value={d.sector}
                  onChange={(e) => {
                    const sector = e.target.value;
                    setD((prev) => ({ ...prev, sector, coordinates: ZONAS[sector] ?? prev.coordinates }));
                  }}
                  className={estiloCampo}
                />
                <datalist id="zonas-hugo">
                  {zonas.map((z) => (
                    <option key={z} value={z} />
                  ))}
                </datalist>
              </Campo>
              <Campo etiqueta="Ciudad">
                <input value={d.city} onChange={(e) => fijar('city', e.target.value)} className={estiloCampo} />
              </Campo>
              <Campo etiqueta="Dirección (privada)" nota="Solo se ve en este panel.">
                <input value={d.address ?? ''} onChange={(e) => fijar('address', e.target.value)} className={estiloCampo} />
              </Campo>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              <Casilla
                marcada={!!d.coordinates}
                alCambiar={(v) => fijar('coordinates', v ? ZONAS[d.sector] ?? { lat: 7.1193, lng: -73.1227 } : undefined)}
              >
                Mostrar mapa en la ficha
              </Casilla>
              {d.coordinates && (
                <Casilla
                  marcada={d.locationPrecision === 'exact'}
                  alCambiar={(v) => fijar('locationPrecision', (v ? 'exact' : 'approximated') as LocationPrecision)}
                >
                  Mostrar el punto exacto (no recomendado)
                </Casilla>
              )}
            </div>

            {d.coordinates && (
              <div className="mt-6">
                <InteractiveMap
                  coordinates={d.coordinates}
                  locationPrecision={d.locationPrecision}
                  isEditable
                  onCoordinatesChange={(c) => fijar('coordinates', c)}
                  heightClass="h-[320px]"
                />
              </div>
            )}
          </Bloque>
        </div>

        {/* Vista previa */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="versalitas text-[9.5px] text-taupe">Vista previa de la portada</p>
          <div className="mt-3 aspect-[4/5] overflow-hidden rounded-[3px]">
            <PropertyCover
              property={{
                id: d.id || d.name || 'nueva',
                name: d.name.toUpperCase() || 'NOMBRE DE LA PROPIEDAD',
                propertyType: d.propertyType,
                sector: d.sector || 'Zona',
                images: d.images,
              }}
            />
          </div>
          <p className="mt-4 text-[15px] font-medium tabular-nums">
            {d.priceOnRequest ? 'Precio a consultar' : d.price ? `${d.priceIsFrom ? 'Desde ' : ''}${formatCurrency(d.price)}` : '—'}
          </p>
          <p className="mt-1 text-[11.5px] text-taupe">
            {[d.negotiable && 'Negociable', d.operation === 'Arriendo' && 'Canon mensual'].filter(Boolean).join(' · ')}
          </p>
          <button
            type="button"
            onClick={guardar}
            className="mt-6 hidden w-full items-center justify-center gap-2 rounded-full bg-negro py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-hueso lg:flex"
          >
            <Save className="h-4 w-4" /> {initialProperty ? 'Guardar cambios' : 'Publicar propiedad'}
          </button>
        </aside>
      </div>
    </div>
  );
};
