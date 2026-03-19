import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { vi } from 'vitest';

import {
  SearchForm,
  type SearchFormProps,
  type SearchFormResult,
  type SearchFormSchemaType,
  SearchLoader,
  SearchResult,
  SearchResults,
} from '@/components/Form/SearchForm/SearchForm';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    ...props
  }: {
    children?: ReactNode;
  } & ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/Loading', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('SearchResult', () => {
  it('renders the result title, preview, and link', () => {
    render(
      <SearchResult
        title="Coffee Guide"
        preview="Everything you need to know about brewing better coffee."
        url="/guides/coffee"
      />
    );

    expect(screen.getByText('Coffee Guide')).toBeInTheDocument();
    expect(
      screen.getByText('Everything you need to know about brewing better coffee.')
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute(
      'href',
      '/guides/coffee'
    );
  });
});

describe('SearchLoader', () => {
  it('renders the spinner', () => {
    render(<SearchLoader />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});

describe('SearchResults', () => {
  const items: SearchFormResult[] = [
    {
      id: 1,
      title: 'Coffee Guide',
      url: '/guides/coffee',
      preview: 'Everything you need to know about brewing better coffee.',
    },
    {
      title: 'Espresso Basics',
      url: '/guides/espresso',
      preview: 'Learn the fundamentals of espresso extraction.',
    },
  ];

  it('renders a no results message when there are no items', () => {
    render(<SearchResults items={[]} />);

    expect(screen.getByText('No results!')).toBeInTheDocument();
  });

  it('renders a list of search results', () => {
    render(<SearchResults items={items} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    expect(screen.getByText('Coffee Guide')).toBeInTheDocument();
    expect(screen.getByText('Espresso Basics')).toBeInTheDocument();

    const links = screen.getAllByRole('link', { name: 'Read more' });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/guides/coffee');
    expect(links[1]).toHaveAttribute('href', '/guides/espresso');
  });

  it('uses the fallback key path safely when id is missing', () => {
    render(
      <SearchResults
        items={[
          {
            title: 'Espresso Basics',
            url: '/guides/espresso',
            preview: 'Learn the fundamentals of espresso extraction.',
          },
        ]}
      />
    );

    expect(screen.getByText('Espresso Basics')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('SearchForm', () => {
  function renderComponent(props?: Partial<SearchFormProps>) {
    const onSubmit: SearchFormProps['onSubmit'] = vi.fn();

    render(
      <SearchForm
        onSubmit={onSubmit}
        loading={false}
        {...props}
      />
    );

    return { onSubmit };
  }

  it('renders the search input and submit button', () => {
    renderComponent();

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter keywords...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('submits valid search input', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await user.type(screen.getByLabelText('Search'), 'coffee beans');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith(
      { q: 'coffee beans' } satisfies SearchFormSchemaType,
      expect.anything()
    );
  });

  it('does not submit an empty query', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('does not submit a whitespace-only query', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await user.type(screen.getByLabelText('Search'), '   ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows the validation message in the placeholder when the query is invalid', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByPlaceholderText('Required')).toBeInTheDocument();
  });

  it('sets aria-invalid when the query is invalid', async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByLabelText('Search');

    expect(input).toHaveAttribute('aria-invalid', 'false');

    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Search')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('disables the input and submit button when loading is true', () => {
    renderComponent({ loading: true });

    expect(screen.getByLabelText('Search')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });
});
