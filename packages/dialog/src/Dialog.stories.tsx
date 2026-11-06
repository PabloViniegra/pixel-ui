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
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    title: 'Delete project',
    description: 'acme-web and its 214 deployments will be removed. This cannot be undone.',
    trigger: <Button variant="danger">Delete project</Button>,
    footer: (
      <>
        <DialogClose>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose>
          <Button variant="danger">Delete</Button>
        </DialogClose>
      </>
    ),
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
