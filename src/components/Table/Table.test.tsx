import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Table, TableBody, TableHeader } from '@/components/Table';

vi.mock('@/components/Table/Table.module.css', () => ({
  default: {
    root: 'root',
    table: 'table',
  },
}));

describe('Table', () => {
  it('renders a table with header and body when given valid children', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </TableHeader>
        <TableBody>
          <tr>
            <td>House Espresso Blend</td>
            <td>250g whole bean</td>
          </tr>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole('table');

    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('table');
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('House Espresso Blend')).toBeInTheDocument();
    expect(screen.getByText('250g whole bean')).toBeInTheDocument();
  });

  it('wraps the table in the root container', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <tr>
            <th>Name</th>
          </tr>
        </TableHeader>
        <TableBody>
          <tr>
            <td>Colombia Pink Bourbon</td>
          </tr>
        </TableBody>
      </Table>
    );

    expect(container.firstChild).toHaveClass('root');
  });

  it('applies a custom className to the root container', () => {
    const { container } = render(
      <Table className="custom-table">
        <TableHeader>
          <tr>
            <th>Name</th>
          </tr>
        </TableHeader>
        <TableBody>
          <tr>
            <td>Colombia Pink Bourbon</td>
          </tr>
        </TableBody>
      </Table>
    );

    expect(container.firstChild).toHaveClass('root');
    expect(container.firstChild).toHaveClass('custom-table');
  });

  it('supports native table children without runtime component checks', () => {
    render(
      <Table>
        <caption>Available coffee</caption>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>French Press Kit</td>
          </tr>
        </tbody>
      </Table>
    );

    expect(screen.getByText('Available coffee')).toBeInTheDocument();
    expect(screen.getByText('French Press Kit')).toBeInTheDocument();
  });
});

describe('TableHeader', () => {
  it('renders children inside a thead', () => {
    const { container } = render(
      <table>
        <TableHeader>
          <tr>
            <th>Name</th>
          </tr>
        </TableHeader>
      </table>
    );

    const thead = container.querySelector('thead');

    expect(thead).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});

describe('TableBody', () => {
  it('renders children inside a tbody', () => {
    const { container } = render(
      <table>
        <TableBody>
          <tr>
            <td>Aragorn</td>
          </tr>
        </TableBody>
      </table>
    );

    const tbody = container.querySelector('tbody');

    expect(tbody).toBeInTheDocument();
    expect(screen.getByText('Aragorn')).toBeInTheDocument();
  });
});
