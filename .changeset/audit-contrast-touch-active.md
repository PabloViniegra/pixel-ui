---
"@pablo-v/tokens": patch
"@pablo-v/progress": patch
"@pablo-v/slider": patch
"@pablo-v/input": patch
"@pablo-v/select": patch
"@pablo-v/color": patch
"@pablo-v/pagination": patch
"@pablo-v/navbar": patch
"@pablo-v/toolbar": patch
---

Apply the second design audit: unlit progress and slider cells use `gray-300` so lit and unlit cells stay above 3:1; small and large inputs and selects get 16px text on touch screens; colour hairlines use `fg` instead of black, ColorSlider matches Slider measurements and the selected swatch keeps its ring under focus and forced colours; the current page in Pagination and the Navbar menu uses neutral marks; Toolbar spacing snaps to the 4px grid. Adds the `--pxl-thumb-ring` token.
