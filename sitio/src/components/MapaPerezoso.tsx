import React, { Suspense } from 'react';
import type { InteractiveMap as Mapa } from './InteractiveMap';

/** El mapa (Leaflet) solo se descarga cuando una ficha lo necesita. */
const InteractiveMap = React.lazy(() => import('./InteractiveMap').then((m) => ({ default: m.InteractiveMap })));

export const MapaPerezoso: React.FC<React.ComponentProps<typeof Mapa>> = (props) => (
  <Suspense fallback={<div className={`w-full rounded-[3px] bg-[#ebe6de] ${props.heightClass ?? 'h-[320px] md:h-[380px]'}`} />}>
    <InteractiveMap {...props} />
  </Suspense>
);
