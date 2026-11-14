import { GridIcon, ListIcon, StarIcon } from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { SegmentedControl } from './SegmentedControl.js';
import { Toggle } from './Toggle.js';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup.js';
import '@pablo-v/pixel-icons/style.css';
import './toggle.css';

const meta = {
  title: 'Actions/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { children: 'Preview', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  args: { children: undefined, icon: <StarIcon />, 'aria-label': 'Favourite', size: 'sm' },
};

export const Group: Story = {
  render: () => (
    <ToggleGroup aria-label="View" size="sm" defaultValue={['grid']}>
      <ToggleGroupItem value="grid" icon={<GridIcon />} aria-label="Grid" />
      <ToggleGroupItem value="list" icon={<ListIcon />} aria-label="List" />
    </ToggleGroup>
  ),
};

export const Segmented: Story = {
  render: () => (
    <SegmentedControl
      aria-label="Range"
      defaultValue="7d"
      options={[
        { value: '24h', label: '24h' },
        { value: '7d', label: '7 days' },
        { value: '30d', label: '30 days' },
        { value: 'all', label: 'All time' },
      ]}
    />
  ),
};
