/**
 * Lenguaje de movimiento del STICK VIDEO SYSTEM, el mismo del reel de
 * Stick Industries: nada rebota, se decelera largo, los recorridos son cortos
 * y la opacidad acompaña siempre al movimiento.
 */
export const CURVA = {
  ios: [0.32, 0.72, 0, 1] as [number, number, number, number],
  expo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  escritura: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

export const GESTO = {
  subida: 22,
  desenfoque: 8,
};

/** Entrada al hacer scroll: sube, se enfoca y aparece. */
export const revelar = (retraso = 0) => ({
  initial: { opacity: 0, y: GESTO.subida, filter: `blur(${GESTO.desenfoque}px)` },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '0px 0px -12% 0px' },
  transition: { duration: 1, ease: CURVA.ios, delay: retraso },
});
