Use to dissolve between two states of the page through a pixel grid: route changes, theme switches, swapping a main view.

- Wrap the state update: `startPixelTransition(() => setView(next))`. Without View Transitions support or with reduced motion the update simply applies.
- `scope: 'elements'` limits the dissolve to regions wrapped in `<PixelTransition>`; the default `page` dissolves the whole document.
- Reserve it for significant changes; frequent small updates should not transition.
