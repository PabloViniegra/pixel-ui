# @pablo-v/core

## 0.2.1

### Patch Changes

- 1b8a9f9: Overlays animate out as well as in. Dialog transitions in and out; Popover, Menu, DatePicker and the Navbar dropdown fade out before unmounting; dismissed toasts collapse so the stack closes up. Floating panels scale from the point facing their anchor, and a tooltip shown right after another skips its delay and animation. Colour previews keep their colours in forced-colours mode.

## 0.2.0

### Minor Changes

- 546adf4: Add form, overlay, navigation and structure components (input, textarea, checkbox, radio, select, slider, field, dialog, tooltip, popover, menu, toast, tabs, breadcrumb, accordion, table, kbd, skeleton, separator) and signature components (pixel-avatar, pixel-image, pixel-transition, terminal, pixel-icons, command-menu, mini-chart, flip-clock). Interactive components ship with `"use client"` for the Next.js App Router. Tokens add `--pxl-shadow-lg`, `--pxl-overlay`, the decorative `--pxl-shadow-pixel` and `--pxl-clip-notch`, the `pxl-float-in` keyframes and a Tailwind CSS v4 preset at `@pablo-v/tokens/tailwind.css`. Core adds positioning, dismiss, roving-focus, ref-merging and cell helpers; progress and scramble-text reuse them.

## 0.1.0

### Minor Changes

- Initial release.
