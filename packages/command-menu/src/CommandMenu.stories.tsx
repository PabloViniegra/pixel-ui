import { Button } from '@pablo-v/button';
import { Kbd } from '@pablo-v/kbd';
import {
  CodeIcon,
  FileIcon,
  HomeIcon,
  MoonIcon,
  SettingsIcon,
  TerminalIcon,
  UploadIcon,
  UserIcon,
} from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { type CommandItem, CommandMenu } from './CommandMenu.js';
import '@pablo-v/button/style.css';
import '@pablo-v/kbd/style.css';
import '@pablo-v/pixel-icons/style.css';
import '@pablo-v/scramble-text/style.css';
import './command-menu.css';

const commands: CommandItem[] = [
  {
    id: 'deploy',
    group: 'Actions',
    label: 'Deploy to production',
    icon: <UploadIcon />,
    shortcut: ['⌘', 'D'],
  },
  {
    id: 'logs',
    group: 'Actions',
    label: 'Open build logs',
    icon: <TerminalIcon />,
    keywords: ['output', 'console'],
  },
  { id: 'source', group: 'Actions', label: 'View source', icon: <CodeIcon /> },
  {
    id: 'home',
    group: 'Navigate',
    label: 'Go to dashboard',
    icon: <HomeIcon />,
    shortcut: ['G', 'H'],
  },
  { id: 'docs', group: 'Navigate', label: 'Documentation', icon: <FileIcon />, keywords: ['help'] },
  { id: 'account', group: 'Navigate', label: 'Account', icon: <UserIcon /> },
  {
    id: 'theme',
    group: 'Settings',
    label: 'Toggle dark mode',
    icon: <MoonIcon />,
    shortcut: ['⌘', 'J'],
  },
  { id: 'billing', group: 'Settings', label: 'Billing', icon: <SettingsIcon />, disabled: true },
];

const meta = {
  title: 'Signature/CommandMenu',
  component: CommandMenu,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { commands },
} satisfies Meta<typeof CommandMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [last, setLast] = useState<string>();
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <CommandMenu
          {...args}
          commands={args.commands.map((c) => ({ ...c, onSelect: () => setLast(c.label) }))}
          trigger={
            <Button variant="secondary" iconEnd={<Kbd size="sm" keys={['⌘', 'K']} />}>
              Search…
            </Button>
          }
        />
        <p style={{ margin: 0, color: 'var(--pxl-fg-muted)', fontSize: 'var(--pxl-text-sm)' }}>
          {last ? `Ran “${last}”` : 'Press ⌘K or Ctrl+K anywhere.'}
        </p>
      </div>
    );
  },
};

export const Open: Story = { args: { defaultOpen: true, hotkey: false } };
