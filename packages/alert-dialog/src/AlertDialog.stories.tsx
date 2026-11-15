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
  parameters: {
    pixelui: { name: pkg.name, version: pkg.version },
    docs: {
      description: {
        component:
          'Use AlertDialog to ask for an explicit decision before an important action. It is a modal with the alertdialog role, required title and description, and built-in Cancel/Confirm buttons. Focus starts on Cancel, Escape cancels and backdrop clicks do nothing. Use Dialog for general modal content; use Alert for an inline message.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <p style={{ marginTop: 0 }}>
        Confirm an important action. Open the dialog: Cancel receives focus, clicking outside keeps
        it open, and Escape cancels. While a confirmation is pending, cancellation is blocked.
      </p>
      <AlertDialog {...args} />
    </div>
  ),
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

export const Default: Story = {
  name: 'Confirm destructive action',
  parameters: {
    docs: {
      description: {
        story:
          'This demo does not delete a real project. Confirm closes the dialog; Cancel or Escape cancels. Clicking the backdrop leaves the decision open.',
      },
    },
  },
};

export const AsyncConfirm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Click Revoke and watch the loading state for 1.5 seconds. Cancel and Escape are blocked while the promise is pending. Resolution closes the dialog; rejection leaves it open.',
      },
    },
  },
  args: {
    title: 'Revoke token?',
    description: 'Scripts using this token will stop working immediately.',
    confirmLabel: 'Revoke',
    trigger: <Button variant="secondary">Revoke token</Button>,
    onConfirm: () => new Promise((resolve) => setTimeout(resolve, 1500)),
  },
};
