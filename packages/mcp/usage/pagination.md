Use to move through a long list split into pages.

- Pages are 1-based; `total` is the number of pages, not of items.
- Pass `getHref` when pages have URLs (routed or server-rendered lists) so the controls are real links; otherwise use `page` and `onPageChange`.
- Place it under the list it controls. For feeds where position does not matter, a "Load more" `Button` is simpler.
