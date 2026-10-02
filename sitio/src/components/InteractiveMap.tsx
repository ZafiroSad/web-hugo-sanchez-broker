import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, Navigation, ShieldCheck } from 'lucide-react';
import { getGoogleMapsUrl } from '../utils/formatters';

interface InteractiveMapProps {
  coordinates: { lat: number; lng: number };
  locationPrecision?: 'approximated' | 'exact';
  sector?: string;
  city?: string;
  isEditable?: boolean;
  onCoordinatesChange?: (coords: { lat: number; lng: number }) => void;
  heightClass?: string;
}

const PIN = L.divIcon({
  className: 'pin-hugo',
  html: `<div style="width:30px;height:30px;background:#111;border:2px solid #f5f2ed;border-radius:50%;box-shadow:0 6px 16px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><div style="width:7px;height:7px;background:#d9d0c3;border-radius:50%"></div></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  coordinates,
  locationPrecision = 'approximated',
  sector = '',
  city = '',
  isEditable = false,
  onCoordinatesChange,
  heightClass = 'h-[320px] md:h-[380px]',
}) => {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcador = useRef<L.Marker | null>(null);
  const alCambiar = useRef(onCoordinatesChange);
  alCambiar.current = onCoordinatesChange;

  useEffect(() => {
    if (!contenedor.current) return;
    const aproximada = locationPrecision === 'approximated' && !isEditable;

    const instancia = L.map(contenedor.current, {
      center: [coordinates.lat, coordinates.lng],
      zoom: aproximada ? 14 : 16,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    mapa.current = instancia;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(instancia);

    if (aproximada) {
      // Zona aproximada: un círculo amplio, nunca la dirección exacta.
      L.circle([coordinates.lat, coordinates.lng], {
        radius: 700,
        color: '#111111',
        weight: 1.2,
        opacity: 0.55,
        fillColor: '#8a6f4e',
        fillOpacity: 0.12,
        dashArray: '4 5',
      }).addTo(instancia);
    } else {
      const m = L.marker([coordinates.lat, coordinates.lng], { icon: PIN, draggable: isEditable }).addTo(instancia);
      marcador.current = m;
      if (isEditable) {
        m.on('dragend', (e) => {
          const { lat, lng } = (e.target as L.Marker).getLatLng();
          alCambiar.current?.({ lat, lng });
        });
      }
    }

    if (isEditable) {
      instancia.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (marcador.current) marcador.current.setLatLng([lat, lng]);
        alCambiar.current?.({ lat, lng });
      });
    }

    const t = window.setTimeout(() => instancia.invalidateSize(), 250);
    return () => {
      window.clearTimeout(t);
      instancia.remove();
      mapa.current = null;
      marcador.current = null;
    };
  }, [coordinates.lat, coordinates.lng, locationPrecision, isEditable]);

  return (
    <div className="w-full">
      <div className={`relative w-full ${heightClass} overflow-hidden rounded-[3px] border border-negro/10 bg-[#ebe6de]`}>
        <div ref={contenedor} className="z-0 h-full w-full" />
        {locationPrecision === 'approximated' && !isEditable && (
          <div className="absolute left-3 top-3 z-[400] flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 shadow-sm backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-grafito" />
            <span className="text-[10.5px] font-medium text-grafito">Zona aproximada · dirección exacta al coordinar la visita</span>
          </div>
        )}
        {isEditable && (
          <div className="absolute left-3 top-3 z-[400] flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 shadow-sm">
            <Navigation className="h-3.5 w-3.5 text-grafito" />
            <span className="text-[10.5px] font-medium text-grafito">Toca o arrastra para ubicar el inmueble</span>
          </div>
        )}
      </div>

      {!isEditable && (
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[13px] text-grafito">
            <span className="font-medium text-negro">{sector}</span>
            {city && city !== sector ? `, ${city}` : ''}
          </p>
          <a
            href={getGoogleMapsUrl(coordinates.lat, coordinates.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-negro transition-opacity hover:opacity-70"
          >
            Abrir en Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};
