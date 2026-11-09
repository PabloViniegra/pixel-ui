# @pablo-v/pixel-icons

16x16 pixel SVG icon set with crisp edges

```bash
pnpm add @pablo-v/pixel-icons @pablo-v/tokens
```

```tsx
import '@pablo-v/tokens/styles.css';
import '@pablo-v/pixel-icons/style.css';
import { PixelIcons } from '@pablo-v/pixel-icons';
```

## Animated icons

`SpinnerIcon`, `HourglassIcon`, `TypingIcon` and the other animated icons loop frame by frame. Set `--pxl-icon-duration` to change the speed; under `prefers-reduced-motion` they rest on their first frame.

```tsx
<SpinnerIcon label="Loading" style={{ '--pxl-icon-duration': '1200ms' } as React.CSSProperties} />;
```

Build your own with `createAnimatedPixelIcon(name, frames, { duration })`, where each frame is a 16×16 bitmap. Every frame must be exactly 16 rows of 16 characters, or neighbouring frames show through.
