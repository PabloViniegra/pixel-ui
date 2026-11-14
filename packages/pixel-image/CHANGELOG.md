# @pablo-v/pixel-image

## 1.0.1

### Patch Changes

- Improve small screens, touch and rendering cost: floating panels stay within the viewport and above the on-screen keyboard, Alert and Stepper adapt to their container width and now fill it, rows wrap instead of overflowing, touch targets grow on coarse pointers, hover effects only apply on devices that hover, safe-area insets are respected, and list rows and animations re-render less.
- Updated dependencies
  - @pablo-v/core@0.2.2

## 1.0.0

### Minor Changes

- 546adf4: Add form, overlay, navigation and structure components (input, textarea, checkbox, radio, select, slider, field, dialog, tooltip, popover, menu, toast, tabs, breadcrumb, accordion, table, kbd, skeleton, separator) and signature components (pixel-avatar, pixel-image, pixel-transition, terminal, pixel-icons, command-menu, mini-chart, flip-clock). Interactive components ship with `"use client"` for the Next.js App Router. Tokens add `--pxl-shadow-lg`, `--pxl-overlay`, the decorative `--pxl-shadow-pixel` and `--pxl-clip-notch`, the `pxl-float-in` keyframes and a Tailwind CSS v4 preset at `@pablo-v/tokens/tailwind.css`. Core adds positioning, dismiss, roving-focus, ref-merging and cell helpers; progress and scramble-text reuse them.

### Patch Changes

- Updated dependencies [546adf4]
- Updated dependencies [18d5fc6]
  - @pablo-v/core@0.2.0
  - @pablo-v/tokens@0.2.0
