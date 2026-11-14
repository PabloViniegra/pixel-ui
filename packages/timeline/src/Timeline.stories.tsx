import { BoltIcon, ErrorIcon, SuccessIcon } from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Timeline, TimelineItem } from './Timeline.js';
import '@pablo-v/pixel-icons/style.css';
import './timeline.css';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { 'aria-label': 'Deployment history', style: { maxWidth: 420 } },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Deploy queued" time="12:04" dateTime="2026-11-14T12:04" tone="accent">
        main · 4f2a9c1
      </TimelineItem>
      <TimelineItem title="Build started" time="12:01" dateTime="2026-11-14T12:01" />
      <TimelineItem title="Pull request merged" time="11:58" dateTime="2026-11-14T11:58">
        feat: add hover card
      </TimelineItem>
      <TimelineItem title="Review approved" time="11:40" dateTime="2026-11-14T11:40" />
    </Timeline>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Production ready" time="2m ago" icon={<SuccessIcon />} tone="success">
        All checks passed in 48s.
      </TimelineItem>
      <TimelineItem title="Build failed" time="14m ago" icon={<ErrorIcon />} tone="danger">
        Type error in packages/time-field.
      </TimelineItem>
      <TimelineItem title="Deploy triggered" time="15m ago" icon={<BoltIcon />} />
    </Timeline>
  ),
};
