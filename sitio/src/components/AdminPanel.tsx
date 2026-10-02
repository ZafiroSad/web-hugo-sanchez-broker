import React, { useMemo, useRef, useState } from 'react';
import {
  Copy,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Upload,
  Video,
  VideoOff,
} from 'lucide-react';
import { MARCA } from '../config/marca';
import { esInventarioValido, useProperties } from '../context/PropertyContext';
import { SEED_VERSION } from '../data/propiedades';
import { PROPERTY_STATUSES, type Property, type PropertyStatus } from '../types/property';
import { formatCurrency, formatDate, priceLabel } from '../utils/formatters';
import { navigate } from '../utils/router';
import { Logotipo } from './marca';
import { PropertyCover } from './PropertyCover';
import { PropertyEditor } from './PropertyEditor';

/**
 * Panel de Hugo. El sitio es estático (GitHub Pages), así que los cambios se
 * guardan en el navegador donde se hacen. Para publicarlos para todos se
 * exporta el inventario y se sube como `sitio/public/propiedades.json`.
 */

const CLAVE_SESION = 'hs_admin_sesion';

const COLOR_ESTADO: Record<PropertyStatus, string> = {
  Disponible: 'bg-[#e9efe6] text-[#3c5a37] border-[#cfdcc9]',
  Próximamente: 'bg-[#efe9df] text-bronce border-[#e0d4c1]',
  Reservado: 'bg-[#f3ead9] text-[#7a5a1c] border-[#e6d4ae]',
  Vendido: 'bg-negro text-hueso border-negro',
  Arrendado: 'bg-grafito text-hueso border-grafito',
  Oculto: 'bg-white text-taupe border-negro/15',
};

export const AdminPanel: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const {
    properties,
    metrics,
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
  } = useProperties();

  const [autenticado, setAutenticado] = useState(() => {
    try {
      return sessionStorage.getItem(CLAVE_SESION) === '1';
    } catch {
      return false;
    }
  });
  const [pin, setPin] = useState('');
  const [errorPin, setErrorPin] = useState(false);
  const [editando, setEditando] = useState<Property | null | 'nueva'>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | PropertyStatus>('Todos');
  const [aviso, setAviso] = useState<string | null>(null);
  const archivo = useRef<HTMLInputElement>(null);

  const avisar = (texto: string) => {
    setAviso(texto);
    window.setTimeout(() => setAviso(null), 4000);
  };

  const inventario = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return [...properties]
      .filter((p) => filtroEstado === 'Todos' || p.status === filtroEstado)
      .filter((p) => !q || `${p.name} ${p.sector} ${p.city} ${p.id}`.toLowerCase().includes(q))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [properties, busqueda, filtroEstado]);

  const ingresar = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === MARCA.pinAdmin) {
      setAutenticado(true);
      try {
        sessionStorage.setItem(CLAVE_SESION, '1');
      } catch {
        /* sin almacenamiento */
      }
    } else {
      setErrorPin(true);
    }
  };

  const salir = () => {
    try {
      sessionStorage.removeItem(CLAVE_SESION);
    } catch {
      /* sin almacenamiento */
    }
    setAutenticado(false);
    onExit();
  };

  const exportar = () => {
    const datos = { version: SEED_VERSION, exportadoEn: new Date().toISOString(), propiedades: properties };
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'propiedades.json';
    a.click();
    URL.revokeObjectURL(url);
    avisar('Inventario exportado como propiedades.json.');
  };

  const importar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const datos = JSON.parse(await f.text());
      const lista = Array.isArray(datos) ? datos : datos?.propiedades;
      if (!esInventarioValido(lista)) throw new Error('formato');
      if (window.confirm(`¿Reemplazar el inventario actual por las ${lista.length} propiedades del archivo?`)) {
        replaceAll(lista);
        avisar(`Importadas ${lista.length} propiedades.`);
      }
    } catch {
      avisar('El archivo no es un inventario válido.');
    }
  };

  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tinta px-5 text-hueso">
        <div aria-hidden="true" className="grano fixed inset-0 opacity-[0.06]" />
        <form onSubmit={ingresar} className="relative w-full max-w-sm text-center">
          <div className="flex justify-center">
            <Logotipo tono="claro" />
          </div>
          <div className="mx-auto mt-12 flex h-12 w-12 items-center justify-center rounded-full border border-white/15">
            <Lock className="h-5 w-5 text-arena" strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-[18px] font-light uppercase tracking-[0.14em]">Panel de propiedades</h1>
          <p className="mt-2 text-[12.5px] text-piedra">Ingresa el PIN para administrar el inventario.</p>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErrorPin(false);
            }}
            placeholder="PIN"
            className="mt-8 w-full rounded-full border border-white/15 bg-white/5 px-5 py-4 text-center text-[18px] tracking-[0.5em] text-hueso placeholder:tracking-[0.2em] placeholder:text-piedra focus:border-white/50 focus:outline-none"
          />
          {errorPin && <p className="mt-3 text-[12px] text-[#e7b4a8]">PIN incorrecto.</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-white py-4 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-negro"
          >
            Ingresar
          </button>
          <button type="button" onClick={onExit} className="mt-5 text-[12px] text-piedra hover:text-hueso">
            Volver al sitio
          </button>
        </form>
      </div>
    );
  }

  if (editando) {
    return (
      <PropertyEditor
        initialProperty={editando === 'nueva' ? null : editando}
        onCancel={() => setEditando(null)}
        onSave={(datos) => {
          if (editando === 'nueva') {
            const nueva = addProperty(datos);
            avisar(`«${nueva.name}» creada.`);
          } else {
            updateProperty(editando.id, datos);
            avisar(`«${datos.name}» guardada.`);
          }
          setEditando(null);
        }}
      />
    );
  }

  const tarjetas: { etiqueta: string; valor: string | number; nota?: string }[] = [
    { etiqueta: 'Publicadas', valor: metrics.total - metrics.ocultas },
    { etiqueta: 'Disponibles', valor: metrics.disponibles },
    { etiqueta: 'Próximamente', valor: metrics.proximamente },
    { etiqueta: 'Vendidas', valor: metrics.vendidas },
    { etiqueta: 'Arrendadas', valor: metrics.arrendadas },
    { etiqueta: 'Ocultas', valor: metrics.ocultas, nota: 'borradores' },
    { etiqueta: 'Destacadas', valor: metrics.destacadas, nota: 'salen primero en el inicio' },
    { etiqueta: 'Sin video', valor: metrics.sinVideo, nota: metrics.sinVideo ? 'agrega su reel' : 'todas tienen video' },
  ];

  const textoOrigen =
    origen === 'local'
      ? `Estás viendo los cambios guardados en este navegador${guardadoEn ? ` (${formatDate(guardadoEn)})` : ''}. Los visitantes todavía ven la versión publicada.`
      : origen === 'publicado'
        ? 'Estás viendo el inventario publicado (propiedades.json).'
        : 'Estás viendo el inventario que trae el sitio. Lo que edites se guarda solo en este navegador.';

  return (
    <div className="min-h-screen bg-hueso text-negro">
      <header className="sticky top-0 z-30 border-b border-negro/10 bg-hueso/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Logotipo compacto />
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-taupe sm:inline">Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditando('nueva')}
              className="inline-flex items-center gap-2 rounded-full bg-negro px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-hueso hover:bg-grafito"
            >
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Nueva propiedad</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('inicio')}
              className="hidden rounded-full border border-negro/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-negro/[0.04] sm:inline-flex"
            >
              Ver sitio
            </button>
            <button type="button" onClick={salir} className="p-3 text-taupe hover:text-negro" title="Salir">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8">
        <div className="flex items-start gap-3 rounded-[3px] border border-negro/10 bg-white/70 p-4 text-[12.5px] leading-relaxed text-grafito">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-bronce" />
          <p>
            {textoOrigen} Para publicar los cambios para todos, usa <strong>Exportar</strong> y sube el archivo como{' '}
            <code className="rounded bg-hueso px-1">sitio/public/propiedades.json</code> en el repositorio.
          </p>
        </div>

        <section className="mt-10">
          <p className="versalitas text-[10px] text-taupe">Inventario</p>
          <h1 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-extralight uppercase tracking-[0.1em]">
            {formatCurrency(metrics.valorEnVenta)} <span className="text-taupe">en venta</span>
          </h1>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] bg-negro/10 sm:grid-cols-4 lg:grid-cols-8">
            {tarjetas.map((t) => (
              <div key={t.etiqueta} className="bg-hueso p-5">
                <p className="text-[26px] font-extralight tabular-nums">{t.valor}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-grafito">{t.etiqueta}</p>
                {t.nota && <p className="mt-1 text-[10.5px] text-taupe">{t.nota}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1 lg:max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-piedra" />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar en el inventario…"
                  className="w-full rounded-full border border-negro/12 bg-white py-3 pl-11 pr-4 text-[13px] focus:border-negro focus:outline-none"
                />
              </div>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | PropertyStatus)}
                className="rounded-full border border-negro/12 bg-white px-4 py-3 text-[13px] focus:border-negro focus:outline-none"
              >
                <option value="Todos">Todos los estados</option>
                {PROPERTY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportar}
                className="inline-flex items-center gap-2 rounded-full border border-negro/15 bg-white px-4 py-2.5 text-[11px] font-medium hover:border-negro/40"
              >
                <Download className="h-3.5 w-3.5" /> Exportar
              </button>
              <button
                type="button"
                onClick={() => archivo.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-negro/15 bg-white px-4 py-2.5 text-[11px] font-medium hover:border-negro/40"
              >
                <Upload className="h-3.5 w-3.5" /> Importar
              </button>
              <input ref={archivo} type="file" accept="application/json,.json" className="hidden" onChange={importar} />
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Descartar los cambios de este navegador y volver al inventario publicado?')) {
                    resetToPublished();
                    avisar('Se restauró el inventario publicado.');
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-negro/15 bg-white px-4 py-2.5 text-[11px] font-medium hover:border-negro/40"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restaurar publicado
              </button>
            </div>
          </div>

          <p className="mt-6 text-[12px] text-taupe">{inventario.length} propiedades</p>

          <ul className="mt-3 divide-y divide-negro/10 border-y border-negro/10">
            {inventario.map((p) => (
              <li key={p.id} className="grid gap-4 py-4 md:grid-cols-[72px_minmax(0,1.6fr)_minmax(0,1fr)_auto] md:items-center">
                <div className="flex items-center gap-4 md:contents">
                  <div className="aspect-[4/5] w-[60px] shrink-0 overflow-hidden rounded-[2px] md:w-[72px]">
                    <PropertyCover property={p} size="mini" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(p.id)}
                        title={p.featured ? 'Quitar de destacadas' : 'Destacar en el inicio'}
                        className={p.featured ? 'text-bronce' : 'text-negro/20 hover:text-bronce'}
                      >
                        <Star className={`h-4 w-4 ${p.featured ? 'fill-current' : ''}`} />
                      </button>
                      <p className="truncate text-[13px] font-semibold uppercase tracking-[0.06em]">{p.name}</p>
                    </div>
                    <p className="mt-1 truncate text-[12px] text-taupe">
                      {p.propertyType} · {p.operation} · {p.sector}
                    </p>
                    <p className="mt-1 text-[11px] text-piedra">Publicada el {formatDate(p.publishedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:block">
                  <p className="text-[14px] font-medium tabular-nums">
                    {priceLabel(p).principal}
                    {p.operation === 'Arriendo' && p.price && !p.priceOnRequest ? ' / mes' : ''}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-taupe">
                    {p.video ? (
                      <>
                        <Video className="h-3.5 w-3.5 text-[#3c5a37]" /> Con video
                      </>
                    ) : (
                      <>
                        <VideoOff className="h-3.5 w-3.5 text-[#a2543f]" /> Sin video
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <select
                    value={p.status}
                    onChange={(e) => setPropertyStatus(p.id, e.target.value as PropertyStatus)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-medium focus:outline-none ${COLOR_ESTADO[p.status]}`}
                  >
                    {PROPERTY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center text-taupe">
                    <button type="button" onClick={() => navigate(`propiedad/${p.id}`)} className="p-2 hover:text-negro" title="Ver en el sitio">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setEditando(p)} className="p-2 hover:text-negro" title="Editar">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copia = duplicateProperty(p.id);
                        if (copia) avisar(`Copia creada como borrador: ${copia.name}`);
                      }}
                      className="p-2 hover:text-negro"
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropertyStatus(p.id, p.status === 'Oculto' ? 'Disponible' : 'Oculto')}
                      className="p-2 hover:text-negro"
                      title={p.status === 'Oculto' ? 'Publicar' : 'Ocultar'}
                    >
                      {p.status === 'Oculto' ? <EyeOff className="h-4 w-4 text-bronce" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Eliminar «${p.name}»? Esta acción no se puede deshacer.`)) deleteProperty(p.id);
                      }}
                      className="p-2 hover:text-[#a2543f]"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {aviso && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-negro px-6 py-3 text-[12px] text-hueso shadow-2xl">
          {aviso}
        </div>
      )}
    </div>
  );
};
