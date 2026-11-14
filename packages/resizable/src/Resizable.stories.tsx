import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { ResizablePanel, ResizablePanels } from './Resizable.js';
import './resizable.css';

const Pane = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: '100%',
      color: 'var(--pxl-fg-muted)',
      fontFamily: 'var(--pxl-font-mono)',
      fontSize: 'var(--pxl-text-sm)',
    }}
  >
    {children}
  </div>
);

const frame = {
  width: 640,
  maxWidth: '100%',
  height: 320,
  border: '1px solid var(--pxl-border)',
  borderRadius: 'var(--pxl-radius-lg)',
  overflow: 'hidden',
} as const;

const meta = {
  title: 'Components/ResizablePanels',
  component: ResizablePanels,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
} satisfies Meta<typeof ResizablePanels>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={frame}>
      <ResizablePanels {...args}>
        <ResizablePanel defaultSize={25} minSize={15}>
          <Pane>sidebar</Pane>
        </ResizablePanel>
        <ResizablePanel minSize={30}>
          <Pane>editor</Pane>
        </ResizablePanel>
      </ResizablePanels>
    </div>
  ),
};

export const Nested: Story = {
  render: (args) => (
    <div style={frame}>
      <ResizablePanels {...args}>
        <ResizablePanel defaultSize={30}>
          <Pane>files</Pane>
        </ResizablePanel>
        <ResizablePanel>
          <ResizablePanels orientation="vertical">
            <ResizablePanel defaultSize={65}>
              <Pane>editor</Pane>
            </ResizablePanel>
            <ResizablePanel>
              <Pane>terminal</Pane>
            </ResizablePanel>
          </ResizablePanels>
        </ResizablePanel>
      </ResizablePanels>
    </div>
  ),
};
