import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline, TimelineItem } from './Timeline.js';

describe('Timeline', () => {
  it('renders an ordered list of events with machine-readable times', () => {
    render(
      <Timeline aria-label="History">
        <TimelineItem title="Merged" time="11:58" dateTime="2026-11-14T11:58" tone="accent">
          feat: hover card
        </TimelineItem>
        <TimelineItem title="Opened" />
      </Timeline>,
    );
    const items = screen.getAllByRole('listitem');
    expect(screen.getByRole('list', { name: 'History' }).tagName).toBe('OL');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('data-tone', 'accent');
    expect(screen.getByText('11:58')).toHaveAttribute('datetime', '2026-11-14T11:58');
    expect(items[1]?.querySelector('time')).toBeNull();
  });
});
