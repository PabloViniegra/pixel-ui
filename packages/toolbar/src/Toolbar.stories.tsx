import {
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  TerminalIcon,
  TrashIcon,
  UploadIcon,
} from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from './Toolbar.js';
import '@pablo-v/pixel-icons/style.css';
import './toolbar.css';

const meta = {
  title: 'Navigation/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { 'aria-label': 'File actions' },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
  render: function Render(args) {
    const [view, setView] = useState<'code' | 'logs'>('code');
    return (
      <Toolbar {...args}>
        <ToolbarGroup aria-label="Transfer">
          <ToolbarButton aria-label="Upload">
            <UploadIcon />
          </ToolbarButton>
          <ToolbarButton aria-label="Download">
            <DownloadIcon />
          </ToolbarButton>
          <ToolbarButton aria-label="Copy">
            <CopyIcon />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup aria-label="View">
          <ToolbarButton pressed={view === 'code'} onClick={() => setView('code')}>
            <CodeIcon /> Source
          </ToolbarButton>
          <ToolbarButton pressed={view === 'logs'} onClick={() => setView('logs')}>
            <TerminalIcon /> Logs
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarButton aria-label="Delete" disabled>
          <TrashIcon />
        </ToolbarButton>
      </Toolbar>
    );
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = { args: { orientation: 'vertical' } };
