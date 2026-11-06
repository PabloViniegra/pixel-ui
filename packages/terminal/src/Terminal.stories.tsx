import { Badge } from '@pablo-v/badge';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { type LogLine, Terminal } from './Terminal.js';
import '@pablo-v/badge/style.css';
import '@pablo-v/pixel-icons/style.css';
import './terminal.css';

const script: Omit<LogLine, 'id' | 'time'>[] = [
  { level: 'debug', text: '$ pnpm install --frozen-lockfile' },
  { text: 'Lockfile is up to date, resolution step is skipped' },
  { level: 'warn', text: 'WARN  Unsupported engine: wanted node >=22 (current: v20.18.0)' },
  { text: 'Done in 3.8s' },
  { level: 'debug', text: '$ pnpm build' },
  { text: 'Scope: 37 of 39 workspace projects' },
  { text: 'packages/core build$ tsc -b && node ../../scripts/copy-assets.mjs' },
  { text: 'packages/core build: Done' },
  { text: 'packages/button build$ tsc -b && node ../../scripts/copy-assets.mjs' },
  { text: 'packages/button build: Done' },
  { text: 'packages/card build$ tsc -b && node ../../scripts/copy-assets.mjs' },
  { text: 'packages/card build: Done' },
  { level: 'debug', text: '$ pnpm test' },
  { text: ' Test Files  36 passed (36)' },
  { level: 'success', text: '      Tests  84 passed (84)' },
];

function stamp(i: number) {
  const s = 12 + Math.floor(i * 1.3);
  return `14:03:${String(s).padStart(2, '0')}.${String((i * 137) % 1000).padStart(3, '0')}`;
}

const allLines: LogLine[] = script.map((line, i) => ({ ...line, id: i, time: stamp(i) }));

const meta = {
  title: 'Signature/Terminal',
  component: Terminal,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { lines: allLines, title: 'Build logs' },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { status: <Badge tone="success">Ready</Badge> },
};

/** New lines arrive every few hundred ms. Scroll up to pause following. */
export const Streaming: Story = {
  render: function Render(args) {
    const [count, setCount] = useState(1);
    const done = count >= allLines.length;
    useEffect(() => {
      if (done) return;
      const id = setTimeout(() => setCount((c) => c + 1), 280 + Math.random() * 420);
      return () => clearTimeout(id);
    }, [done]);
    return (
      <Terminal
        {...args}
        maxHeight={220}
        lines={allLines.slice(0, count)}
        streaming={!done}
        status={done ? <Badge tone="success">Ready</Badge> : <Badge tone="warning">Building</Badge>}
      />
    );
  },
};

export const WithError: Story = {
  args: {
    lines: [
      ...allLines.slice(0, 9),
      {
        id: 'e1',
        level: 'error',
        time: '14:03:24.551',
        text: "src/Button.tsx(42,7): error TS2339: Property 'size' does not exist on type 'Props'.",
      },
      {
        id: 'e2',
        level: 'error',
        time: '14:03:24.552',
        text: 'packages/button build: Failed',
      },
    ],
    status: <Badge tone="danger">Error</Badge>,
  },
};

export const Empty: Story = { args: { lines: [] } };
