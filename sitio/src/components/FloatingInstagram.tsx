import React from 'react';
import { motion } from 'motion/react';
import { MARCA } from '../config/marca';
import { whatsappUrl } from '../utils/formatters';
import { CURVA } from '../utils/motion';
import { InstagramIcon, WhatsAppIcon } from './marca';

const MENSAJE = 'Hola Hugo, vi tu página web y quiero coordinar una visita.';

/** El botón de Instagram con los colores de la marca, para que se reconozca de un vistazo. */
export const BotonInstagram: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => (
  <a
    href={MARCA.instagram.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Instagram de ${MARCA.nombre}: @${MARCA.instagram.usuario}`}
    className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-sm ${className}`}
  >
    <InstagramIcon className="h-[19px] w-[19px]" />
  </a>
);

/**
 * Instagram y WhatsApp en toda la página (pedido del cliente).
 * En el computador flotan en las esquinas. En el teléfono van en una barra
 * fija abajo, para no tapar textos ni precios; en la ficha de una propiedad
 * esa barra es la de la propia ficha, que ya trae los dos.
 */
export const FloatingButtons: React.FC<{ enFicha?: boolean }> = ({ enFicha = false }) => (
  <>
    {/* Computador */}
    <motion.a
      href={MARCA.instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Instagram de ${MARCA.nombre}: @${MARCA.instagram.usuario}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: CURVA.ios, delay: 0.6 }}
      className="group fixed bottom-6 left-6 z-30 hidden h-12 items-center rounded-full bg-negro/90 px-1.5 text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-md transition-colors hover:bg-negro lg:flex"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
        <InstagramIcon className="h-[18px] w-[18px] text-white" />
      </span>
      {/* El usuario se despliega al pasar el cursor: así el botón no tapa el contenido. */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] opacity-0 transition-all duration-500 ease-ios group-hover:ml-3 group-hover:mr-3 group-hover:max-w-[240px] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:mr-3 group-focus-visible:max-w-[240px] group-focus-visible:opacity-100">
        @{MARCA.instagram.usuario}
      </span>
    </motion.a>
    {!enFicha && (
      <motion.a
        href={whatsappUrl(MENSAJE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir a Hugo por WhatsApp"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: CURVA.ios, delay: 0.7 }}
        className="fixed bottom-6 right-6 z-30 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-negro shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-negro/10 transition-transform hover:scale-105 lg:flex"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </motion.a>
    )}

    {/* Teléfono: barra fija */}
    {!enFicha && (
      <motion.div
        initial={{ y: 90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: CURVA.ios, delay: 0.4 }}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-negro/[0.08] bg-white/95 px-4 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex max-w-xl items-center gap-2.5">
          <BotonInstagram className="h-11 w-11" />
          <a
            href={whatsappUrl(MENSAJE)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 flex-1 items-center justify-center gap-2.5 rounded-full bg-negro text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
          >
            <WhatsAppIcon className="h-4 w-4" /> Coordina tu visita
          </a>
        </div>
      </motion.div>
    )}
  </>
);
