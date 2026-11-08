# @pablo-v/terminal

## 1.0.2

### Patch Changes

- d0c11f7: Design audit fixes:

  - tokens: add the `--pxl-size-xs/sm/md/lg` control heights (24/32/40/48px) and `--pxl-opacity-disabled`. Components now take their heights and disabled opacity from these tokens.
  - card: add `CardLink`, a stretched link that makes the whole card clickable, and `CardTitle pixel`. Titles are now sans by default. `interactive` is deprecated.
  - input, select, textarea: a single focus ring, with the outline only for keyboard focus; affixes, chevrons, field dots and selection labels no longer turn accent; fields use 16px text on coarse pointers so iOS does not zoom.
  - switch, chip: hit areas of at least 24px, and the switch changes tone on hover when on.
  - link: the resting underline uses a `currentColor` mix that stays visible in dark mode.
  - progress, slider: unlit cells are `gray-400` with a thin border; mini-chart ink uses `fg-muted`.
  - terminal text is 13px; the skeleton sweep and table row hover are more visible in dark mode.

## 1.0.1

### Patch Changes

- 14a3a84: Accessibility and layout-stability fixes:

  - tokens: add a metric-matched `Geist Fallback` face to `--pxl-font-sans` so the font swap no longer shifts layout, and split each font into a Latin file and an extended file selected by `unicode-range`, so Latin-only pages skip the extended files.
  - button: `loading` now sets `aria-disabled` instead of `disabled`, so the button keeps focus; clicks and form submission are blocked while loading, and the dots overlay the label so the width stays the same.
  - badge: subtle success, warning, danger and neutral text is darkened to reach 4.5:1, and accent text uses `accent-text`.
  - terminal: success and error text reach 4.5:1, and the cursor stops blinking after five seconds.

- Updated dependencies [2c3df8b]
  - @pablo-v/pixel-icons@1.1.0

## 1.0.0

### Minor Changes

- 546adf4: Add form, overlay, navigation and structure components (input, textarea, checkbox, radio, select, slider, field, dialog, tooltip, popover, menu, toast, tabs, breadcrumb, accordion, table, kbd, skeleton, separator) and signature components (pixel-avatar, pixel-image, pixel-transition, terminal, pixel-icons, command-menu, mini-chart, flip-clock). Interactive components ship with `"use client"` for the Next.js App Router. Tokens add `--pxl-shadow-lg`, `--pxl-overlay`, the decorative `--pxl-shadow-pixel` and `--pxl-clip-notch`, the `pxl-float-in` keyframes and a Tailwind CSS v4 preset at `@pablo-v/tokens/tailwind.css`. Core adds positioning, dismiss, roving-focus, ref-merging and cell helpers; progress and scramble-text reuse them.

### Patch Changes

- Updated dependencies [546adf4]
- Updated dependencies [18d5fc6]
  - @pablo-v/core@0.2.0
  - @pablo-v/pixel-icons@1.0.0
  - @pablo-v/tokens@0.2.0
