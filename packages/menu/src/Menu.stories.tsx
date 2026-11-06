import { Button } from '@pablo-v/button';
import {
  CodeIcon,
  CopyIcon,
  ExternalLinkIcon,
  MoreIcon,
  SettingsIcon,
  TrashIcon,
} from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Dropdown, Menu, MenuGroup, MenuItem, MenuSeparator } from './Menu.js';
import '@pablo-v/button/style.css';
import '@pablo-v/pixel-icons/style.css';
import './menu.css';

const items = (
  <>
    <MenuGroup label="Deployment">
      <MenuItem icon={<ExternalLinkIcon />} shortcut="⌘O">
        Visit
      </MenuItem>
      <MenuItem icon={<CopyIcon />} shortcut="⌘C">
        Copy URL
      </MenuItem>
      <MenuItem icon={<CodeIcon />}>View source</MenuItem>
      <MenuItem icon={<SettingsIcon />} disabled>
        Promote to production
      </MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuItem icon={<TrashIcon />} tone="danger" shortcut="⌘⌫">
      Delete
    </MenuItem>
  </>
);

const meta = {
  title: 'Overlays/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    trigger: (
      <Button variant="secondary" aria-label="Deployment actions" iconStart={<MoreIcon />} />
    ),
    children: items,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => (
    <div style={{ padding: 48, minHeight: 320 }}>
      <Dropdown {...args} />
    </div>
  ),
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InlineMenu: Story = {
  name: 'Menu (inline)',
  render: () => <Menu style={{ width: 260 }}>{items}</Menu>,
};
