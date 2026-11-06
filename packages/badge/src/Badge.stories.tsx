import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Badge } from './Badge.js';
import './badge.css';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger'] as const;

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { children: 'Ready', tone: 'success', dot: true },
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    appearance: { control: 'inline-radio', options: ['subtle', 'solid'] },
    dot: { control: 'inline-radio', options: [false, true, 'pulse'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['subtle', 'solid'] as const).map((appearance) => (
        <div key={appearance} style={{ display: 'flex', gap: 8 }}>
          {tones.map((tone) => (
            <Badge key={tone} {...args} tone={tone} appearance={appearance}>
              {tone}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const DeploymentStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge tone="warning" dot="pulse">
        Building
      </Badge>
      <Badge tone="success" dot>
        Ready
      </Badge>
      <Badge tone="danger" dot>
        Error
      </Badge>
      <Badge tone="neutral" dot>
        Queued
      </Badge>
    </div>
  ),
};
