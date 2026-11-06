import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
