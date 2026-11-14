import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Collapsible } from './Collapsible.js';
import '@pablo-v/pixel-icons/style.css';
import './collapsible.css';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    title: 'Advanced settings',
    children: (
      <p style={{ margin: 0, color: 'var(--pxl-fg-muted)', maxWidth: 360, lineHeight: 1.6 }}>
        Build cache, output directory and environment overrides. Most projects never need to change
        these.
      </p>
    ),
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = { args: { defaultOpen: true } };
