import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Columns3, X } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { CURVA } from '../utils/motion';

export const PropertyComparisonBadge: React.FC<{ onOpenCompare: () => void; elevado?: boolean }> = ({
  onOpenCompare,
  elevado = false,
}) => {
  const { compareIds, clearCompare } = useProperties();

  return (
    <AnimatePresence>
      {compareIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: CURVA.ios }}
          className={`fixed left-1/2 z-40 -translate-x-1/2 ${elevado ? 'bottom-24' : 'bottom-6'}`}
        >
          <div className="flex items-center gap-1 rounded-full bg-negro py-1.5 pl-5 pr-1.5 text-hueso shadow-2xl ring-1 ring-white/10">
            <button
              type="button"
              onClick={onOpenCompare}
              className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em]"
            >
              <Columns3 className="h-4 w-4 text-arena" /> Comparar ({compareIds.length})
            </button>
            <button
              type="button"
              onClick={clearCompare}
              className="ml-2 rounded-full p-2 text-piedra hover:bg-white/10 hover:text-hueso"
              title="Limpiar comparación"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
