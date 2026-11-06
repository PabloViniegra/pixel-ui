import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { PixelAvatar } from './PixelAvatar.js';
import './pixel-avatar.css';

const people = [
  'ada@lovelace.dev',
  'grace@hopper.dev',
  'alan@turing.dev',
  'katherine@johnson.dev',
  'linus@kernel.org',
  'margaret@hamilton.dev',
  'dennis@ritchie.dev',
  'barbara@liskov.dev',
];

const meta = {
  title: 'Signature/PixelAvatar',
  component: PixelAvatar,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { name: 'ada@lovelace.dev', size: 64 },
  argTypes: {
    shape: { control: 'inline-radio', options: ['md', 'full'] },
    cells: { control: { type: 'range', min: 4, max: 9 } },
  },
} satisfies Meta<typeof PixelAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Team: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {people.map((p) => (
        <PixelAvatar key={p} {...args} name={p} size={48} />
      ))}
    </div>
  ),
};

export const WithName: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, fontSize: 'var(--pxl-text-sm)' }}>
      {people.slice(0, 3).map((p) => (
        <div key={p} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <PixelAvatar name={p} size={24} shape="full" label="" />
          <span>{p}</span>
        </div>
      ))}
    </div>
  ),
};
