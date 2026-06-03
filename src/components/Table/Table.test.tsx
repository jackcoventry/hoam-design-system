import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Table, TableBody, TableHeader } from '@/components/Table';

const invariantMock = vi.fn<(condition: boolean, message: string) => void>();

vi.mock('@/utils/logger', () => ({
  logger: {
    invariant: (condition: boolean, message: string) => invariantMock(condition, message),
  },
}));

vi.mock('@/components/Table/Table.module.css', () => ({
  default: {
    root: 'root',
    table: 'table',
  },
}));

describe('Table', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    invariantMock.mockImplementation((condition, message) => {
      if (!condition) {
        throw new Error(message);
      }
    });
  });

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
            <td>Frodo</td>
            <td>Ring-bearer</td>
          </tr>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole('table');

    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('table');
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Frodo')).toBeInTheDocument();
    expect(screen.getByText('Ring-bearer')).toBeInTheDocument();
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
            <td>Sam</td>
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
            <td>Sam</td>
          </tr>
        </TableBody>
      </Table>
    );

    expect(container.firstChild).toHaveClass('root');
    expect(container.firstChild).toHaveClass('custom-table');
  });

  it('calls invariant for the expected structural checks', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <th>Name</th>
          </tr>
        </TableHeader>
        <TableBody>
          <tr>
            <td>Merry</td>
          </tr>
        </TableBody>
      </Table>
    );

    expect(invariantMock).toHaveBeenCalledTimes(3);
    expect(invariantMock).toHaveBeenNthCalledWith(
      1,
      true,
      '<Table /> must contain exactly two children: <TableHeader /> and <typeof TableBody />'
    );
    expect(invariantMock).toHaveBeenNthCalledWith(
      2,
      true,
      'The first child of Table must be <TableHeader />'
    );
    expect(invariantMock).toHaveBeenNthCalledWith(
      3,
      true,
      'The second child of Table must be <TableBody />'
    );
  });

  it('throws when given fewer than two children', () => {
    expect(() =>
      render(
        <Table>
          <TableHeader>
            <tr>
              <th>Name</th>
            </tr>
          </TableHeader>
        </Table>
      )
    ).toThrow(
      '<Table /> must contain exactly two children: <TableHeader /> and <typeof TableBody />'
    );
  });

  it('throws when given more than two children', () => {
    expect(() =>
      render(
        <Table>
          <TableHeader>
            <tr>
              <th>Name</th>
            </tr>
          </TableHeader>
          <TableBody>
            <tr>
              <td>Pippin</td>
            </tr>
          </TableBody>
          <TableBody>
            <tr>
              <td>Extra</td>
            </tr>
          </TableBody>
        </Table>
      )
    ).toThrow(
      '<Table /> must contain exactly two children: <TableHeader /> and <typeof TableBody />'
    );
  });

  it('throws when the first child is not TableHeader', () => {
    expect(() =>
      render(
        <Table>
          <TableBody>
            <tr>
              <td>Wrong order</td>
            </tr>
          </TableBody>
          <TableBody>
            <tr>
              <td>Still wrong</td>
            </tr>
          </TableBody>
        </Table>
      )
    ).toThrow('The first child of Table must be <TableHeader />');
  });

  it('throws when the second child is not TableBody', () => {
    expect(() =>
      render(
        <Table>
          <TableHeader>
            <tr>
              <th>Name</th>
            </tr>
          </TableHeader>
          <TableHeader>
            <tr>
              <th>Still header</th>
            </tr>
          </TableHeader>
        </Table>
      )
    ).toThrow('The second child of Table must be <TableBody />');
  });

  it('throws when the first child is not a valid element', () => {
    expect(() =>
      render(
        <Table>
          {'not a header' as unknown as ReactNode}
          <TableBody>
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </Table>
      )
    ).toThrow('The first child of Table must be <TableHeader />');
  });

  it('throws when the second child is not a valid element', () => {
    expect(() =>
      render(
        <Table>
          <TableHeader>
            <tr>
              <th>Name</th>
            </tr>
          </TableHeader>
          {'not a body' as unknown as ReactNode}
        </Table>
      )
    ).toThrow('The second child of Table must be <TableBody />');
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
