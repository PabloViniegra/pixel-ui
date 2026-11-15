import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Dialog, DialogClose } from './Dialog.js';
import '@pablo-v/button/style.css';
import '@pablo-v/pixel-icons/style.css';
import './dialog.css';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    pixelui: { name: pkg.name, version: pkg.version },
    docs: {
      description: {
        component:
          'Use Dialog for general modal content: details, forms or settings. It accepts any body and footer. By default, Escape, a backdrop click and the close button dismiss it. Use AlertDialog for an important confirmation with built-in Cancel/Confirm actions; use Alert for an inline message.',
      },
    },
  },
  args: {
    title: 'Deployment details',
    description: 'Review the latest deployment without leaving the project.',
    trigger: <Button variant="secondary">View deployment</Button>,
    children: (
      <dl style={{ margin: 0, display: 'grid', gap: 8 }}>
        <dt>Project</dt>
        <dd style={{ margin: 0 }}>acme-web</dd>
        <dt>Environment</dt>
        <dd style={{ margin: 0 }}>Production</dd>
      </dl>
    ),
    footer: (
      <DialogClose>
        <Button variant="secondary">Done</Button>
      </DialogClose>
    ),
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Open the details, then try Escape, clicking outside the panel, the close button or Done. Dialog provides the modal container; its body and actions are supplied by the caller.',
      },
    },
  },
};

export const WithBody: Story = {
  args: {
    title: 'Environment variables',
    description: undefined,
    size: 'lg',
    trigger: <Button variant="secondary">Edit variables</Button>,
    children: (
      <p style={{ margin: 0, color: 'var(--pxl-fg-muted)' }}>
        Changes apply to the next deployment. Existing deployments keep the values they were built
        with.
      </p>
    ),
  },
};
