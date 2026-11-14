import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar, AvatarGroup } from './Avatar.js';

describe('Avatar', () => {
  it('shows initials and is named by the person and status', () => {
    render(<Avatar name="Ada King Lovelace" status="online" />);
    expect(screen.getByRole('img', { name: 'Ada King Lovelace (online)' })).toHaveTextContent('AL');
  });

  it('keeps the initials until the image loads and falls back when it fails', () => {
    const { container } = render(<Avatar name="Grace" src="/grace.png" />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(screen.getByText('G')).toBeInTheDocument();

    fireEvent.load(img);
    expect(screen.queryByText('G')).not.toBeInTheDocument();

    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('G')).toBeInTheDocument();
  });

  it('shows an image that finished loading before mount', () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(64);
    const { container } = render(<Avatar name="Grace" src="/grace.png" />);
    expect(container.querySelector('img')).toHaveAttribute('data-loaded');
    expect(screen.queryByText('G')).not.toBeInTheDocument();
    vi.restoreAllMocks();
  });
});

describe('AvatarGroup', () => {
  it('collapses avatars beyond max into a count', () => {
    render(
      <AvatarGroup max={2} aria-label="Members">
        <Avatar name="A" />
        <Avatar name="B" />
        <Avatar name="C" />
        <Avatar name="D" />
      </AvatarGroup>,
    );
    const group = screen.getByRole('group', { name: 'Members' });
    expect(group.querySelectorAll('[role="img"]')).toHaveLength(3);
    expect(screen.getByRole('img', { name: '2 more' })).toHaveTextContent('+2');
  });
});
