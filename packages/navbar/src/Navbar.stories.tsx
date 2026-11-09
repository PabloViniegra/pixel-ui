import { Button } from '@pablo-v/button';
import { CodeIcon, FolderIcon, TerminalIcon } from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Navbar, NavbarLink, NavbarMenu, NavbarMenuLink } from './Navbar.js';
import '@pablo-v/button/style.css';
import '@pablo-v/pixel-icons/style.css';
import './navbar.css';

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version }, layout: 'fullscreen' },
  args: {
    brand: <strong>Acme</strong>,
    actions: (
      <Button size="sm" variant="secondary">
        Sign in
      </Button>
    ),
  },
  render: (args) => (
    <div style={{ minHeight: 300, paddingTop: 48 }}>
      <Navbar {...args}>
        <NavbarLink href="#overview" current>
          Overview
        </NavbarLink>
        <NavbarMenu label="Products">
          <NavbarMenuLink
            href="#hosting"
            icon={<FolderIcon />}
            description="Deploy from Git in seconds."
          >
            Hosting
          </NavbarMenuLink>
          <NavbarMenuLink
            href="#functions"
            icon={<CodeIcon />}
            description="Run code close to your users."
          >
            Functions
          </NavbarMenuLink>
          <NavbarMenuLink
            href="#logs"
            icon={<TerminalIcon />}
            description="Search and stream every request."
          >
            Logs
          </NavbarMenuLink>
        </NavbarMenu>
        <NavbarMenu label="Resources">
          <NavbarMenuLink href="#docs">Docs</NavbarMenuLink>
          <NavbarMenuLink href="#changelog">Changelog</NavbarMenuLink>
        </NavbarMenu>
        <NavbarLink href="#pricing">Pricing</NavbarLink>
      </Navbar>
    </div>
  ),
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
};
