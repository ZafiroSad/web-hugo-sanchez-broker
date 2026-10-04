import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { MARCA } from '../config/marca';
import { navigate, type Route } from '../utils/router';
import { whatsappUrl } from '../utils/formatters';
import { CURVA } from '../utils/motion';
import { InstagramIcon, Logotipo, ThreadsIcon, TikTokIcon, WhatsAppIcon } from './marca';

const ENLACES = [
  { etiqueta: 'Inicio', ruta: 'inicio' },
  { etiqueta: 'Propiedades', ruta: 'propiedades' },
  { etiqueta: 'Sobre Hugo', ruta: 'hugo' },
  { etiqueta: 'Vendidas', ruta: 'vendidas' },
  { etiqueta: 'Vende tu propiedad', ruta: 'vender' },
];

const MENSAJE_GENERAL = 'Hola Hugo, vi tu página web y quiero coordinar una visita.';

export const Navbar: React.FC<{ route: Route }> = ({ route }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => setMenuAbierto(false), [route]);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuAbierto]);

  const activo = (ruta: string) => {
    if (ruta === 'propiedades') return route.name === 'propiedades' || route.name === 'propiedad';
    if (ruta === 'inicio') return route.name === 'inicio';
    return route.name === 'capitulo' && route.id === ruta;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-negro/[0.07] bg-white/95 text-negro backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#/inicio"
            onClick={(e) => {
              e.preventDefault();
              navigate('inicio');
            }}
            aria-label="Hugo Sánchez, ir al inicio"
            className="transition-opacity hover:opacity-75"
          >
            <Logotipo tono="oscuro" />
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
            {ENLACES.map((enlace) => (
              <a
                key={enlace.ruta}
                href={`#/${enlace.ruta}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(enlace.ruta);
                }}
                className={`relative py-2 text-[10.5px] font-medium uppercase tracking-[0.22em] transition-opacity ${
                  activo(enlace.ruta) ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {enlace.etiqueta}
                {activo(enlace.ruta) && (
                  <motion.span
                    layoutId="subrayado-nav"
                    className="absolute inset-x-0 -bottom-0.5 h-px bg-current"
                    transition={{ duration: 0.6, ease: CURVA.ios }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={MARCA.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Hugo Sánchez"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-negro/12 transition-colors hover:bg-negro/[0.05] lg:flex"
            >
              <InstagramIcon className="h-[17px] w-[17px]" />
            </a>
            <a
              href={whatsappUrl(MENSAJE_GENERAL)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-negro px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-grafito sm:inline-flex"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" /> Coordina tu visita
            </a>
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              className="flex h-10 w-10 items-center justify-center lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-white text-negro lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: CURVA.ios }}
          >
            <div className="relative flex h-[72px] items-center justify-between border-b border-negro/[0.07] px-5">
              <Logotipo tono="oscuro" />
              <button
                type="button"
                onClick={() => setMenuAbierto(false)}
                className="flex h-10 w-10 items-center justify-center"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="relative flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Menú">
              {ENLACES.map((enlace, i) => (
                <motion.a
                  key={enlace.ruta}
                  href={`#/${enlace.ruta}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(enlace.ruta);
                  }}
                  initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, ease: CURVA.ios, delay: 0.08 + i * 0.06 }}
                  className="titular py-2 text-[30px] font-light leading-tight"
                >
                  {enlace.etiqueta}
                </motion.a>
              ))}
            </nav>
            <div className="relative space-y-6 px-8 pb-10">
              <p className="titular text-[18px] font-light leading-snug text-bronce">{MARCA.slogan}</p>
              <a
                href={whatsappUrl(MENSAJE_GENERAL)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-negro py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white"
              >
                <WhatsAppIcon className="h-4 w-4" /> Coordina tu visita
              </a>
              <div className="flex items-center gap-6 text-taupe">
                <a href={MARCA.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a href={MARCA.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <TikTokIcon className="h-5 w-5" />
                </a>
                <a href={MARCA.threads.url} target="_blank" rel="noopener noreferrer" aria-label="Threads">
                  <ThreadsIcon className="h-5 w-5" />
                </a>
                <span className="text-[11px] tracking-[0.18em]">{MARCA.telefonoVisible}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
