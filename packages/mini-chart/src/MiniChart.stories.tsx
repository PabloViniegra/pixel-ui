import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { BarChart, Sparkline } from './MiniChart.js';
import './mini-chart.css';

const hours = [
  42, 38, 35, 31, 30, 34, 48, 77, 102, 118, 126, 131, 129, 124, 120, 117, 121, 134, 140, 128, 104,
  86, 63, 51,
];
const hourly = hours.map((value, h) => ({ label: `${String(h).padStart(2, '0')}:00`, value }));
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const deploys = [12, 18, 9, 22, 27, 4, 3].map((value, i) => ({ label: days[i] ?? '', value }));
const latency = [182, 176, 190, 171, 165, 168, 159, 151, 149, 155, 143, 138];

const meta = {
  title: 'Signature/MiniChart',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { label: 'Requests per hour', data: hourly },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SparklineDefault: Story = { name: 'Sparkline' };

export const SparklineArea: Story = { name: 'Sparkline with area', args: { area: true, rows: 8 } };

export const Bars: Story = {
  render: () => (
    <BarChart
      label="Deploys this week"
      data={deploys}
      highlight="max"
      cellSize={10}
      rows={10}
      format={(v) => `${v} deploys`}
    />
  ),
};

function StatTile({
  label,
  value,
  delta,
  children,
}: {
  label: string;
  value: string;
  delta: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--pxl-space-2)',
        padding: 'var(--pxl-space-4)',
        border: '1px solid var(--pxl-border)',
        borderRadius: 'var(--pxl-radius-lg)',
        minWidth: 200,
      }}
    >
      <span style={{ color: 'var(--pxl-fg-muted)', fontSize: 'var(--pxl-text-sm)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div
            style={{
              fontSize: 'var(--pxl-text-2xl)',
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </div>
          <div style={{ color: 'var(--pxl-fg-muted)', fontSize: 'var(--pxl-text-xs)' }}>
            {delta}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Stat tiles: the number leads, the chart gives it a shape. */
export const KpiRow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--pxl-space-4)' }}>
      <StatTile label="Requests" value="2.4M" delta="+12% vs last week">
        <Sparkline label="Requests per hour" data={hourly} cellSize={3} />
      </StatTile>
      <StatTile label="p95 latency" value="138 ms" delta="−24% vs last week">
        <Sparkline
          label="p95 latency, last 12 days"
          data={latency}
          tone="success"
          format={(v) => `${v} ms`}
        />
      </StatTile>
      <StatTile label="Deploys" value="95" delta="Peak on Friday">
        <BarChart label="Deploys this week" data={deploys} highlight="max" rows={6} />
      </StatTile>
    </div>
  ),
};
