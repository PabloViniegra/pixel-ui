import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { Checkbox } from './Checkbox.js';
import './checkbox.css';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { label: 'Enable preview deployments' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Every push to a branch gets its own URL.', defaultChecked: true },
};

const regions = ['Frankfurt', 'Washington, D.C.', 'Tokyo'];

export const SelectAll: Story = {
  render: () => {
    const [picked, setPicked] = useState<string[]>(['Tokyo']);
    const all = picked.length === regions.length;
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Checkbox
          label="All regions"
          checked={all}
          indeterminate={picked.length > 0 && !all}
          onChange={() => setPicked(all ? [] : regions)}
        />
        <div style={{ display: 'grid', gap: 8, paddingLeft: 24 }}>
          {regions.map((r) => (
            <Checkbox
              key={r}
              label={r}
              checked={picked.includes(r)}
              onChange={(e) =>
                setPicked((p) => (e.target.checked ? [...p, r] : p.filter((x) => x !== r)))
              }
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
