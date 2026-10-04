import React, { useEffect, useRef } from 'react';

/**
 * Hilos de luz sobre negro: el mismo shader de la entrada de Stick Industries
 * (assets/seda.js del portafolio), en un tono champaña para Hugo. Un solo
 * fragment shader, sin librerías; cada cuadro es función pura del tiempo.
 * Se pausa con la pestaña oculta y, con movimiento reducido, pinta un solo
 * cuadro. Sin WebGL no pinta nada y queda el fondo negro de quien lo contiene.
 */

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FS = `precision highp float;
uniform vec2 uR;uniform float uT;uniform float uI;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.03+vec2(7.1,3.3);a*=.5;}return s;}
float estela(vec2 uv,float t,float off,float slope){
 float w=fbm(uv*.9+vec2(t,-t*.5));
 float c=.30*sin(uv.x*1.5+t*2.+w*.9)+slope*uv.x+.05*sin(uv.x*3.2-t*3.);
 float d=uv.y-c-off;
 float fan=.55+1.25*smoothstep(-1.,1.,uv.x);
 float u=d/fan;
 float p=u*46.+w*2.2+t*2.;
 float hil=pow(.5+.5*sin(p),26.);
 float fino=pow(.5+.5*sin(p*2.3+1.7),40.)*.6;
 float env=exp(-pow(u/.24,2.));
 float nucleo=exp(-pow(u/.05,2.))*.45;
 float vel=exp(-pow(u/.9,2.))*.26*(.6+fbm(uv*2.2+t));
 return (hil*.75+fino)*env+nucleo*env+vel;
}
vec2 rot(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(c*p.x-s*p.y,s*p.x+c*p.y);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*uR)/min(uR.x,uR.y);
 float t=uT*.12;
 float E=.5*uR.y/min(uR.x,uR.y);
 float X=.5*uR.x/min(uR.x,uR.y);
 float th=.6+.95*sin(uT*.1);
 float off=1.05*max(X,E)*sin(uT*.2);
 float L=min(estela(rot(uv,th),t,off,.16*sin(uT*.13)),1.7);
 float v=1.-dot(uv*.55,uv*.55);
 L=L*uI*v;
 vec3 luz=vec3(.86,.79,.67);
 vec3 col=luz*L+vec3(.012,.011,.010);
 col+=(h(gl_FragCoord.xy+uT)-.5)*.012;
 gl_FragColor=vec4(col,1.);}`;

export const Estela: React.FC<{ intensidad?: number; className?: string }> = ({ intensidad = 1, className }) => {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const compilar = (tipo: number, fuente: string) => {
      const s = gl.createShader(tipo);
      if (!s) return null;
      gl.shaderSource(s, fuente);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compilar(gl.VERTEX_SHADER, VS);
    const fs = compilar(gl.FRAGMENT_SHADER, FS);
    const programa = gl.createProgram();
    if (!vs || !fs || !programa) return;
    gl.attachShader(programa, vs);
    gl.attachShader(programa, fs);
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return;
    gl.useProgram(programa);

    // Un triángulo que cubre toda la pantalla.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const p = gl.getAttribLocation(programa, 'p');
    gl.enableVertexAttribArray(p);
    gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(programa, 'uR');
    const uT = gl.getUniformLocation(programa, 'uT');
    const uI = gl.getUniformLocation(programa, 'uI');

    // Resolución interna al 60 %: los hilos son difusos y así no pesa en un teléfono.
    const ajustar = () => {
      const r = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
      const w = Math.max(2, Math.round(canvas.clientWidth * r));
      const alto = Math.max(2, Math.round(canvas.clientHeight * r));
      if (canvas.width !== w || canvas.height !== alto) {
        canvas.width = w;
        canvas.height = alto;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const pintar = (t: number) => {
      ajustar();
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform1f(uI, intensidad);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const fijo = () => pintar(3.2);
      fijo();
      window.addEventListener('resize', fijo);
      return () => {
        window.removeEventListener('resize', fijo);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    const inicio = performance.now();
    let id = 0;
    const cuadro = (ahora: number) => {
      id = 0;
      if (document.hidden) return;
      pintar((ahora - inicio) / 1000);
      id = requestAnimationFrame(cuadro);
    };
    const arrancar = () => {
      if (!id && !document.hidden) id = requestAnimationFrame(cuadro);
    };
    arrancar();
    document.addEventListener('visibilitychange', arrancar);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('visibilitychange', arrancar);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [intensidad]);

  return <canvas ref={lienzo} aria-hidden="true" className={className} />;
};
