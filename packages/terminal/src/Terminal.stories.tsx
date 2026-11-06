import { Badge } from '@pixel-ui/badge';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { type LogLine, Terminal } from './Terminal.js';
import '@pixel-ui/badge/style.css';
import '@pixel-ui/pixel-icons/style.css';
import './terminal.css';

const script: Omit<LogLine, 'id' | 'time'>[] = [
  { level: 'debug', text: 'Running build in Washington, D.C. (iad1)' },
  { text: 'Cloning github.com/pixel-ui/app (branch: main, commit: 4f2a91c)' },
  { text: 'Cloning completed: 412ms' },
  { text: 'Restored build cache from previous deployment' },
  { text: 'Running "pnpm install"' },
  { level: 'warn', text: 'WARN  deprecated inflight@1.0.6: This module is not supported' },
  { text: 'Packages: +1203' },
  { text: 'Running "pnpm build"' },
  { text: '▲ Next.js 16.0.1' },
  { text: '   Creating an optimized production build ...' },
  { level: 'success', text: ' ✓ Compiled successfully in 8.4s' },
  { text: '   Collecting page data ...' },
  { text: ' ✓ Generating static pages (24/24)' },
  { text: 'Build Completed in /vercel/output [21s]' },
  { text: 'Deploying outputs...' },
  { level: 'success', text: 'Deployment completed' },
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
      ...allLines.slice(0, 8),
      {
        id: 'e1',
        level: 'error',
        time: '14:03:24.551',
        text: "Type error: Property 'size' does not exist on type 'Props'.",
      },
      {
        id: 'e2',
        level: 'error',
        time: '14:03:24.552',
        text: 'Error: Command "pnpm build" exited with 1',
      },
    ],
    status: <Badge tone="danger">Error</Badge>,
  },
};

export const Empty: Story = { args: { lines: [] } };
