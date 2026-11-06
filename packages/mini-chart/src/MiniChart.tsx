import { cx, litCells, type PixelTone } from '@pixel-ui/core';
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

export type ChartDatum = number | { label: string; value: number };

interface Point {
  label: string | undefined;
  value: number;
}

const toPoints = (data: readonly ChartDatum[]): Point[] =>
  data.map((d) => (typeof d === 'number' ? { label: undefined, value: d } : d));

interface BaseProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  data: readonly ChartDatum[];
  /** What the chart shows, e.g. "Requests, last 24 hours". Starts the accessible summary. */
  label: string;
  /** Cell rows; the vertical resolution. */
  rows?: number;
  /** Side of one cell in px. */
  cellSize?: number;
  /** Tone of the highlighted column. @default 'accent' */
  tone?: PixelTone;
  /** Which column carries the tone; the rest stay neutral. @default 'last' */
  highlight?: 'last' | 'max' | 'none' | number;
  /** Formats values in the hover readout and the summary. */
  format?: (value: number) => string;
}

function summarise(label: string, points: Point[], format: (v: number) => string): string {
  if (points.length === 0) return `${label}: no data`;
  const values = points.map((p) => p.value);
  const last = values[values.length - 1] ?? 0;
  return `${label}: ${points.length} values, min ${format(Math.min(...values))}, max ${format(Math.max(...values))}, latest ${format(last)}`;
}

function highlightIndex(highlight: BaseProps['highlight'], points: Point[]): number {
  if (highlight === 'none') return -1;
  if (highlight === 'last') return points.length - 1;
  if (highlight === 'max') {
    const values = points.map((p) => p.value);
    return values.indexOf(Math.max(...values));
  }
  return highlight ?? -1;
}

interface FrameProps extends ComponentPropsWithRef<'div'> {
  kind: 'bar' | 'spark';
  summary: string;
  rows: number;
  cellSize: number;
  tone: PixelTone;
  count: number;
}

function Frame({
  kind,
  summary,
  rows,
  cellSize,
  tone,
  count,
  className,
  style,
  ...rest
}: FrameProps) {
  return (
    <div
      role="img"
      aria-label={summary}
      className={cx('pxl-chart', className)}
      data-kind={kind}
      data-tone={tone}
      style={
        { '--_rows': rows, '--_cols': count, '--_cell': `${cellSize}px`, ...style } as CSSProperties
      }
      {...rest}
    />
  );
}

function Column({
  index,
  count,
  point,
  format,
  highlighted,
  children,
}: {
  index: number;
  count: number;
  point: Point;
  format: (v: number) => string;
  highlighted: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className="pxl-chart__col"
      data-highlight={highlighted || undefined}
      data-edge={index >= count / 2 ? 'end' : 'start'}
    >
      {children}
      <span className="pxl-chart__tip" aria-hidden="true">
        {point.label && <span className="pxl-chart__tip-label">{point.label}</span>}
        {format(point.value)}
      </span>
    </span>
  );
}

const cells = (rows: number, state: (row: number) => string | undefined) =>
  Array.from({ length: rows }, (_, row) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid, the row is the identity
    <span key={row} className="pxl-chart__cell" data-lit={state(row)} />
  ));

export interface BarChartProps extends BaseProps {
  /** Top of the scale. @default the largest value */
  max?: number;
}

/**
 * Column chart drawn in cells, using the same lit-cell rounding as Progress.
 * Values are magnitudes from zero; negatives are drawn as zero.
 */
export function BarChart({
  data,
  max,
  rows = 8,
  cellSize = 6,
  tone = 'accent',
  highlight = 'last',
  format = String,
  label,
  ...rest
}: BarChartProps) {
  const points = toPoints(data);
  const top = max ?? Math.max(0, ...points.map((p) => p.value));
  const marked = highlightIndex(highlight, points);
  return (
    <Frame
      kind="bar"
      rows={rows}
      cellSize={cellSize}
      tone={tone}
      count={points.length}
      summary={summarise(label, points, format)}
      {...rest}
    >
      {points.map((point, i) => {
        // Anything above zero keeps at least one cell, so small values never read as none.
        const lit = point.value > 0 ? Math.max(1, litCells(point.value, top, rows)) : 0;
        return (
          <Column
            // biome-ignore lint/suspicious/noArrayIndexKey: series position is the identity
            key={i}
            index={i}
            count={points.length}
            point={point}
            format={format}
            highlighted={i === marked}
          >
            {cells(rows, (row) => (row < lit ? 'bar' : undefined))}
          </Column>
        );
      })}
    </Frame>
  );
}

export interface SparklineProps extends BaseProps {
  /** Lights the cells under the line too. @default false */
  area?: boolean;
}

/** Trend line as a dot-matrix: one lit cell per value, scaled between the series' min and max. */
export function Sparkline({
  data,
  rows = 6,
  cellSize = 4,
  tone = 'accent',
  highlight = 'last',
  area = false,
  format = String,
  label,
  ...rest
}: SparklineProps) {
  const points = toPoints(data);
  const values = points.map((p) => p.value);
  const lo = Math.min(...values);
  const span = Math.max(...values) - lo;
  const marked = highlightIndex(highlight, points);
  return (
    <Frame
      kind="spark"
      rows={rows}
      cellSize={cellSize}
      tone={tone}
      count={points.length}
      summary={summarise(label, points, format)}
      {...rest}
    >
      {points.map((point, i) => {
        const level =
          span > 0 ? Math.round(((point.value - lo) / span) * (rows - 1)) : (rows - 1) >> 1;
        return (
          <Column
            // biome-ignore lint/suspicious/noArrayIndexKey: series position is the identity
            key={i}
            index={i}
            count={points.length}
            point={point}
            format={format}
            highlighted={i === marked}
          >
            {cells(rows, (row) =>
              row === level ? 'line' : area && row < level ? 'area' : undefined,
            )}
          </Column>
        );
      })}
    </Frame>
  );
}
