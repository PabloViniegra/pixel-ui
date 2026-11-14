# @pablo-v/color

## 0.1.3

### Patch Changes

- Improve small screens, touch and rendering cost: floating panels stay within the viewport and above the on-screen keyboard, Alert and Stepper adapt to their container width and now fill it, rows wrap instead of overflowing, touch targets grow on coarse pointers, hover effects only apply on devices that hover, safe-area insets are respected, and list rows and animations re-render less.
- Updated dependencies
- Updated dependencies
  - @pablo-v/popover@1.0.2
  - @pablo-v/field@1.1.2
  - @pablo-v/core@0.2.2

## 0.1.2

### Patch Changes

- 1b8a9f9: Overlays animate out as well as in. Dialog transitions in and out; Popover, Menu, DatePicker and the Navbar dropdown fade out before unmounting; dismissed toasts collapse so the stack closes up. Floating panels scale from the point facing their anchor, and a tooltip shown right after another skips its delay and animation. Colour previews keep their colours in forced-colours mode.
- Updated dependencies [1b8a9f9]
  - @pablo-v/core@0.2.1
  - @pablo-v/popover@1.0.1

## 0.1.1

### Patch Changes

- 3ebf115: Apply the second design audit: unlit progress and slider cells use `gray-300` so lit and unlit cells stay above 3:1; small and large inputs and selects get 16px text on touch screens; colour hairlines use `fg` instead of black, ColorSlider matches Slider measurements and the selected swatch keeps its ring under focus and forced colours; the current page in Pagination and the Navbar menu uses neutral marks; Toolbar spacing snaps to the 4px grid. Adds the `--pxl-thumb-ring` token.
- Updated dependencies [3ebf115]
  - @pablo-v/input@1.0.2

## 0.1.0

### Minor Changes

- bd5c3f5: Add ColorArea, ColorSlider, ColorField, ColorSwatch, ColorSwatchPicker and ColorPicker (`@pablo-v/color`), Pagination, Navbar and Toolbar.
