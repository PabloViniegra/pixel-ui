---

"@pablo-v/tokens": patch
"@pablo-v/button": patch
"@pablo-v/badge": patch
"@pablo-v/terminal": patch
---

Accessibility and layout-stability fixes:

- tokens: add a metric-matched `Geist Fallback` face to `--pxl-font-sans` so the font swap no longer shifts layout, and split each font into a Latin file and an extended file selected by `unicode-range`, so Latin-only pages skip the extended files.
- button: `loading` now sets `aria-disabled` instead of `disabled`, so the button keeps focus; clicks and form submission are blocked while loading, and the dots overlay the label so the width stays the same.
- badge: subtle success, warning, danger and neutral text is darkened to reach 4.5:1, and accent text uses `accent-text`.
- terminal: success and error text reach 4.5:1, and the cursor stops blinking after five seconds.
