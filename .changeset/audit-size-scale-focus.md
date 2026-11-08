---

"@pablo-v/card": minor
"@pablo-v/tokens": patch
"@pablo-v/accordion": patch
"@pablo-v/alert": patch
"@pablo-v/autocomplete": patch
"@pablo-v/badge": patch
"@pablo-v/button": patch
"@pablo-v/calendar": patch
"@pablo-v/checkbox": patch
"@pablo-v/chip": patch
"@pablo-v/command-menu": patch
"@pablo-v/dialog": patch
"@pablo-v/field": patch
"@pablo-v/input": patch
"@pablo-v/kbd": patch
"@pablo-v/link": patch
"@pablo-v/menu": patch
"@pablo-v/mini-chart": patch
"@pablo-v/multi-select": patch
"@pablo-v/progress": patch
"@pablo-v/radio": patch
"@pablo-v/select": patch
"@pablo-v/skeleton": patch
"@pablo-v/slider": patch
"@pablo-v/switch": patch
"@pablo-v/table": patch
"@pablo-v/tabs": patch
"@pablo-v/terminal": patch
"@pablo-v/textarea": patch
"@pablo-v/toast": patch
---

Design audit fixes:

- tokens: add the `--pxl-size-xs/sm/md/lg` control heights (24/32/40/48px) and `--pxl-opacity-disabled`. Components now take their heights and disabled opacity from these tokens.
- card: add `CardLink`, a stretched link that makes the whole card clickable, and `CardTitle pixel`. Titles are now sans by default. `interactive` is deprecated.
- input, select, textarea: a single focus ring, with the outline only for keyboard focus; affixes, chevrons, field dots and selection labels no longer turn accent; fields use 16px text on coarse pointers so iOS does not zoom.
- switch, chip: hit areas of at least 24px, and the switch changes tone on hover when on.
- link: the resting underline uses a `currentColor` mix that stays visible in dark mode.
- progress, slider: unlit cells are `gray-400` with a thin border; mini-chart ink uses `fg-muted`.
- terminal text is 13px; the skeleton sweep and table row hover are more visible in dark mode.
