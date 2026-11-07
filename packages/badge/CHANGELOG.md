# @pablo-v/badge

## 1.0.1

### Patch Changes

- 14a3a84: Accessibility and layout-stability fixes:

  - tokens: add a metric-matched `Geist Fallback` face to `--pxl-font-sans` so the font swap no longer shifts layout, and split each font into a Latin file and an extended file selected by `unicode-range`, so Latin-only pages skip the extended files.
  - button: `loading` now sets `aria-disabled` instead of `disabled`, so the button keeps focus; clicks and form submission are blocked while loading, and the dots overlay the label so the width stays the same.
  - badge: subtle success, warning, danger and neutral text is darkened to reach 4.5:1, and accent text uses `accent-text`.
  - terminal: success and error text reach 4.5:1, and the cursor stops blinking after five seconds.

## 1.0.0

### Minor Changes

- f52a379: `animateIn` now defaults to `false`; pass `animateIn` to keep the pop-in. The `dot="pulse"` breathe runs three times on mount and then holds steady instead of looping forever.
- 18d5fc6: Soften the look: rounded corners and soft shadows replace notched corners and hard offset shadows; labels use Geist instead of uppercase Geist Pixel; most stepped animations become eased. Tokens add `--pxl-radius-*`, `--pxl-shadow-sm|md` and `--pxl-accent-text`, and remove `--pxl-shadow`, `--pxl-notch`, `--pxl-clip-notch`, `pxl-blink` and `pxl-glitch`.

### Patch Changes

- Updated dependencies [546adf4]
- Updated dependencies [18d5fc6]
  - @pablo-v/core@0.2.0
  - @pablo-v/tokens@0.2.0

## 0.1.0

### Minor Changes

- Initial release.
