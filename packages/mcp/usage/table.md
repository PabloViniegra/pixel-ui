Use for tabular data that people compare across rows and columns.

- These are styled primitives over native table elements. Filtering and paging are yours to implement; pair it with `Pagination` and `SearchInput`.
- Always include `TableHead` with `TableHeader` cells. Align numbers with `align="end"` and use `mono` for ids, hashes and figures.
- Sorting: give a `TableHeader` `onSort` to make it a button and `sort` (`ascending`, `descending` or `none`) to set its `aria-sort` and arrow. The table never reorders rows: sort the data yourself and pass the new direction back. Only one column is sorted at a time.
- Selection: put a `Checkbox` with an `aria-label` in the first cell of each row and set `TableRow selected` for the highlight. A header checkbox selects all and is `indeterminate` while only some rows are selected. `selected` alone is visual only.
- `density="compact"` for dense dashboards; `stickyHeader` when the table scrolls vertically inside a bounded height.
- A list of rich items is not a table: use cards or a plain list.
