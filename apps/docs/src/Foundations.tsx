import { pixelFonts, pixelFontVar } from '@pablo-v/tokens';

const colors = [
  'bg',
  'fg',
  'fg-muted',
  'border',
  'accent',
  'success',
  'warning',
  'danger',
  'gray-100',
  'gray-300',
  'gray-500',
  'gray-700',
  'gray-900',
];

export function ColorGrid() {
  return (
    <div className="pxl-docs-swatches">
      {colors.map((name) => (
        <div key={name} className="pxl-docs-swatch">
          <div className="pxl-docs-swatch__chip" style={{ background: `var(--pxl-${name})` }} />
          <code>--pxl-{name}</code>
        </div>
      ))}
    </div>
  );
}

export function PixelFonts() {
  return (
    <div className="pxl-docs-fonts">
      {pixelFonts.map((font) => (
        <div key={font} className="pxl-docs-font">
          <span className="pxl-docs-font__name">Geist Pixel {font}</span>
          <span className="pxl-docs-font__sample" style={{ fontFamily: pixelFontVar(font) }}>
            Ship it 0123
          </span>
        </div>
      ))}
    </div>
  );
}

const motion = [
  ['--pxl-ease-spring', 'Lifts, thumbs, anything that moves'],
  ['--pxl-ease-out', 'Entrances and colour fades'],
  ['--pxl-ease-steps', 'Retro frame-by-frame effects'],
] as const;

export function MotionTokens() {
  return (
    <div className="pxl-docs-motion">
      {motion.map(([token, use]) => (
        <div key={token} className="pxl-docs-motion__row">
          <div className="pxl-docs-motion__lane">
            <span
              className="pxl-docs-motion__dot"
              style={{ animationTimingFunction: `var(${token})` }}
            />
          </div>
          <code>{token}</code>
          <span className="pxl-docs-muted">{use}</span>
        </div>
      ))}
    </div>
  );
}
