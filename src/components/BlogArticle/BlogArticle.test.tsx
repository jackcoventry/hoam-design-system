import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { BlogArticle, type BlogArticleProps } from '@/components/BlogArticle';

const mockParseLooseDate = vi.fn<(value: string) => Date | null>();
const mockFormatReadableDate = vi.fn<(value: Date) => string>();
const mockFormatISODate = vi.fn<(value: Date) => string>();

vi.mock('@/utils/convertDates', () => ({
  parseLooseDate: (value: string): Date | null => mockParseLooseDate(value),
  formatReadableDate: (value: Date): string => mockFormatReadableDate(value),
  formatISODate: (value: Date): string => mockFormatISODate(value),
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: React.ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="grid-item">{children}</div>
  ),
}));

describe('BlogArticle', () => {
  const parsedDate = new Date('2026-03-19T00:00:00.000Z');

  const defaultProps: BlogArticleProps = {
    category: 'Design Systems',
    title: 'Building a better component library',
    summary: 'A practical guide to structure, styling, and testing.',
    author: {
      id: 'jane-doe',
      name: 'Jane Doe',
      image: 'https://placehold.co/20x20',
    },
    publishDate: '2026-03-19',
    readingTime: 6,
    image: {
      src: '/images/blog/design-systems.jpg',
      alt: 'A desk with design sketches',
      caption: 'A snapshot of the design process.',
    },
    tags: [
      { id: 'react', name: 'React' },
      { id: 'testing', name: 'Testing' },
    ],
    socialLinks: [
      { label: 'Facebook', href: 'https://facebook.com/example', icon: 'facebook' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/example', icon: 'linkedin' },
    ],
    children: (
      <>
        <p>First paragraph of article content.</p>
        <p>Second paragraph of article content.</p>
      </>
    ),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockParseLooseDate.mockReturnValue(parsedDate);
    mockFormatReadableDate.mockReturnValue('19 March 2026');
    mockFormatISODate.mockReturnValue('2026-03-19');
  });

  it('renders the main article content and metadata', () => {
    render(<BlogArticle {...defaultProps} />);

    expect(screen.getByRole('article')).toBeInTheDocument();

    expect(screen.getByText('Design Systems')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Building a better component library' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'A practical guide to structure, styling, and testing.',
      })
    ).toBeInTheDocument();

    const authorLink = screen.getByRole('link', { name: /jane doe/i });
    expect(authorLink).toHaveAttribute('href', '/profile/jane-doe');
    expect(authorLink).toHaveAttribute('rel', 'author');

    const avatar = screen.getByRole('img', { name: 'The avatar of Jane Doe' });
    expect(avatar).toHaveAttribute('src', 'https://placehold.co/20x20');

    const time = screen.getByText('19 March 2026');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', '2026-03-19');

    expect(screen.getByText('6 minute read')).toBeInTheDocument();

    expect(screen.getByText('First paragraph of article content.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph of article content.')).toBeInTheDocument();

    expect(mockParseLooseDate).toHaveBeenCalledWith('2026-03-19');
    expect(mockFormatReadableDate).toHaveBeenCalledWith(parsedDate);
    expect(mockFormatISODate).toHaveBeenCalledWith(parsedDate);
  });

  it('renders the main image and caption', () => {
    render(<BlogArticle {...defaultProps} />);

    const image = screen.getByRole('img', { name: 'A desk with design sketches' });
    expect(image).toHaveAttribute('src', '/images/blog/design-systems.jpg');

    expect(screen.getByText('A snapshot of the design process.')).toBeInTheDocument();
  });

  it('renders the social share links', () => {
    render(<BlogArticle {...defaultProps} />);

    expect(screen.getByText('SHARE')).toBeInTheDocument();

    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });

    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/example');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/example');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders tags in the footer', () => {
    render(<BlogArticle {...defaultProps} />);

    expect(screen.getByText('Tags:')).toBeInTheDocument();

    const reactTag = screen.getByRole('link', { name: 'React' });
    const testingTag = screen.getByRole('link', { name: 'Testing' });

    expect(reactTag).toHaveAttribute('href', '/blog/tag/react');
    expect(testingTag).toHaveAttribute('href', '/blog/tag/testing');
  });

  it('does not render tags when the tags array is empty', () => {
    render(
      <BlogArticle
        {...defaultProps}
        tags={[]}
      />
    );

    expect(screen.queryByText('Tags:')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'React' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Testing' })).not.toBeInTheDocument();
  });

  it('does not render the image section when image is not provided', () => {
    render(
      <BlogArticle
        {...defaultProps}
        image={undefined as never}
      />
    );

    expect(
      screen.queryByRole('img', { name: 'A desk with design sketches' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('A snapshot of the design process.')).not.toBeInTheDocument();
  });

  it('renders empty date values when the publish date cannot be parsed', () => {
    mockParseLooseDate.mockReturnValue(null);

    const { container } = render(<BlogArticle {...defaultProps} />);

    const timeElement = container.querySelector('time');

    expect(timeElement).not.toBeNull();
    expect(timeElement).toHaveAttribute('dateTime', '');
    expect(timeElement).toHaveTextContent('');

    expect(mockFormatReadableDate).not.toHaveBeenCalled();
    expect(mockFormatISODate).not.toHaveBeenCalled();
  });

  it('does not render category when category is empty', () => {
    render(
      <BlogArticle
        {...defaultProps}
        category=""
      />
    );

    expect(screen.queryByText('Design Systems')).not.toBeInTheDocument();
  });

  it('does not render title when title is empty', () => {
    render(
      <BlogArticle
        {...defaultProps}
        title=""
      />
    );

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render summary when summary is empty', () => {
    render(
      <BlogArticle
        {...defaultProps}
        summary=""
      />
    );

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('does not render any social links when none are provided', () => {
    render(
      <BlogArticle
        {...defaultProps}
        socialLinks={[]}
      />
    );

    expect(screen.getByText('SHARE')).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: /facebook/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
  });

  it('renders author metadata only when author is provided', () => {
    render(
      <BlogArticle
        {...defaultProps}
        author={undefined as never}
      />
    );

    expect(screen.queryByText(/^By /)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /jane doe/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'The avatar of Jane Doe' })).not.toBeInTheDocument();
  });

  it('renders the social share links', () => {
    render(<BlogArticle {...defaultProps} />);

    const facebookLink = screen.getByRole('link', { name: 'Share on Facebook' });
    const linkedinLink = screen.getByRole('link', { name: 'Share on LinkedIn' });

    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/example');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/example');
  });
});
