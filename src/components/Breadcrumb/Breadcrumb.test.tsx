import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumb } from '@/components/Breadcrumb';

const mockItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'article', label: 'Article', href: '/blog/article' },
];

describe('Breadcrumb', () => {
  it('renders nothing when items are empty', () => {
    const { container } = render(<Breadcrumb items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a navigation landmark', () => {
    render(<Breadcrumb items={mockItems} />);

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('applies a custom className to the navigation root', () => {
    render(
      <Breadcrumb
        items={mockItems}
        className="custom-breadcrumb"
      />
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveClass('custom-breadcrumb');
  });

  it('renders breadcrumb links for all but the last item', () => {
    render(<Breadcrumb items={mockItems} />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('Home');
    expect(links[1]).toHaveTextContent('Blog');
  });

  it('renders the last item as the current page', () => {
    render(<Breadcrumb items={mockItems} />);

    const current = screen.getByText('Article');

    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).toBe('SPAN');
  });

  it('renders correct href attributes', () => {
    render(<Breadcrumb items={mockItems} />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
  });

  it('renders items in order', () => {
    render(<Breadcrumb items={mockItems} />);

    const listItems = screen.getAllByRole('listitem');

    expect(listItems[0]).toHaveTextContent('Home');
    expect(listItems[1]).toHaveTextContent('Blog');
    expect(listItems[2]).toHaveTextContent('Article');
  });
});
