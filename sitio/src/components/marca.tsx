import React from 'react';

/**
 * Iconos de redes (los de lucide no traen marcas) y la firma HS.
 * La firma es provisional: un monograma en la tipografía del sitio hasta tener
 * el vector de la firma manuscrita real de Hugo.
 */

type IconProps = { className?: string };

export const InstagramIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export const TikTokIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.36-2.49V9.66a5.73 5.73 0 0 0-.76-.05A5.69 5.69 0 0 0 4.18 15.3 5.69 5.69 0 0 0 9.87 21a5.69 5.69 0 0 0 5.69-5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.26-1.48z" />
  </svg>
);

export const ThreadsIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" className={className} aria-hidden="true">
    <path d="M17.2 8.6c-.7-2.6-2.6-4-5.4-4-3.9 0-6.2 2.8-6.2 7.4s2.3 7.4 6.2 7.4c3 0 5.3-1.6 5.3-4.3 0-2.2-1.7-3.6-4.4-3.6-2.2 0-3.6 1-3.6 2.5 0 1.3 1.1 2.1 2.6 2.1 2.4 0 3.6-1.8 3.6-5.2" />
  </svg>
);

/**
 * Firma HS provisional: las iniciales en letra de bolígrafo (Sacramento), como
 * la firma blanca de sus portadas, hasta tener el vector de la firma real.
 */
export const FirmaHS: React.FC<{ className?: string }> = ({ className = 'text-3xl' }) => (
  <span role="img" aria-label="Hugo Sánchez" className={`shrink-0 select-none font-script leading-none ${className}`}>
    <span aria-hidden="true">HS</span>
  </span>
);

/** Logotipo de texto: nombre en mayúsculas espaciadas y descriptor debajo. */
export const Logotipo: React.FC<{ tono?: 'claro' | 'oscuro'; compacto?: boolean }> = ({
  tono = 'oscuro',
  compacto = false,
}) => {
  const color = tono === 'claro' ? 'text-white' : 'text-negro';
  const secundario = tono === 'claro' ? 'text-arena' : 'text-taupe';
  return (
    <span className="flex items-center gap-3">
      <FirmaHS className={`text-[29px] ${color}`} />
      <span className="flex flex-col leading-none">
        <span className={`text-[13px] font-light uppercase tracking-[0.08em] font-stretch-expanded ${color}`}>Hugo Sánchez</span>
        {!compacto && (
          <span className={`mt-1.5 text-[8.5px] font-semibold tracking-[0.3em] uppercase ${secundario}`}>
            Broker inmobiliario
          </span>
        )}
      </span>
    </span>
  );
};
