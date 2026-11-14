import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarContent, SidebarGroup, SidebarItem, SidebarToggle } from './Sidebar.js';

function renderSidebar(onCollapsedChange = vi.fn()) {
  render(
    <Sidebar aria-label="App" onCollapsedChange={onCollapsedChange}>
      <SidebarToggle />
      <SidebarContent aria-label="Main">
        <SidebarGroup label="Workspace">
          <SidebarItem href="/" current>
            Overview
          </SidebarItem>
          <SidebarItem onClick={() => {}}>Search</SidebarItem>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>,
  );
}

describe('Sidebar', () => {
  it('renders links, buttons and the current page inside a labelled group', () => {
    renderSidebar();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('collapses and expands from the toggle, keeping item names', async () => {
    const onCollapsedChange = vi.fn();
    renderSidebar(onCollapsedChange);
    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(toggle);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('complementary')).toHaveAttribute('data-collapsed');
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('title', 'Overview');
  });
});
