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
        className="transition-colors hover:text-hueso"
      >
        {etiqueta}
      </a>
    </li>
  );

  return (
    <footer className="relative overflow-hidden bg-tinta text-hueso">
      <div aria-hidden="true" className="grano absolute inset-0 opacity-[0.06]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logotipo tono="claro" />
            <p className="mt-8 max-w-sm font-script text-[30px] leading-tight text-arena">{MARCA.slogan}</p>
            <a
              href={whatsappUrl('Hola Hugo, vi tu página web y quiero coordinar una visita.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-negro transition-colors hover:bg-hueso"
            >
              <WhatsAppIcon className="h-4 w-4" /> Coordina tu visita
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="versalitas text-[9.5px] text-piedra">Navegación</p>
              <ul className="mt-5 space-y-3 text-[13px] font-light text-arena/80">
                {enlace('Inicio', 'inicio')}
                {enlace('Propiedades', 'propiedades')}
                {enlace('Sobre Hugo', 'inicio/sobre')}
                {enlace('Vendidas', 'inicio/vendidas')}
                {enlace('Inversión', 'inicio/inversion')}
                {enlace('Vende tu propiedad', 'inicio/vender')}
              </ul>
            </div>
            <div>
              <p className="versalitas text-[9.5px] text-piedra">Contacto</p>
              <ul className="mt-5 space-y-3 text-[13px] font-light text-arena/80">
                <li>
                  <a href={whatsappUrl('Hola Hugo, vi tu página web.')} target="_blank" rel="noopener noreferrer" className="hover:text-hueso">
                    WhatsApp {MARCA.telefonoVisible}
                  </a>
                </li>
                <li>
                  <button type="button" onClick={onContacto} className="hover:text-hueso">
                    Escríbeme
                  </button>
                </li>
                <li>
                  {MARCA.ciudad}, {MARCA.pais}
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-4 text-arena/80">
                <a href={MARCA.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-hueso">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </a>
                <a href={MARCA.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-hueso">
                  <TikTokIcon className="h-[18px] w-[18px]" />
                </a>
                <a href={MARCA.threads.url} target="_blank" rel="noopener noreferrer" aria-label="Threads" className="hover:text-hueso">
                  <ThreadsIcon className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
            <div>
              <p className="versalitas text-[9.5px] text-piedra">Legal</p>
              <ul className="mt-5 space-y-3 text-[13px] font-light text-arena/80">
                <li>
                  <button type="button" onClick={() => setDocumento('privacidad')} className="text-left hover:text-hueso">
                    Tratamiento de datos
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setDocumento('terminos')} className="text-left hover:text-hueso">
                    Términos de uso
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setDocumento('cookies')} className="text-left hover:text-hueso">
                    Almacenamiento
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[11px] text-piedra sm:flex-row">
          <p>
            © {new Date().getFullYear()} {MARCA.nombre} · {MARCA.titulo}
          </p>
          <a
            href={MARCA.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 tracking-[0.18em] hover:text-hueso"
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
