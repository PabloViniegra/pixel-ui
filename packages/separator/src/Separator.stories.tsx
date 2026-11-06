import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Separator } from './Separator.js';
import './separator.css';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'inline-radio', options: ['solid', 'pixel'] },
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Separator {...args} />
    </div>
  ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pixel: Story = { args: { variant: 'pixel' } };

export const WithLabel: Story = { args: { label: 'or continue with' } };

export const Vertical: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        height: 20,
        fontSize: 'var(--pxl-text-sm)',
      }}
    >
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Guides</span>
      <Separator orientation="vertical" variant="pixel" />
      <span>Changelog</span>
    </div>
  ),
};
