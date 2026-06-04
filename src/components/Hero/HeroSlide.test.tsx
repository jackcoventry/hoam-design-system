import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HeroSlide, type HeroSlideProps } from '@/components/Hero/HeroSlide';

type Messages = {
  readMore: string;
};

const mockUseMessages = vi.fn<(namespace: string) => Messages>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/components/Hero/HeroSlide.module.css', () => ({
  default: {
    root: 'root',
    background: 'background',
    backgroundImage: 'backgroundImage',
    content: 'content',
    subtitle: 'subtitle',
    title: 'title',
    text: 'text',
    contentLink: 'contentLink',
    media: 'media',
    textContent: 'textContent',
  },
}));

type MockButtonProps = {
  children: ReactNode;
  as?: 'a';
  href?: string;
};

type MockGridProps = {
  children: ReactNode;
  cols?: number;
};

type MockGridItemProps = {
  children: ReactNode;
  span?: number;
  spanLg?: number;
  className?: string;
};

const capturedGridItemProps: MockGridItemProps[] = [];

vi.mock('@/components/Button', () => ({
  Button: ({ children, as, href }: MockButtonProps) =>
    as === 'a' ? (
      <a href={href}>{children}</a>
    ) : (
      <button type="button">{children}</button>
    ),
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children, cols }: MockGridProps) => (
    <div
      data-testid="grid"
      data-cols={cols}
    >
      {children}
    </div>
  ),
  GridItem: (props: MockGridItemProps) => {
    capturedGridItemProps.push(props);

    return (
      <div
        data-testid="grid-item"
        data-span={props.span}
        data-span-lg={props.spanLg}
        className={props.className}
      >
        {props.children}
      </div>
    );
  },
}));

describe('HeroSlide', () => {
  const baseProps: HeroSlideProps = {
    id: '1',
    title: 'Hero Title',
    subtitle: 'Hero Subtitle',
    text: 'Hero text content',
    button: {
      url: '/test',
      text: 'Click me',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    capturedGridItemProps.length = 0;

    mockUseMessages.mockReturnValue({
      readMore: 'Read more',
    });
  });

  it('renders the text content', () => {
    render(<HeroSlide {...baseProps} />);

    expect(screen.getByText('Hero Subtitle')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Hero Title' })).toBeInTheDocument();
    expect(screen.getByText('Hero text content')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click me' })).toHaveAttribute('href', '/test');
  });

  it('calls useMessages with the global namespace', () => {
    render(<HeroSlide {...baseProps} />);

    expect(mockUseMessages).toHaveBeenCalledWith('global');
  });

  it('falls back to translated button text when button text is undefined', () => {
    render(
      <HeroSlide
        {...baseProps}
        button={{ url: '/test', text: undefined }}
      />
    );

    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/test');
  });

  it('falls back to translated button text when button text is an empty string', () => {
    render(
      <HeroSlide
        {...baseProps}
        button={{ url: '/test', text: '' }}
      />
    );

    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/test');
  });

  it('renders no background when background is not provided', () => {
    const { container } = render(<HeroSlide {...baseProps} />);

    expect(container.querySelector('img.backgroundImage')).not.toBeInTheDocument();
  });

  it('renders a decorative background image when image background is provided', () => {
    const { container } = render(
      <HeroSlide
        {...baseProps}
        background={{ src: '/image.jpg' }}
      />
    );

    const image = container.querySelector('img.backgroundImage');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/image.jpg');
    expect(image).toHaveAttribute('alt', '');
  });

  it('renders a featured image when provided', () => {
    render(
      <HeroSlide
        {...baseProps}
        featuredImage={{ src: '/feature.jpg', alt: 'Featured image alt' }}
      />
    );

    const image = screen.getByAltText('Featured image alt');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/feature.jpg');
    expect(image).toHaveClass('media');
  });

  it('renders one grid item when there is no featured image', () => {
    render(<HeroSlide {...baseProps} />);

    expect(screen.getAllByTestId('grid-item')).toHaveLength(1);
    expect(capturedGridItemProps[0]?.span).toBe(2);
    expect(capturedGridItemProps[0]?.spanLg).toBe(2);
  });

  it('renders two grid items when there is a featured image', () => {
    render(
      <HeroSlide
        {...baseProps}
        featuredImage={{ src: '/feature.jpg', alt: 'Featured image alt' }}
      />
    );

    expect(screen.getAllByTestId('grid-item')).toHaveLength(2);
    expect(capturedGridItemProps[0]?.span).toBe(2);
    expect(capturedGridItemProps[0]?.spanLg).toBe(1);
    expect(capturedGridItemProps[1]?.span).toBe(2);
    expect(capturedGridItemProps[1]?.spanLg).toBe(1);
  });

  it('renders an empty heading when title is empty', () => {
    render(
      <HeroSlide
        {...baseProps}
        title=""
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the expected layout primitives', () => {
    render(<HeroSlide {...baseProps} />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toHaveAttribute('data-cols', '2');
  });
});
