import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Kbd } from './Kbd.js';
import './kbd.css';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { keys: ['⌘', 'K'] },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Combination: Story = {};

export const InText: Story = {
  render: () => (
    <p style={{ margin: 0, color: 'var(--pxl-fg-muted)', fontSize: 'var(--pxl-text-sm)' }}>
      Press <Kbd>Esc</Kbd> to close, or <Kbd keys={['⌘', '⏎']} /> to deploy.
    </p>
  ),
};
