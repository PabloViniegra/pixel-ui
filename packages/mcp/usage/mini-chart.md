Use `Sparkline` for a trend and `BarChart` for a few magnitudes inside cards, table cells and stat tiles.

- They are glanceable summaries with no axes, legends or multiple series. For analysis-grade charts use a charting library.
- `label` is required and should say what is measured and over what period; it starts the screen-reader summary.
- Pass `format` so values read with their unit. `highlight` marks one column; keep the default `last` for time series.
- `BarChart` treats negatives as zero.
