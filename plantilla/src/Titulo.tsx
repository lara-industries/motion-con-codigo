import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/anton/400.css';

// ---- Lo que la persona puede cambiar -------------------------------------
const BLUE = '#1F6BFF';
const LIME = '#D1FE17';
const INK = '#141922';

type Line = {text: string; size: 'full' | 'small'; fill: string};

const LINES: Line[] = [
  {text: 'TU', size: 'small', fill: BLUE},
  {text: 'IDEA', size: 'full', fill: BLUE},
  {text: 'SE', size: 'small', fill: BLUE},
  {text: 'MUEVE', size: 'full', fill: LIME},
];

// ---- Medidas --------------------------------------------------------------
const W = 1080;
const H = 1920;
const BLOCK_W = 860; // deja margen para el golpe al 116 %
const LEFT = (W - BLOCK_W) / 2;
const SMALL_FONT = 250;
const GAP = 34; // interlineado apretado
const FONT = 'Anton';

// ---- Tiempo (en pasos de 2 cuadros = 15 fps) --------------------------------
const FIRST_S = 0.15;
const EVERY_S = 0.3;
const OUTLINE_SCALE = [1.16, 1.06, 0.98, 1];
const OUTLINE_ROT = [-3, 1, 0, 0];
const FILL_DELAY_STEPS = 2;
const FILL_SCALE = [1.07, 0.98, 1];
const FILL_ROT = [1.2, -0.4, 0];

// Tres contornos: desplazamiento y grosor distintos
const OUTLINES = [
  {dx: 0, dy: 0, w: 7.5},
  {dx: -6, dy: 4, w: 4.5},
  {dx: 5, dy: -5, w: 3},
];
const FILL_OFFSET = {dx: 13, dy: 15}; // fuera de registro: abajo y a la derecha

type Metrics = {widths: number[]; cap: number};

const measure = (): Metrics => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.font = `1000px ${FONT}`;
  const widths = LINES.map((l) => ctx.measureText(l.text).width / 1000);
  const cap = ctx.measureText('H').actualBoundingBoxAscent / 1000;
  return {widths, cap};
};

const pick = (arr: number[], k: number) => arr[Math.min(k, arr.length - 1)];

export const Titulo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [handle] = useState(() => delayRender('Cargando la fuente Anton'));

  useEffect(() => {
    document.fonts
      .load(`400 100px ${FONT}`)
      .then(() => document.fonts.ready)
      .then(() => {
        setMetrics(measure());
        continueRender(handle);
      });
  }, [handle]);

  if (!metrics) {
    return null;
  }

  // Disposición: todo sale de las medidas de la fuente
  const sizes = LINES.map((l, i) => (l.size === 'full' ? BLOCK_W / metrics.widths[i] : SMALL_FONT));
  const caps = sizes.map((s) => s * metrics.cap);
  const totalH = caps.reduce((a, b) => a + b, 0) + GAP * (LINES.length - 1);
  let y = (H - totalH) / 2;
  const layout = LINES.map((l, i) => {
    const baseline = y + caps[i];
    const cx = LEFT + (metrics.widths[i] * sizes[i]) / 2;
    const cy = y + caps[i] / 2;
    y += caps[i] + GAP;
    return {...l, fontSize: sizes[i], baseline, cx, cy};
  });

  // Tiempo: en doses (15 fps) para el movimiento, 10 fps para el ruido
  const step = Math.floor(frame / 2);
  const stepsPerSecond = fps / 2;
  const variant = Math.floor(frame / 3) % 3;

  const starts = LINES.map((_, i) => Math.floor((FIRST_S + EVERY_S * i) * stepsPerSecond));

  const wordTransform = (i: number, scale: number, rot: number) => {
    const {cx, cy} = layout[i];
    return `translate(${cx} ${cy}) rotate(${rot}) scale(${scale}) translate(${-cx} ${-cy})`;
  };

  const textProps = (i: number) => ({
    x: LEFT,
    y: layout[i].baseline,
    fontFamily: FONT,
    fontSize: layout[i].fontSize,
    fontWeight: 400,
  });

  const filterRegion = {x: 0, y: 0, width: W, height: H, filterUnits: 'userSpaceOnUse' as const};

  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          {/* Relleno: borde rugoso + moteado con huecos diminutos */}
          <filter id="ink-fill" {...filterRegion} colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={11 + variant * 7} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="12" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed={31 + variant * 5} result="grain" />
            <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed={53 + variant} result="patch" />
            <feComposite in="grain" in2="patch" operator="arithmetic" k1="0" k2="0.62" k3="0.38" k4="0" result="mix" />
            <feColorMatrix
              in="mix"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -5.1"
              result="mask"
            />
            <feComposite in="rough" in2="mask" operator="in" />
          </filter>
          {/* Contornos: cada uno con su propio ruido, como calcado otra vez */}
          {OUTLINES.map((_, n) => (
            <filter key={n} id={`ink-line-${n}`} {...filterRegion} colorInterpolationFilters="sRGB">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.022 + n * 0.009}
                numOctaves="2"
                seed={101 + n * 17 + variant * 3}
                result="warp"
              />
              <feDisplacementMap in="SourceGraphic" in2="warp" scale={9 + n * 3} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          ))}
        </defs>

        {/* Rellenos (debajo) */}
        <g filter="url(#ink-fill)">
          {layout.map((l, i) => {
            const k = step - starts[i] - FILL_DELAY_STEPS;
            if (k < 0) {
              return null;
            }
            return (
              <g key={i} transform={wordTransform(i, pick(FILL_SCALE, k), pick(FILL_ROT, k))}>
                <text {...textProps(i)} fill={l.fill} transform={`translate(${FILL_OFFSET.dx} ${FILL_OFFSET.dy})`}>
                  {l.text}
                </text>
              </g>
            );
          })}
        </g>

        {/* Tres contornos sueltos (encima) */}
        {OUTLINES.map((o, n) => (
          <g key={n} filter={`url(#ink-line-${n})`}>
            {layout.map((l, i) => {
              const k = step - starts[i];
              if (k < 0) {
                return null;
              }
              return (
                <g key={i} transform={wordTransform(i, pick(OUTLINE_SCALE, k), pick(OUTLINE_ROT, k))}>
                  <text
                    {...textProps(i)}
                    fill="none"
                    stroke={INK}
                    strokeWidth={o.w}
                    strokeLinejoin="round"
                    transform={`translate(${o.dx} ${o.dy})`}
                  >
                    {l.text}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
