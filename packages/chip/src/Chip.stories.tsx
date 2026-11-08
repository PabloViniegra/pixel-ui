import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { Chip } from './Chip.js';
import '@pablo-v/pixel-icons/style.css';
import './chip.css';

const meta = {
  title: 'Actions/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { children: 'Production' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filters: Story = {
  render: function Render(args) {
    const [active, setActive] = useState<string[]>(['Production']);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {['Production', 'Preview', 'Development'].map((env) => (
          <Chip
            key={env}
            size={args.size}
            selected={active.includes(env)}
            onSelectedChange={(on) =>
              setActive((list) => (on ? [...list, env] : list.filter((e) => e !== env)))
            }
          >
            {env}
          </Chip>
        ))}
      </div>
    );
  },
};

export const Removable: Story = {
  render: function Render(args) {
    const [tags, setTags] = useState(['react', 'nextjs', 'edge']);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            size={args.size}
            onRemove={() => setTags((list) => list.filter((t) => t !== tag))}
          >
            {tag}
          </Chip>
        ))}
      </div>
    );
  },
};
