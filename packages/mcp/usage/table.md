Use for tabular data that people compare across rows and columns.

- These are styled primitives over native table elements. Sorting, filtering, selection and paging are yours to implement; pair it with `Pagination`, `Checkbox` and `Input`.
- Always include `TableHead` with `TableHeader` cells. Align numbers with `align="end"` and use `mono` for ids, hashes and figures.
- `density="compact"` for dense dashboards; `stickyHeader` when the table scrolls vertically inside a bounded height.
- `TableRow selected` is visual only; pair it with a checkbox.
- A list of rich items is not a table: use cards or a plain list.
