import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Avatar, AvatarGroup } from './Avatar.js';
import './avatar.css';

const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges"><rect width="8" height="8" fill="#3b5bdb"/><rect x="2" y="1" width="4" height="4" fill="#f4d6b8"/><rect x="1" y="6" width="6" height="2" fill="#111"/></svg>',
)}`;

const meta = {
  title: 'Data display/Avatar',
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} status="online" />
      ))}
    </div>
  ),
};

export const Presence: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
        <div key={status} style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
          <Avatar {...args} status={status} />
          <span style={{ fontSize: 'var(--pxl-text-sm)', color: 'var(--pxl-fg-muted)' }}>
            {status}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Avatar {...args} shape="circle" status="online" />
      <Avatar {...args} shape="square" status="online" />
      <Avatar {...args} shape="circle" src={PHOTO} status="busy" />
      <Avatar {...args} shape="square" src={PHOTO} status="busy" />
    </div>
  ),
};

export const CustomFallback: Story = {
  args: {
    fallback: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <title>Profile</title>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </svg>
    ),
  },
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
