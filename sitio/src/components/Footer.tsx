import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { MARCA } from '../config/marca';
import { whatsappUrl } from '../utils/formatters';
import { navigate } from '../utils/router';
import { LegalModal, type LegalDocType } from './LegalModal';
import { InstagramIcon, Logotipo, ThreadsIcon, TikTokIcon, WhatsAppIcon } from './marca';

export const Footer: React.FC<{ onContacto: () => void }> = ({ onContacto }) => {
  const [documento, setDocumento] = useState<LegalDocType | null>(null);

  const enlace = (etiqueta: string, ruta: string) => (
    <li key={ruta}>
      <a
        href={`#/${ruta}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(ruta);
        }}
        className="transition-colors hover:text-negro"
      >
        {etiqueta}
      </a>
    </li>
  );

  return (
    <footer className="relative border-t border-negro/[0.08] bg-white text-negro">
      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-20">
        <div className="grid gap-10 border-b border-negro/[0.06] pb-10 sm:gap-14 sm:pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logotipo tono="oscuro" />
            <p className="titular mt-7 max-w-sm text-[22px] font-light leading-[1.2] text-bronce">{MARCA.slogan}</p>
            <a
              href={whatsappUrl('Hola Hugo, vi tu página web y quiero coordinar una visita.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 hidden items-center gap-2.5 rounded-full bg-negro px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-grafito lg:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" /> Coordina tu visita
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-10 lg:col-span-7">
            <div>
              <p className="versalitas text-[9.5px] text-taupe">Navegación</p>
              <ul className="mt-5 space-y-3 text-[13px] font-light text-grafito">
                {enlace('Inicio', 'inicio')}
                {enlace('Propiedades', 'propiedades')}
                {enlace('Sobre Hugo', 'hugo')}
                {enlace('Vendidas', 'vendidas')}
                {enlace('Inversión', 'inversion')}
                {enlace('Vende tu propiedad', 'vender')}
              </ul>
            </div>
            <div className="order-last col-span-2 sm:order-none sm:col-span-1">
              <p className="versalitas text-[9.5px] text-taupe">Contacto</p>
              <ul className="mt-5 space-y-3 text-[13px] font-light text-grafito">
                <li>
                  <a href={whatsappUrl('Hola Hugo, vi tu página web.')} target="_blank" rel="noopener noreferrer" className="hover:text-negro">
                    WhatsApp {MARCA.telefonoVisible}
                  </a>
                </li>
                <li>
                  <button type="button" onClick={onContacto} className="hover:text-negro">
                    Escríbeme
                  </button>
                </li>
                <li>
                  {MARCA.ciudad}, {MARCA.pais}
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-4 text-taupe">
                <a href={MARCA.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-negro">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </a>
                <a href={MARCA.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-negro">
                  <TikTokIcon className="h-[18px] w-[18px]" />
                </a>
                <a href={MARCA.threads.url} target="_blank" rel="noopener noreferrer" aria-label="Threads" className="hover:text-negro">
                  <ThreadsIcon className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
            <div>
              <p className="versalitas text-[9.5px] text-taupe">Legal</p>
              <ul className="mt-5 space-y-3 text-[13px] font-light text-grafito">
                <li>
                  <button type="button" onClick={() => setDocumento('privacidad')} className="text-left hover:text-negro">
                    Tratamiento de datos
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setDocumento('terminos')} className="text-left hover:text-negro">
                    Términos de uso
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setDocumento('cookies')} className="text-left hover:text-negro">
                    Almacenamiento
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[11px] text-taupe sm:flex-row">
          <p>
            © {new Date().getFullYear()} {MARCA.nombre} · {MARCA.titulo}
          </p>
          <a
            href={MARCA.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 tracking-[0.18em] hover:text-negro"
          >
            <InstagramIcon className="h-3.5 w-3.5" /> @{MARCA.instagram.usuario}
          </a>
          <button
            type="button"
            onClick={() => navigate('admin')}
            className="p-1.5 opacity-40 transition-opacity hover:opacity-100"
            aria-label="Panel de administración"
            title="Panel de administración"
          >
            <KeyRound className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <LegalModal isOpen={documento !== null} onClose={() => setDocumento(null)} docType={documento ?? 'privacidad'} />
    </footer>
  );
};
