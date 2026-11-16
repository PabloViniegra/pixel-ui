---
"@pablo-v/input": patch
"@pablo-v/date-picker": patch
"@pablo-v/mcp": patch
---

Move the square affix button style into `@pablo-v/input` (`.pxl-input__affix-button`) so `DatePicker`, `SearchInput` and `PasswordInput` share one definition. `DatePicker` keeps its `pxl-date-picker__trigger` class for overrides.
