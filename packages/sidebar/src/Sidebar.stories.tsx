import {
  BellIcon,
  DatabaseIcon,
  FolderIcon,
  HomeIcon,
  SettingsIcon,
  UserIcon,
} from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarToggle,
} from './Sidebar.js';
import '@pablo-v/pixel-icons/style.css';
import './sidebar.css';

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version }, layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ height: 520, display: 'flex' }}>{Story()}</div>],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Sidebar {...args}>
      <SidebarHeader>
        <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>acme</strong>
        <SidebarToggle />
      </SidebarHeader>
      <SidebarContent aria-label="Main">
        <SidebarGroup>
          <SidebarItem href="#" icon={<HomeIcon />} current>
            Overview
          </SidebarItem>
          <SidebarItem href="#" icon={<FolderIcon />} badge="12">
            Projects
          </SidebarItem>
          <SidebarItem href="#" icon={<DatabaseIcon />}>
            Storage
          </SidebarItem>
        </SidebarGroup>
        <SidebarGroup label="Account">
          <SidebarItem href="#" icon={<BellIcon />} badge="3">
            Notifications
          </SidebarItem>
          <SidebarItem href="#" icon={<SettingsIcon />}>
            Settings
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup style={{ width: '100%' }}>
          <SidebarItem icon={<UserIcon />}>Ada Lovelace</SidebarItem>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  ),
};

export const Collapsed: Story = { ...Default, args: { defaultCollapsed: true } };
