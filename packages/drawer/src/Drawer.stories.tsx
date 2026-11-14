import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Drawer, DrawerClose } from './Drawer.js';
import '@pablo-v/button/style.css';
import '@pablo-v/pixel-icons/style.css';
import './drawer.css';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    title: 'Deployment settings',
    description: 'Changes apply to the next deployment of acme-web.',
    trigger: <Button variant="secondary">Open settings</Button>,
    children: (
      <p style={{ margin: 0 }}>
        Build command, output directory and environment variables live here.
      </p>
    ),
    footer: (
      <>
        <DrawerClose>
          <Button variant="secondary">Cancel</Button>
        </DrawerClose>
        <DrawerClose>
          <Button>Save</Button>
        </DrawerClose>
      </>
    ),
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bottom: Story = { args: { side: 'bottom', size: 'sm' } };

export const Left: Story = { args: { side: 'left', footer: undefined } };
