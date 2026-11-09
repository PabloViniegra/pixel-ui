import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Navbar, NavbarLink, NavbarMenu, NavbarMenuLink } from './Navbar.js';

function setup() {
  render(
    <Navbar brand="Acme">
      <NavbarLink href="#home" current>
        Home
      </NavbarLink>
      <NavbarMenu label="Products">
        <NavbarMenuLink href="#hosting" description="Deploy from Git">
          Hosting
        </NavbarMenuLink>
        <NavbarMenuLink href="#logs">Logs</NavbarMenuLink>
      </NavbarMenu>
      <NavbarMenu label="Resources">
        <NavbarMenuLink href="#docs">Docs</NavbarMenuLink>
      </NavbarMenu>
    </Navbar>,
  );
  return {
    products: screen.getByRole('button', { name: 'Products' }),
    resources: screen.getByRole('button', { name: 'Resources' }),
  };
}

describe('Navbar', () => {
  it('is a labelled navigation landmark that marks the current page', () => {
    setup();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens one menu at a time and closes on Escape with focus back on its button', async () => {
    const { products, resources } = setup();
    await userEvent.click(products);
    expect(products).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /Hosting/ })).toBeVisible();

    await userEvent.click(resources);
    expect(products).toHaveAttribute('aria-expanded', 'false');
    expect(resources).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Escape}');
    expect(resources).toHaveAttribute('aria-expanded', 'false');
    expect(resources).toHaveFocus();
  });

  it('moves with arrow keys between top-level items and into a menu', async () => {
    const { products } = setup();
    screen.getByRole('link', { name: 'Home' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(products).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('link', { name: /Hosting/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('link', { name: 'Logs' })).toHaveFocus();
    await userEvent.tab();
    expect(products).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes a menu on Escape from one of its links, focusing its button', async () => {
    const { products } = setup();
    products.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('link', { name: /Hosting/ })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(products).toHaveAttribute('aria-expanded', 'false');
    expect(products).toHaveFocus();
  });

  it('collapses the narrow menu on Escape or an outside press, inner menu first', async () => {
    const { products } = setup();
    const toggle = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(toggle);
    await userEvent.click(products);
    await userEvent.keyboard('{Escape}');
    expect(products).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();

    await userEvent.click(toggle);
    await userEvent.click(document.body);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
