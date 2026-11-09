import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination, paginationRange } from './Pagination.js';

describe('paginationRange', () => {
  it('lists every page when they fit', () => {
    expect(paginationRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('truncates with a constant length wherever the current page is', () => {
    expect(paginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 20]);
    expect(paginationRange(10, 20)).toEqual([1, 'start-ellipsis', 9, 10, 11, 'end-ellipsis', 20]);
    expect(paginationRange(20, 20)).toEqual([1, 'start-ellipsis', 16, 17, 18, 19, 20]);
  });
});

describe('Pagination', () => {
  it('marks the current page and moves with previous, next and page buttons', async () => {
    const onPageChange = vi.fn();
    render(<Pagination total={10} defaultPage={1} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');

    await userEvent.click(screen.getByRole('button', { name: 'Page 10' }));
    expect(onPageChange).toHaveBeenLastCalledWith(10);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('renders links when given getHref', () => {
    render(<Pagination total={5} page={3} getHref={(p) => `/posts?page=${p}`} />);
    expect(screen.getByRole('link', { name: 'Page 4' })).toHaveAttribute('href', '/posts?page=4');
    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/posts?page=4');
  });

  it('clamps an empty total and a page past the end', () => {
    const { rerender } = render(<Pagination total={0} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

    rerender(<Pagination total={5} page={9} />);
    expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
