import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Alert } from './Alert.js';
import '@pablo-v/button/style.css';
import '@pablo-v/pixel-icons/style.css';
import './alert.css';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    title: 'Build cache cleared',
    children: 'The next deployment will rebuild every dependency from scratch.',
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
  },
  render: (args) => (
    <div style={{ width: 'min(520px, calc(100vw - 32px))' }}>
      <Alert {...args} />
    </div>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 'min(520px, calc(100vw - 32px))' }}>
      <Alert tone="accent" title="New region available">
        Deploy functions to Tokyo (hnd1).
      </Alert>
      <Alert tone="success" title="Domain verified" />
      <Alert tone="warning" title="Usage at 90%">
        You will reach the bandwidth limit in about three days.
      </Alert>
      <Alert tone="danger" title="Deployment failed">
        Command “pnpm build” exited with 1.
      </Alert>
    </div>
  ),
};

export const WithActions: Story = {
  args: {
    tone: 'danger',
    title: 'Deployment failed',
    children: 'Command “pnpm build” exited with 1.',
    action: (
      <Button size="sm" variant="secondary">
        Retry
      </Button>
    ),
    onDismiss: () => {},
  },
};
