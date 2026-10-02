/**
 * Reconoce el enlace de un recorrido en video. Hugo publica todo en reels de
 * Instagram, así que ese es el caso principal; también se aceptan YouTube y
 * archivos .mp4 propios (por ejemplo, los de Santy Ramírez en alta calidad).
 */
export type VideoInfo =
  | { kind: 'instagram'; code: string; permalink: string }
  | { kind: 'youtube'; id: string; embed: string; permalink: string }
  | { kind: 'file'; src: string };

export function parseVideo(url?: string): VideoInfo | null {
  if (!url) return null;
  const limpio = url.trim();
  if (!limpio) return null;

  const ig = limpio.match(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  if (ig) {
    return { kind: 'instagram', code: ig[1], permalink: `https://www.instagram.com/p/${ig[1]}/` };
  }

  const yt =
    limpio.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/i) ||
    limpio.match(/youtube\.com\/(?:watch\?v=|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/i);
  if (yt) {
    return {
      kind: 'youtube',
      id: yt[1],
      embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1`,
      permalink: `https://www.youtube.com/watch?v=${yt[1]}`,
    };
  }

  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(limpio)) {
    return { kind: 'file', src: limpio };
  }

  // Un código suelto de Instagram (por ejemplo "DcjVDqqyjes").
  if (/^[A-Za-z0-9_-]{10,12}$/.test(limpio)) {
    return { kind: 'instagram', code: limpio, permalink: `https://www.instagram.com/p/${limpio}/` };
  }

  return null;
}
