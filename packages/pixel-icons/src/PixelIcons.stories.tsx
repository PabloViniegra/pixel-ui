import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import * as animated from './animated-icons.js';
import * as brands from './brand-icons.js';
import * as all from './icons.js';
import { CheckIcon, type PixelIcon } from './index.js';
import './pixel-icons.css';
import '../pixel-icons.stories.css';

const icons = Object.entries(all as Record<string, PixelIcon>);
const animatedIcons = Object.entries(animated as Record<string, PixelIcon>);
const brandIcons = Object.entries(brands as Record<string, PixelIcon>);

const meta = {
  title: 'Signature/PixelIcons',
  component: CheckIcon,
  tags: ['autodocs'],
  parameters: { layout: 'padded', pixelui: { name: pkg.name, version: pkg.version } },
  args: { size: 16 },
  argTypes: { size: { control: { type: 'select' }, options: [16, 24, 32, 48] } },
} satisfies Meta<typeof CheckIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const grid = (entries: [string, PixelIcon][], size?: number) => (
  <ul className="pxl-icon-gallery">
    {entries.map(([name, Icon]) => (
      <li key={name} className="pxl-icon-gallery__item">
        <span className="pxl-icon-gallery__preview">
          <Icon size={size} />
        </span>
        <span className="pxl-icon-gallery__name">{name.replace(/Icon$/, '')}</span>
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
