import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb.js';

describe('Breadcrumb', () => {
  it('renders an ordered path with the current page marked', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/acme">acme</BreadcrumbItem>
        <BreadcrumbItem>
          <a href="/acme/web">web</a>
        </BreadcrumbItem>
        <BreadcrumbItem current>Deployments</BreadcrumbItem>
      </Breadcrumb>,
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'acme' })).toHaveAttribute('href', '/acme');
    expect(screen.getByRole('link', { name: 'web' })).toHaveAttribute('href', '/acme/web');
    expect(screen.getByText('Deployments')).toHaveAttribute('aria-current', 'page');
  });
});
