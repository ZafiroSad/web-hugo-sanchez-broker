import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { MARCA } from '../config/marca';
import { useProperties } from '../context/PropertyContext';
import { whatsappUrl } from '../utils/formatters';
import { CURVA } from '../utils/motion';
import { WhatsAppIcon } from './marca';

/**
 * «Escríbeme». No guarda nada en ningún servidor: arma el mensaje y lo abre
 * en WhatsApp para que llegue directo al teléfono de Hugo.
 */
const INTERESES = ['Comprar', 'Arrendar', 'Vender mi propiedad', 'Invertir'] as const;
type Interes = (typeof INTERESES)[number];

export const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { sectors } = useProperties();
  const [nombre, setNombre] = useState('');
  const [interes, setInteres] = useState<Interes>('Comprar');
  const [zona, setZona] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [mensaje, setMensaje] = useState('');

  if (!isOpen) return null;

  const texto = [
    `Hola Hugo, soy ${nombre.trim() || 'un cliente de tu página web'}.`,
    `Quiero ${interes.toLowerCase()}${zona ? ` en ${zona}` : ''}.`,
    presupuesto.trim() ? `Presupuesto: ${presupuesto.trim()}.` : '',
    mensaje.trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappUrl(texto), '_blank', 'noopener,noreferrer');
    onClose();
  };

  const campo =
    'w-full rounded-[3px] border border-negro/12 bg-white px-4 py-3 text-[14px] text-negro placeholder:text-piedra focus:border-negro focus:outline-none';

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: CURVA.ios }}
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-7 shadow-2xl sm:rounded-2xl sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 p-2 text-taupe hover:text-negro" aria-label="Cerrar">
          <X className="h-5 w-5" />
        </button>
        <p className="versalitas text-[9.5px] text-taupe">Escríbeme</p>
        <h3 className="titular mt-3 text-[26px] font-light leading-tight text-negro">Cuéntame qué buscas</h3>
        <p className="mt-2 text-[13px] font-light text-grafito">
          Tu mensaje llega directo a mi WhatsApp, {MARCA.telefonoVisible}.
        </p>

        <form onSubmit={enviar} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-grafito">Tu nombre</span>
            <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" />
          </label>

          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-grafito">Quiero</span>
            <div className="grid grid-cols-2 gap-2">
              {INTERESES.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  onClick={() => setInteres(opcion)}
                  className={`rounded-[3px] border px-3 py-2.5 text-[12px] transition-colors ${
                    interes === opcion ? 'border-negro bg-negro text-hueso' : 'border-negro/12 bg-white text-grafito hover:border-negro/40'
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-grafito">Zona</span>
              <select className={campo} value={zona} onChange={(e) => setZona(e.target.value)}>
                <option value="">Cualquiera</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="Panamá">Panamá</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-grafito">Presupuesto</span>
              <input className={campo} value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} placeholder="Ej. $2.000 millones" />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-grafito">Mensaje</span>
            <textarea
              className={`${campo} min-h-[96px] resize-y`}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Habitaciones, tipo de propiedad, fechas…"
            />
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-negro py-4 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-hueso transition-colors hover:bg-grafito"
          >
            <WhatsAppIcon className="h-4 w-4" /> Enviar por WhatsApp
          </button>
          <p className="text-center text-[11px] text-taupe">Al enviar aceptas la política de tratamiento de datos.</p>
        </form>
      </motion.div>
    </div>
  );
};
