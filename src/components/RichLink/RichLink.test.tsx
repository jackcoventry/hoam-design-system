import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RichLink } from '@/components/RichLink';

describe('RichLink', () => {
  const mockProps = {
    href: '/somewhere',
    title: 'Read more',
    image: '/img/test.png',
    imageAlt: '',
  };

  it('renders the link with correct href', () => {
    render(<RichLink {...mockProps} />);

    const link = screen.getByRole('link', { name: /read more/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/somewhere');
  });

  it('renders the title inside a span', () => {
    render(<RichLink {...mockProps} />);

    const text = screen.getByText('Read more');
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('hoam-rich-link__text');
  });

  it('renders the image with the correct src', () => {
    render(<RichLink {...mockProps} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img/test.png');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveClass('hoam-rich-link__image');
  });

  it('applies the correct CSS class to the root element', () => {
    render(<RichLink {...mockProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('hoam-rich-link');
  });
});
