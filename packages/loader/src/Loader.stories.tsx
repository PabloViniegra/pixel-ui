import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Loader } from './Loader.js';
import './loader.css';

const meta = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  argTypes: {
    pattern: { control: 'inline-radio', options: ['snake', 'pulse', 'scan'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Patterns: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
      <Loader {...args} pattern="snake" size="lg" />
      <Loader {...args} pattern="pulse" size="lg" />
      <Loader {...args} pattern="scan" size="lg" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <Loader {...args} size="sm" />
      <Loader {...args} size="md" />
      <Loader {...args} size="lg" />
    </div>
  ),
};

export const Coloured: Story = {
  args: { size: 'lg', style: { color: 'var(--pxl-accent)' } },
};
