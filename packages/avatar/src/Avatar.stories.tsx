import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Avatar, AvatarGroup } from './Avatar.js';
import './avatar.css';

const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges"><rect width="8" height="8" fill="#3b5bdb"/><rect x="2" y="1" width="4" height="4" fill="#f4d6b8"/><rect x="1" y="6" width="6" height="2" fill="#111"/></svg>',
)}`;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { name: 'Ada Lovelace', size: 'md', shape: 'circle' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    status: { control: 'inline-radio', options: [undefined, 'online', 'away', 'busy', 'offline'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const WithImage: Story = {
  args: { src: PHOTO, status: 'online' },
};

export const BrokenImage: Story = { args: { src: 'https://example.invalid/a.png' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} status="online" />
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4} aria-label="Project members">
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Alan Turing" />
      <Avatar name="Katherine Johnson" />
      <Avatar name="Linus Torvalds" />
      <Avatar name="Margaret Hamilton" />
    </AvatarGroup>
  ),
};
