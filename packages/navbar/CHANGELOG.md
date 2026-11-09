# @pablo-v/navbar

## 0.1.2

### Patch Changes

- 1b8a9f9: Overlays animate out as well as in. Dialog transitions in and out; Popover, Menu, DatePicker and the Navbar dropdown fade out before unmounting; dismissed toasts collapse so the stack closes up. Floating panels scale from the point facing their anchor, and a tooltip shown right after another skips its delay and animation. Colour previews keep their colours in forced-colours mode.
- Updated dependencies [1b8a9f9]
  - @pablo-v/core@0.2.1

## 0.1.1

### Patch Changes

- 3ebf115: Apply the second design audit: unlit progress and slider cells use `gray-300` so lit and unlit cells stay above 3:1; small and large inputs and selects get 16px text on touch screens; colour hairlines use `fg` instead of black, ColorSlider matches Slider measurements and the selected swatch keeps its ring under focus and forced colours; the current page in Pagination and the Navbar menu uses neutral marks; Toolbar spacing snaps to the 4px grid. Adds the `--pxl-thumb-ring` token.

## 0.1.0

### Minor Changes

- bd5c3f5: Add ColorArea, ColorSlider, ColorField, ColorSwatch, ColorSwatchPicker and ColorPicker (`@pablo-v/color`), Pagination, Navbar and Toolbar.
