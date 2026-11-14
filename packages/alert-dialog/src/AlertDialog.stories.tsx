import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { AlertDialog } from './AlertDialog.js';
import '@pablo-v/button/style.css';
import './alert-dialog.css';

const meta = {
  title: 'Overlays/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    title: 'Delete acme-web?',
    description: 'The project and its 214 deployments will be removed. This cannot be undone.',
    confirmLabel: 'Delete project',
    tone: 'danger',
    trigger: <Button variant="danger">Delete project</Button>,
  },
  argTypes: { tone: { control: 'inline-radio', options: ['default', 'danger'] } },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsyncConfirm: Story = {
  args: {
    title: 'Revoke token?',
    description: 'Scripts using this token will stop working immediately.',
    confirmLabel: 'Revoke',
    trigger: <Button variant="secondary">Revoke token</Button>,
    onConfirm: () => new Promise((resolve) => setTimeout(resolve, 1500)),
  },
};
