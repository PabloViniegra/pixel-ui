# @pablo-v/badge

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
