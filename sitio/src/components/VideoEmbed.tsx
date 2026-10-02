import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { parseVideo } from '../utils/video';
import { InstagramIcon } from './marca';

/**
 * El recorrido en video de cada propiedad.
 *
 * Los reels de Hugo se muestran con el embed oficial de Instagram (blockquote
 * + embed.js), que ajusta solo la altura. El blockquote se inyecta como HTML
 * porque embed.js lo reemplaza por un iframe: si React lo gestionara, fallaría
 * al desmontar un nodo que ya no existe.
 */

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let cargaEmbed: Promise<void> | null = null;

function cargarEmbedInstagram(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (cargaEmbed) return cargaEmbed;
  cargaEmbed = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      cargaEmbed = null;
      reject(new Error('No se pudo cargar el embed de Instagram'));
    };
    document.body.appendChild(script);
  });
  return cargaEmbed;
}

interface VideoEmbedProps {
  url?: string;
  title: string;
  /** 'auto' carga al acercarse a la pantalla; 'clic' muestra una portada y carga al pulsar. */
  carga?: 'auto' | 'clic';
  /** Marco de teléfono negro alrededor del video. */
  telefono?: boolean;
  /** Contenido de la portada en modo 'clic'. */
  portada?: React.ReactNode;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  url,
  title,
  carga = 'auto',
  telefono = true,
  portada,
  className = '',
}) => {
  const info = parseVideo(url);
  const contenedor = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activo, setActivo] = useState(carga === 'auto');
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'fallo'>('cargando');

  // Solo se carga cuando el video está cerca de la pantalla.
  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo || visible) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, [visible]);

  const debeCargar = activo && visible && info?.kind === 'instagram';

  useEffect(() => {
    if (!debeCargar) return;
    let vivo = true;
    setEstado('cargando');
    const nodo = contenedor.current;
    const vigilante = new MutationObserver(() => {
      if (nodo?.querySelector('iframe')) {
        setEstado('listo');
        vigilante.disconnect();
      }
    });
    if (nodo) vigilante.observe(nodo, { childList: true, subtree: true });
    cargarEmbedInstagram()
      .then(() => {
        if (vivo) window.instgrm?.Embeds.process();
      })
      .catch(() => vivo && setEstado('fallo'));
    const limite = window.setTimeout(() => {
      if (vivo && !nodo?.querySelector('iframe')) setEstado('fallo');
    }, 9000);
    return () => {
      vivo = false;
      vigilante.disconnect();
      window.clearTimeout(limite);
    };
  }, [debeCargar, url]);

  if (!info) return null;

  const marco = telefono
    ? 'rounded-[2.1rem] bg-negro p-[9px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-white/10'
    : '';
  const pantalla = telefono ? 'rounded-[1.65rem]' : 'rounded-2xl';

  const enlaceExterno = info.kind === 'file' ? info.src : info.permalink;

  return (
    <div className={`w-full ${className}`}>
      <div className={marco}>
        <div ref={contenedor} className={`relative overflow-hidden bg-white ${pantalla}`}>
          {/* Portada (modo clic) */}
          {!activo && (
            <button
              type="button"
              onClick={() => setActivo(true)}
              className="group relative block aspect-[4/5] w-full overflow-hidden bg-negro text-left"
              aria-label={`Ver el recorrido en video de ${title}`}
            >
              {portada}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-all duration-500 ease-ios group-hover:scale-105 group-hover:bg-white/20">
                  <Play className="ml-1 h-6 w-6 fill-white text-white" />
                </span>
              </span>
            </button>
          )}

          {/* Instagram */}
          {activo && info.kind === 'instagram' && (
            <>
              {visible && (
                <div
                  className="min-h-[420px]"
                  dangerouslySetInnerHTML={{
                    __html: `<blockquote class="instagram-media" data-instgrm-permalink="${info.permalink}?utm_source=ig_embed" data-instgrm-version="14" style="background:#fff;border:0;margin:0;padding:0;width:100%;"><a href="${info.permalink}" target="_blank" rel="noopener noreferrer" style="display:block;padding:24px;font:500 12px Montserrat,sans-serif;color:#111;text-align:center;">Ver este recorrido en Instagram</a></blockquote>`,
                  }}
                />
              )}
              {estado !== 'listo' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-negro px-8 text-center text-hueso">
                  <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.06]" />
                  {estado === 'cargando' ? (
                    <>
                      <span className="relative h-10 w-10 animate-spin rounded-full border border-white/15 border-t-white/70" />
                      <span className="relative versalitas text-[10px] text-piedra">Cargando recorrido</span>
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/30">
                        <Play className="ml-1 h-5 w-5 fill-white text-white" />
                      </span>
                      <span className="relative text-sm font-light leading-relaxed text-arena">
                        El recorrido de {title} está en Instagram.
                      </span>
                      <a
                        href={info.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-negro transition-colors hover:bg-hueso"
                      >
                        <InstagramIcon className="h-3.5 w-3.5" /> Ver el video
                      </a>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* YouTube */}
          {activo && info.kind === 'youtube' && visible && (
            <div className={`relative w-full ${/shorts/i.test(url || '') ? 'aspect-[9/16]' : 'aspect-video'}`}>
              <iframe
                src={info.embed}
                title={`Recorrido en video: ${title}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

          {/* Archivo propio */}
          {activo && info.kind === 'file' && (
            <video
              src={info.src}
              controls
              playsInline
              preload="metadata"
              className="block h-auto w-full bg-negro"
              aria-label={`Recorrido en video: ${title}`}
            />
          )}
        </div>
      </div>

      {enlaceExterno && (
        <a
          href={enlaceExterno}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-taupe transition-colors hover:text-negro"
        >
          {info.kind === 'instagram' && <InstagramIcon className="h-3 w-3" />}
          Abrir el video original
        </a>
      )}
    </div>
  );
};
