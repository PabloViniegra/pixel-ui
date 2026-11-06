import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionItem } from './Accordion.js';

describe('Accordion', () => {
  it('toggles items from their summary', async () => {
    render(
      <Accordion>
        <AccordionItem title="Build settings">pnpm build</AccordionItem>
      </Accordion>,
    );
    const item = screen.getByText('Build settings').closest('details');
    expect(item).not.toHaveAttribute('open');
    await userEvent.click(screen.getByText('Build settings'));
    expect(item).toHaveAttribute('open');
  });

  it('groups items by a shared name in single mode', () => {
    const { container } = render(
      <Accordion type="single">
        <AccordionItem title="One" defaultOpen>
          1
        </AccordionItem>
        <AccordionItem title="Two">2</AccordionItem>
      </Accordion>,
    );
    const [one, two] = container.querySelectorAll('details');
    expect(one?.getAttribute('name')).toBeTruthy();
    expect(one?.getAttribute('name')).toBe(two?.getAttribute('name'));
    expect(one).toHaveAttribute('open');
  });
});
