import { MenuItem, MenuSeparator } from '@pablo-v/menu';
import { CopyIcon, DownloadIcon, ShareIcon, TrashIcon } from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { ContextMenu } from './ContextMenu.js';
import '@pablo-v/menu/style.css';
import '@pablo-v/pixel-icons/style.css';
import './context-menu.css';

const meta = {
  title: 'Overlays/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    'aria-label': 'File actions',
    content: (
      <>
        <MenuItem icon={<CopyIcon />} shortcut="⌘C">
          Copy
        </MenuItem>
        <MenuItem icon={<ShareIcon />}>Share</MenuItem>
        <MenuItem icon={<DownloadIcon />}>Download</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<TrashIcon />} tone="danger" shortcut="⌫">
          Delete
        </MenuItem>
      </>
    ),
    children: (
      <div
        tabIndex={0}
        style={{
          display: 'grid',
          placeItems: 'center',
          width: 360,
          height: 200,
          border: '1px dashed var(--pxl-gray-600)',
          borderRadius: 'var(--pxl-radius-lg)',
          color: 'var(--pxl-fg-muted)',
          fontFamily: 'var(--pxl-font-sans)',
          fontSize: 'var(--pxl-text-sm)',
        }}
      >
        Right-click here, or focus and press Shift+F10
      </div>
    ),
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
