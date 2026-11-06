import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Popover } from './Popover.js';

describe('Popover', () => {
  it('toggles from its trigger and reflects the state', async () => {
    render(
      <Popover label="Share" trigger={<button type="button">Share</button>}>
        <a href="#copy">Copy link</a>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    const panel = screen.getByRole('dialog', { name: 'Share' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveFocus();

    await userEvent.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on outside press and returns focus to the trigger on Escape', async () => {
    render(
      <>
        <p>outside</p>
        <Popover label="Filters" trigger={<button type="button">Filters</button>}>
          content
        </Popover>
      </>,
    );
    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    await userEvent.click(screen.getByText('outside'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
