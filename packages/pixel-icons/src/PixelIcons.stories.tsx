import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import * as animated from './animated-icons.js';
import * as brands from './brand-icons.js';
import * as all from './icons.js';
import { CheckIcon, type PixelIcon } from './index.js';
import './pixel-icons.css';

const icons = Object.entries(all as Record<string, PixelIcon>);
const animatedIcons = Object.entries(animated as Record<string, PixelIcon>);
const brandIcons = Object.entries(brands as Record<string, PixelIcon>);

const meta = {
  title: 'Signature/PixelIcons',
  component: CheckIcon,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { size: 16 },
  argTypes: { size: { control: { type: 'select' }, options: [16, 24, 32, 48] } },
} satisfies Meta<typeof CheckIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const grid = (entries: [string, PixelIcon][], size?: number) => (
  <ul
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 96px)',
      gap: 8,
      margin: 0,
      padding: 0,
      listStyle: 'none',
      fontFamily: 'var(--pxl-font-sans)',
      fontSize: 11,
      color: 'var(--pxl-fg-muted)',
    }}
  >
    {entries.map(([name, Icon]) => (
      <li
        key={name}
        style={{
          display: 'grid',
          justifyItems: 'center',
          gap: 8,
          padding: '16px 4px 12px',
          border: '1px solid var(--pxl-border)',
          borderRadius: 'var(--pxl-radius-md)',
        }}
      >
        <Icon size={size} style={{ color: 'var(--pxl-fg)' }} />
        {name.replace(/Icon$/, '')}
      </li>
    ))}
  </ul>
);

export const Gallery: Story = {
  render: ({ size }) => grid(icons, size),
};

export const Animated: Story = {
  render: ({ size }) => grid(animatedIcons, size),
};

export const Brands: Story = {
  render: ({ size }) => grid(brandIcons, size),
};
