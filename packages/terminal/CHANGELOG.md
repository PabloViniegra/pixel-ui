# @pablo-v/terminal

## 1.0.1

### Patch Changes

- 14a3a84: Accessibility and layout-stability fixes:

  - tokens: add a metric-matched `Geist Fallback` face to `--pxl-font-sans` so the font swap no longer shifts layout, and split each font into a Latin file and an extended file selected by `unicode-range`, so Latin-only pages skip the extended files.
  - button: `loading` now sets `aria-disabled` instead of `disabled`, so the button keeps focus; clicks and form submission are blocked while loading, and the dots overlay the label so the width stays the same.
  - badge: subtle success, warning, danger and neutral text is darkened to reach 4.5:1, and accent text uses `accent-text`.
  - terminal: success and error text reach 4.5:1, and the cursor stops blinking after five seconds.

## 1.0.0

### Minor Changes

- 546adf4: Add form, overlay, navigation and structure components (input, textarea, checkbox, radio, select, slider, field, dialog, tooltip, popover, menu, toast, tabs, breadcrumb, accordion, table, kbd, skeleton, separator) and signature components (pixel-avatar, pixel-image, pixel-transition, terminal, pixel-icons, command-menu, mini-chart, flip-clock). Interactive components ship with `"use client"` for the Next.js App Router. Tokens add `--pxl-shadow-lg`, `--pxl-overlay`, the decorative `--pxl-shadow-pixel` and `--pxl-clip-notch`, the `pxl-float-in` keyframes and a Tailwind CSS v4 preset at `@pablo-v/tokens/tailwind.css`. Core adds positioning, dismiss, roving-focus, ref-merging and cell helpers; progress and scramble-text reuse them.

### Patch Changes

- Updated dependencies [546adf4]
- Updated dependencies [18d5fc6]
  - @pablo-v/core@0.2.0
  - @pablo-v/pixel-icons@1.0.0
  - @pablo-v/tokens@0.2.0
