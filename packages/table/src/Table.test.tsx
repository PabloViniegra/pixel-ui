import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table.js';

describe('Table', () => {
  it('renders a captioned table with column headers scoped to columns', () => {
    render(
      <Table>
        <TableCaption>Recent deployments</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeader>Branch</TableHeader>
            <TableHeader align="end">Duration</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow selected>
            <TableCell>main</TableCell>
            <TableCell align="end" mono>
              42s
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole('table', { name: 'Recent deployments' });
    const headers = within(table).getAllByRole('columnheader');
    expect(headers.map((h) => h.textContent)).toEqual(['Branch', 'Duration']);
    expect(headers[0]).toHaveAttribute('scope', 'col');
    expect(within(table).getByRole('cell', { name: '42s' })).toHaveAttribute('data-align', 'end');
  });

  it('lets a header label its row instead of its column', () => {
    render(
      <Table aria-label="Usage">
        <TableBody>
          <TableRow>
            <TableHeader scope="row">Bandwidth</TableHeader>
            <TableCell>12 GB</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('rowheader', { name: 'Bandwidth' })).toHaveAttribute('scope', 'row');
  });

  it('exposes a sortable header as a button with aria-sort', async () => {
    const onSort = vi.fn();
    render(
      <Table aria-label="Usage">
        <TableHead>
          <TableRow>
            <TableHeader sort="descending" onSort={onSort}>
              Requests
            </TableHeader>
            <TableHeader sort="none" onSort={() => {}}>
              Project
            </TableHeader>
          </TableRow>
        </TableHead>
      </Table>,
    );
    const requests = screen.getByRole('columnheader', { name: 'Requests' });
    expect(requests).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByRole('columnheader', { name: 'Project' })).not.toHaveAttribute('aria-sort');
    await userEvent.click(screen.getByRole('button', { name: 'Requests' }));
    expect(onSort).toHaveBeenCalledOnce();
  });

  it('keeps a plain header when onSort is missing', () => {
    render(
      <Table aria-label="Usage">
        <TableHead>
          <TableRow>
            <TableHeader sort="ascending">Requests</TableHeader>
          </TableRow>
        </TableHead>
      </Table>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
  });
});
