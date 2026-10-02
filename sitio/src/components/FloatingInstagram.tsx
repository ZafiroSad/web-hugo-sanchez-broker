import React from 'react';
import { motion } from 'motion/react';
import { MARCA } from '../config/marca';
import { whatsappUrl } from '../utils/formatters';
import { CURVA } from '../utils/motion';
import { InstagramIcon, WhatsAppIcon } from './marca';

/**
 * Botones fijos en toda la página: Instagram a la izquierda (pedido del
 * cliente) y WhatsApp a la derecha. En la ficha de una propiedad, en el
 * teléfono, se elevan para no tapar la barra de «Coordina tu visita».
 */
export const FloatingButtons: React.FC<{ elevado?: boolean; mostrarWhatsApp?: boolean }> = ({
  elevado = false,
  mostrarWhatsApp = true,
}) => {
  const abajo = elevado ? 'bottom-[88px] lg:bottom-6' : 'bottom-5 sm:bottom-6';
  return (
    <>
      <motion.a
        href={MARCA.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram de ${MARCA.nombre}: @${MARCA.instagram.usuario}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: CURVA.ios, delay: 0.6 }}
        className={`group fixed left-4 z-30 flex h-12 items-center rounded-full bg-negro/90 px-1.5 text-hueso shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-md transition-colors hover:bg-negro sm:left-6 ${abajo}`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
          <InstagramIcon className="h-[18px] w-[18px] text-white" />
        </span>
        {/* El usuario se despliega al pasar el cursor: así el botón no tapa el contenido. */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] opacity-0 transition-all duration-500 ease-ios group-hover:ml-3 group-hover:mr-3 group-hover:max-w-[240px] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:mr-3 group-focus-visible:max-w-[240px] group-focus-visible:opacity-100">
          @{MARCA.instagram.usuario}
        </span>
      </motion.a>

      {mostrarWhatsApp && (
        <motion.a
          href={whatsappUrl('Hola Hugo, vi tu página web y quiero coordinar una visita.')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir a Hugo por WhatsApp"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: CURVA.ios, delay: 0.7 }}
          className={`fixed right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-negro shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-negro/10 transition-transform hover:scale-105 sm:right-6 ${abajo}`}
        >
          <WhatsAppIcon className="h-5 w-5" />
        </motion.a>
      )}
    </>
  );
};
