import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Skeleton } from './Skeleton.js';
import './skeleton.css';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { width: 240, height: 16 },
  argTypes: { radius: { control: 'inline-radio', options: ['sm', 'md', 'full'] } },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CardPlaceholder: Story = {
  render: () => (
    <div
      aria-busy="true"
      aria-label="Loading project"
      style={{
        display: 'grid',
        gap: 16,
        width: 320,
        padding: 24,
        border: '1px solid var(--pxl-border)',
        borderRadius: 'var(--pxl-radius-lg)',
        fontSize: 'var(--pxl-text-sm)',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton width={32} height={32} radius="full" />
        <div style={{ display: 'grid', gap: 6, flex: 1 }}>
          <Skeleton width="50%" height={12} />
          <Skeleton width="30%" height={10} />
        </div>
      </div>
      <Skeleton lines={3} />
    </div>
  ),
};
