import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Tooltip } from './Tooltip.js';
import '@pablo-v/button/style.css';
import './tooltip.css';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    content: 'Redeploy with the existing build cache',
    children: <Button variant="secondary">Redeploy</Button>,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => (
    <div style={{ padding: 64, display: 'grid', placeItems: 'center' }}>
      <Tooltip {...args} />
    </div>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sides: Story = {
  render: (args) => (
    <div style={{ padding: 64, display: 'flex', gap: 16, justifyContent: 'center' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} {...args} side={side} content={`Opens on the ${side}`}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
