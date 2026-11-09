import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Pagination } from './Pagination.js';
import '@pablo-v/pixel-icons/style.css';
import './pagination.css';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { total: 20, defaultPage: 6 },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FewPages: Story = { args: { total: 4, defaultPage: 1 } };

export const Links: Story = {
  args: { getHref: (page) => `?page=${page}`, size: 'sm' },
};

export const Narrow: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <Pagination {...args} siblings={0} />
    </div>
  ),
};
