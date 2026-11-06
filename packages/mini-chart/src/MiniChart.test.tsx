import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarChart, Sparkline } from './MiniChart.js';

const litPerColumn = (chart: HTMLElement, state: string) =>
  Array.from(
    chart.querySelectorAll('.pxl-chart__col'),
    (col) => col.querySelectorAll(`[data-lit="${state}"]`).length,
  );

describe('BarChart', () => {
  it('lights cells in proportion and keeps small values visible', () => {
    render(<BarChart label="Deploys" data={[0, 1, 50, 100]} rows={10} />);
    const chart = screen.getByRole('img', {
      name: 'Deploys: 4 values, min 0, max 100, latest 100',
    });
    expect(litPerColumn(chart, 'bar')).toEqual([0, 1, 5, 10]);
    expect(chart.querySelectorAll('.pxl-chart__col')[3]).toHaveAttribute('data-highlight');
  });
});

describe('Sparkline', () => {
  it('places one line cell per value between min and max', () => {
    render(
      <Sparkline
        label="Latency"
        data={[
          { label: 'Mon', value: 10 },
          { label: 'Tue', value: 30 },
          { label: 'Wed', value: 20 },
        ]}
        rows={5}
        area
        format={(v) => `${v} ms`}
      />,
    );
    const chart = screen.getByRole('img', { name: /min 10 ms, max 30 ms, latest 20 ms/ });
    const cols = chart.querySelectorAll('.pxl-chart__col');
    const levels = Array.from(cols, (col) =>
      Array.from(col.children).findIndex((c) => c.getAttribute('data-lit') === 'line'),
    );
    expect(levels).toEqual([0, 4, 2]);
    expect(litPerColumn(chart, 'area')).toEqual([0, 4, 2]);
  });

  it('draws a flat series mid-height', () => {
    render(<Sparkline label="Flat" data={[5, 5, 5]} rows={5} />);
    const col = screen.getByRole('img').querySelector('.pxl-chart__col') as HTMLElement;
    expect(Array.from(col.children).findIndex((c) => c.hasAttribute('data-lit'))).toBe(2);
  });
});
