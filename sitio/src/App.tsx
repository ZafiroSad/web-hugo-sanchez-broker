import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { navigate, useHashRoute, type Route } from './utils/router';
import { titleCase } from './utils/formatters';
import { CURVA } from './utils/motion';
import { Intro } from './components/Intro';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { Cierres, ComoTrabajo, Destacadas, Inversion, Manifiesto, SobreHugo, VendeTuPropiedad } from './components/SeccionesInicio';
import { PropertyList } from './components/PropertyList';
import { PropertyDetail } from './components/PropertyDetail';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingInstagram';
import { PropertyComparisonBadge } from './components/PropertyComparisonBadge';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { ContactModal } from './components/ContactModal';

// El panel solo se descarga al entrar en #/admin.
const AdminPanel = lazy(() => import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel })));

const TITULO_BASE = 'Hugo Sánchez · Broker inmobiliario en Bucaramanga';

/** Baja a una sección del inicio cuando exista (la vista puede estar entrando). */
function bajarASeccion(id: string) {
  let intentos = 0;
  const buscar = () => {
    const nodo = document.getElementById(id);
    if (nodo) {
      const y = nodo.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (intentos++ < 20) {
      window.setTimeout(buscar, 80);
    }
  };
  buscar();
}

function claveDeVista(route: Route): string {
  if (route.name === 'intro' || route.name === 'inicio') return 'inicio';
  if (route.name === 'propiedad') return `propiedad-${route.id}`;
  return route.name;
}

function AppContent() {
  const route = useHashRoute();
  const { properties, compareIds, toggleCompareProperty, clearCompare, getProperty } = useProperties();
  const [contactoAbierto, setContactoAbierto] = useState(false);
  const [comparadorAbierto, setComparadorAbierto] = useState(false);
  const enIntro = route.name === 'intro';

  useEffect(() => {
    if (route.name === 'inicio' && route.section) {
      bajarASeccion(route.section);
    } else if (route.name !== 'intro') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [route]);

  useEffect(() => {
    if (route.name === 'propiedad') {
      const p = getProperty(route.id);
      document.title = p ? `${titleCase(p.name)} · Hugo Sánchez` : TITULO_BASE;
    } else if (route.name === 'propiedades') {
      document.title = 'Propiedades · Hugo Sánchez';
    } else if (route.name === 'admin') {
      document.title = 'Panel · Hugo Sánchez';
    } else {
      document.title = TITULO_BASE;
    }
  }, [route, getProperty]);

  if (route.name === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-tinta" />}>
        <AdminPanel onExit={() => navigate('inicio')} />
      </Suspense>
    );
  }

  const comparadas = properties.filter((p) => compareIds.includes(p.id));
  const enFicha = route.name === 'propiedad';

  return (
    <div className="flex min-h-screen flex-col bg-hueso text-negro">
      <AnimatePresence>{enIntro && <Intro key="intro" onEnter={() => navigate('inicio')} />}</AnimatePresence>

      <Navbar route={route} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={claveDeVista(route)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: CURVA.ios }}
          >
            {(route.name === 'inicio' || route.name === 'intro') && (
              <>
                <HomeHero animar={!enIntro} />
                <Destacadas />
                <SobreHugo />
                <ComoTrabajo />
                <Inversion />
                <Manifiesto />
                <Cierres />
                <VendeTuPropiedad onContacto={() => setContactoAbierto(true)} />
              </>
            )}
            {route.name === 'propiedades' && <PropertyList />}
            {route.name === 'propiedad' && <PropertyDetail id={route.id} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onContacto={() => setContactoAbierto(true)} />

      {!enIntro && <FloatingButtons elevado={enFicha} mostrarWhatsApp={!enFicha} />}
      <PropertyComparisonBadge onOpenCompare={() => setComparadorAbierto(true)} elevado={enFicha} />
      <PropertyComparisonModal
        isOpen={comparadorAbierto}
        onClose={() => setComparadorAbierto(false)}
        properties={comparadas}
        onRemove={toggleCompareProperty}
        onClearAll={() => {
          clearCompare();
          setComparadorAbierto(false);
        }}
      />
      <ContactModal isOpen={contactoAbierto} onClose={() => setContactoAbierto(false)} />
    </div>
  );
}

export default function App() {
  return (
    <PropertyProvider>
      <AppContent />
    </PropertyProvider>
  );
}
