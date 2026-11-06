# @pixel-ui/switch

## 1.0.0

### Minor Changes

- 546adf4: Add form, overlay, navigation and structure components (input, textarea, checkbox, radio, select, slider, field, dialog, tooltip, popover, menu, toast, tabs, breadcrumb, accordion, table, kbd, skeleton, separator) and signature components (pixel-avatar, pixel-image, pixel-transition, terminal, pixel-icons, command-menu, mini-chart, flip-clock). Interactive components ship with `"use client"` for the Next.js App Router. Tokens add `--pxl-shadow-lg`, `--pxl-overlay`, the decorative `--pxl-shadow-pixel` and `--pxl-clip-notch`, the `pxl-float-in` keyframes and a Tailwind CSS v4 preset at `@pixel-ui/tokens/tailwind.css`. Core adds positioning, dismiss, roving-focus, ref-merging and cell helpers; progress and scramble-text reuse them.
- 18d5fc6: Soften the look: rounded corners and soft shadows replace notched corners and hard offset shadows; labels use Geist instead of uppercase Geist Pixel; most stepped animations become eased. Tokens add `--pxl-radius-*`, `--pxl-shadow-sm|md` and `--pxl-accent-text`, and remove `--pxl-shadow`, `--pxl-notch`, `--pxl-clip-notch`, `pxl-blink` and `pxl-glitch`.

### Patch Changes

- f52a379: Describe each component by what it does in its docs, README and package description.
- Updated dependencies [546adf4]
- Updated dependencies [18d5fc6]
  - @pixel-ui/core@0.2.0
  - @pixel-ui/tokens@0.2.0

## 0.1.0

### Minor Changes

- Initial release.
