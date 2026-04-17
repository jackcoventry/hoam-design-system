import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HeroSlide, type HeroSlideProps } from '@/components/Hero/HeroSlide';

type Messages = {
  readMore: string;
};

const mockUseMessages = vi.fn<(namespace: string) => Messages>();
const mockUsePrefersReducedMotion = vi.fn<() => boolean>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => mockUsePrefersReducedMotion(),
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
    video: 'video',
  },
}));

type MockButtonProps = {
  children: ReactNode;
  variant?: string;
};

type MockGridProps = {
  children: ReactNode;
  cols?: number;
};

type MockGridItemProps = {
  children: ReactNode;
  span?: number;
  spanMd?: number;
  className?: string;
};

const capturedGridItemProps: MockGridItemProps[] = [];

vi.mock('@/components/Button', () => ({
  Button: ({ children, variant }: MockButtonProps) => (
    <button
      type="button"
      data-variant={variant}
    >
      {children}
    </button>
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
        data-span-md={props.spanMd}
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
    mockUsePrefersReducedMotion.mockReturnValue(false);
  });

  it('renders the text content', () => {
    render(<HeroSlide {...baseProps} />);

    expect(screen.getByText('Hero Subtitle')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Hero Title' })).toBeInTheDocument();
    expect(screen.getByText('Hero text content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
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

    expect(screen.getByRole('button', { name: 'Read more' })).toBeInTheDocument();
  });

  it('falls back to translated button text when button text is an empty string', () => {
    render(
      <HeroSlide
        {...baseProps}
        button={{ url: '/test', text: '' }}
      />
    );

    expect(screen.getByRole('button', { name: 'Read more' })).toBeInTheDocument();
  });

  it('uses the tertiary button variant', () => {
    render(<HeroSlide {...baseProps} />);

    expect(screen.getByRole('button', { name: 'Click me' })).toHaveAttribute(
      'data-variant',
      'tertiary'
    );
  });

  it('renders no background when background is not provided', () => {
    const { container } = render(<HeroSlide {...baseProps} />);

    expect(container.querySelector('video')).not.toBeInTheDocument();
    expect(container.querySelector('img.backgroundImage')).not.toBeInTheDocument();
  });

  it('renders a decorative background image when image background is provided', () => {
    const { container } = render(
      <HeroSlide
        {...baseProps}
        background={{ kind: 'image', src: '/image.jpg' }}
      />
    );

    const image = container.querySelector('img.backgroundImage');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/image.jpg');
    expect(image).toHaveAttribute('alt', '');
  });

  it('renders a video background when video background is provided', () => {
    const { container } = render(
      <HeroSlide
        {...baseProps}
        background={{ kind: 'video', src: '/video.mp4' }}
      />
    );

    const video = container.querySelector('video');
    const source = container.querySelector('source');
    const track = container.querySelector('track');

    if (!(video instanceof HTMLVideoElement)) {
      throw new TypeError('Expected a video element');
    }

    expect(video).toBeInTheDocument();
    expect(video.muted).toBe(true);
    expect(video).toHaveClass('video');

    expect(source).toHaveAttribute('src', '/video.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
    expect(track).toHaveAttribute('kind', 'captions');
  });

  it('enables autoplay and loop on the video when reduced motion is false', () => {
    const { container } = render(
      <HeroSlide
        {...baseProps}
        background={{ kind: 'video', src: '/video.mp4' }}
      />
    );

    const video = container.querySelector('video');

    expect(video).toHaveProperty('autoplay', true);
    expect(video).toHaveProperty('loop', true);
  });

  it('does not enable autoplay or loop on the video when reduced motion is true', () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    const { container } = render(
      <HeroSlide
        {...baseProps}
        background={{ kind: 'video', src: '/video.mp4' }}
      />
    );

    const video = container.querySelector('video');

    expect(video).not.toHaveAttribute('autoplay');
    expect(video).not.toHaveAttribute('loop');
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
    expect(capturedGridItemProps[0]?.spanMd).toBe(2);
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
    expect(capturedGridItemProps[0]?.spanMd).toBe(1);
    expect(capturedGridItemProps[1]?.span).toBe(2);
    expect(capturedGridItemProps[1]?.spanMd).toBe(1);
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
