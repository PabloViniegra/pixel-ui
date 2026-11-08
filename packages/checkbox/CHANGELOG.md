# @pablo-v/checkbox

## 1.0.1

### Patch Changes

- d0c11f7: Design audit fixes:

  - tokens: add the `--pxl-size-xs/sm/md/lg` control heights (24/32/40/48px) and `--pxl-opacity-disabled`. Components now take their heights and disabled opacity from these tokens.
  - card: add `CardLink`, a stretched link that makes the whole card clickable, and `CardTitle pixel`. Titles are now sans by default. `interactive` is deprecated.
  - input, select, textarea: a single focus ring, with the outline only for keyboard focus; affixes, chevrons, field dots and selection labels no longer turn accent; fields use 16px text on coarse pointers so iOS does not zoom.
  - switch, chip: hit areas of at least 24px, and the switch changes tone on hover when on.
  - link: the resting underline uses a `currentColor` mix that stays visible in dark mode.
  - progress, slider: unlit cells are `gray-400` with a thin border; mini-chart ink uses `fg-muted`.
  - terminal text is 13px; the skeleton sweep and table row hover are more visible in dark mode.

## 1.0.0

### Minor Changes

- 546adf4: Add form, overlay, navigation and structure components (input, textarea, checkbox, radio, select, slider, field, dialog, tooltip, popover, menu, toast, tabs, breadcrumb, accordion, table, kbd, skeleton, separator) and signature components (pixel-avatar, pixel-image, pixel-transition, terminal, pixel-icons, command-menu, mini-chart, flip-clock). Interactive components ship with `"use client"` for the Next.js App Router. Tokens add `--pxl-shadow-lg`, `--pxl-overlay`, the decorative `--pxl-shadow-pixel` and `--pxl-clip-notch`, the `pxl-float-in` keyframes and a Tailwind CSS v4 preset at `@pablo-v/tokens/tailwind.css`. Core adds positioning, dismiss, roving-focus, ref-merging and cell helpers; progress and scramble-text reuse them.

### Patch Changes

- Updated dependencies [546adf4]
- Updated dependencies [18d5fc6]
  - @pablo-v/core@0.2.0
  - @pablo-v/pixel-icons@1.0.0
  - @pablo-v/tokens@0.2.0
