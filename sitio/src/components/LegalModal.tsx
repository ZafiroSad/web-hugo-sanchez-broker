import React from 'react';
import { X } from 'lucide-react';
import { MARCA } from '../config/marca';

export type LegalDocType = 'privacidad' | 'terminos' | 'cookies';

/**
 * Textos legales básicos. Son una base: antes de publicar el sitio definitivo
 * conviene que los revise un abogado y que Hugo confirme sus datos de contacto.
 */
const DOCUMENTOS: Record<LegalDocType, { titulo: string; cuerpo: React.ReactNode }> = {
  privacidad: {
    titulo: 'Tratamiento de datos personales',
    cuerpo: (
      <>
        <p>
          {MARCA.nombre}, broker inmobiliario en {MARCA.ciudad}, trata los datos que le compartes (nombre, teléfono y
          lo que escribas en tus mensajes) conforme a la Ley 1581 de 2012 y sus decretos reglamentarios.
        </p>
        <p>
          <strong>Para qué se usan:</strong> responder tus consultas, coordinar visitas, enviarte información de
          propiedades que te interesen y acompañar el proceso de compra, venta o arriendo.
        </p>
        <p>
          <strong>Tus derechos:</strong> puedes conocer, actualizar, rectificar o pedir que se eliminen tus datos en
          cualquier momento, escribiendo al WhatsApp {MARCA.telefonoVisible}.
        </p>
        <p>
          Este sitio no tiene formularios que guarden datos en un servidor: los mensajes se envían directamente por
          WhatsApp.
        </p>
      </>
    ),
  },
  terminos: {
    titulo: 'Términos de uso',
    cuerpo: (
      <>
        <p>
          La información de cada propiedad (áreas, precios, administración y espacios) es la que entrega el propietario
          y puede cambiar sin previo aviso. Las áreas y condiciones definitivas son las que constan en los documentos de
          la propiedad.
        </p>
        <p>
          Los precios están en pesos colombianos. Cuando una propiedad dice «negociable», el valor final se acuerda en la
          negociación.
        </p>
        <p>
          La ubicación en el mapa es aproximada por la seguridad de los propietarios. La dirección exacta se comparte al
          coordinar la visita.
        </p>
        <p>Los videos y fotografías pertenecen a {MARCA.nombre} y a sus autores, y no pueden usarse sin autorización.</p>
      </>
    ),
  },
  cookies: {
    titulo: 'Almacenamiento en el navegador',
    cuerpo: (
      <>
        <p>
          Este sitio no usa cookies de publicidad ni de rastreo. Solo guarda en tu navegador las preferencias necesarias
          para que funcione.
        </p>
        <p>
          Los videos se muestran con el reproductor de Instagram, que puede usar sus propias cookies según las
          políticas de Meta. El mapa usa teselas de CARTO y OpenStreetMap.
        </p>
      </>
    ),
  },
};

export const LegalModal: React.FC<{ isOpen: boolean; onClose: () => void; docType: LegalDocType }> = ({
  isOpen,
  onClose,
  docType,
}) => {
  if (!isOpen) return null;
  const doc = DOCUMENTOS[docType];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-[4px] bg-hueso p-7 shadow-2xl sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[20px] font-light uppercase tracking-[0.1em] text-negro">{doc.titulo}</h3>
          <button type="button" onClick={onClose} className="p-1 text-taupe hover:text-negro" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-4 text-[14px] font-light leading-relaxed text-grafito">{doc.cuerpo}</div>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-full bg-negro px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-hueso"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
