import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import pkg from '../package.json' with { type: 'json' };
import { Button } from './Button.js';
import './button.css';

const Arrow = () => (
  <svg viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
    <path d="M3 1h1v1h1v1h1v1h1v1H6v1H5v1H4v1H3V6h1V5H1V3h3V2H3z" />
  </svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { children: 'Deploy', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconStart: { control: false },
    iconEnd: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Delete
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { iconEnd: <Arrow />, children: 'Continue' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Building' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
