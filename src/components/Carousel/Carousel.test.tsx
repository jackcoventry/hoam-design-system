import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Carousel, type CarouselProps } from './Carousel';

vi.mock('swiper/css', () => ({}));
vi.mock('swiper/css/navigation', () => ({}));
vi.mock('swiper/css/pagination', () => ({}));
vi.mock('swiper/css/scrollbar', () => ({}));
vi.mock('swiper/css/effect-fade', () => ({}));

vi.mock('./Carousel.module.css', () => ({
  default: {
    root: 'root',
  },
}));

vi.mock('clsx', () => ({
  default: (...values: Array<string | false | null | undefined>) =>
    values.filter(Boolean).join(' '),
}));

vi.mock('swiper/modules', () => ({
  A11y: { name: 'A11y' },
  Autoplay: { name: 'Autoplay' },
  EffectFade: { name: 'EffectFade' },
  Keyboard: { name: 'Keyboard' },
  Navigation: { name: 'Navigation' },
  Pagination: { name: 'Pagination' },
  Scrollbar: { name: 'Scrollbar' },
}));

type MockSwiperProps = {
  children?: ReactNode;
  modules?: Array<{ name: string }>;
  a11y?: {
    enabled: boolean;
    containerMessage: string;
  };
  navigation?: boolean;
  pagination?: false | { clickable: boolean };
  scrollbar?: false | { draggable: boolean };
  loop?: boolean;
  centeredSlides?: boolean;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  effect?: 'slide' | 'fade';
  keyboard?: { enabled: true };
  fadeEffect?: { crossFade: true };
  autoplay?: {
    delay: number;
    disableOnInteraction: boolean;
  };
  breakpoints?: CarouselProps<unknown>['breakpoints'];
  speed?: number;
  allowTouchMove?: boolean;
};

type MockSwiperSlideProps = {
  children?: ReactNode;
  className?: string;
};

const capturedSwiperProps: MockSwiperProps[] = [];
const capturedSwiperSlideProps: MockSwiperSlideProps[] = [];

vi.mock('swiper/react', () => ({
  Swiper: (props: MockSwiperProps) => {
    capturedSwiperProps.push(props);

    return <div data-testid="swiper">{props.children}</div>;
  },
  SwiperSlide: (props: MockSwiperSlideProps) => {
    capturedSwiperSlideProps.push(props);

    return (
      <div
        data-testid="swiper-slide"
        className={props.className}
      >
        {props.children}
      </div>
    );
  },
}));

describe('Carousel', () => {
  type TestSlide = {
    id: string;
    title: string;
  };

  const slides: TestSlide[] = [
    { id: 'slide-1', title: 'First slide' },
    { id: 'slide-2', title: 'Second slide' },
    { id: 'slide-3', title: 'Third slide' },
  ];

  const renderSlide = vi.fn<(slide: TestSlide, index: number) => ReactNode>();
  const getSlideKey = vi.fn<(slide: TestSlide, index: number) => string>();

  const baseProps: CarouselProps<TestSlide> = {
    slides,
    getSlideKey,
    renderSlide,
  };

  const getSwiperProps = (): MockSwiperProps => {
    expect(capturedSwiperProps).toHaveLength(1);

    const props = capturedSwiperProps[0];

    if (!props) {
      throw new Error('Expected Swiper to be rendered once');
    }

    return props;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    capturedSwiperProps.length = 0;
    capturedSwiperSlideProps.length = 0;

    getSlideKey.mockImplementation((slide) => slide.id);
    renderSlide.mockImplementation((slide) => <div>{slide.title}</div>);
  });

  it('renders all slides', () => {
    render(<Carousel {...baseProps} />);

    expect(screen.getByText('First slide')).toBeInTheDocument();
    expect(screen.getByText('Second slide')).toBeInTheDocument();
    expect(screen.getByText('Third slide')).toBeInTheDocument();
    expect(screen.getAllByTestId('swiper-slide')).toHaveLength(3);
  });

  it('calls getSlideKey for each slide with the correct arguments', () => {
    render(<Carousel {...baseProps} />);

    expect(getSlideKey).toHaveBeenCalledTimes(3);
    expect(getSlideKey).toHaveBeenNthCalledWith(1, slides[0], 0);
    expect(getSlideKey).toHaveBeenNthCalledWith(2, slides[1], 1);
    expect(getSlideKey).toHaveBeenNthCalledWith(3, slides[2], 2);
  });

  it('calls renderSlide for each slide with the correct arguments', () => {
    render(<Carousel {...baseProps} />);

    expect(renderSlide).toHaveBeenCalledTimes(3);
    expect(renderSlide).toHaveBeenNthCalledWith(1, slides[0], 0);
    expect(renderSlide).toHaveBeenNthCalledWith(2, slides[1], 1);
    expect(renderSlide).toHaveBeenNthCalledWith(3, slides[2], 2);
  });

  it('renders the root class and merges a custom className', () => {
    const { container } = render(
      <Carousel
        {...baseProps}
        className="custom-carousel"
      />
    );

    expect(container.firstChild).toHaveClass('root');
    expect(container.firstChild).toHaveClass('custom-carousel');
  });

  it('passes the slideClassName to every SwiperSlide', () => {
    render(
      <Carousel
        {...baseProps}
        slideClassName="custom-slide"
      />
    );

    expect(capturedSwiperSlideProps).toHaveLength(3);
    for (const slide of capturedSwiperSlideProps) {
      expect(slide.className).toBe('custom-slide');
    }
  });

  it('passes default Swiper props', () => {
    render(<Carousel {...baseProps} />);

    const props = getSwiperProps();

    expect(props.a11y).toEqual({
      enabled: true,
      containerMessage: 'Carousel',
    });
    expect(props.navigation).toBe(false);
    expect(props.pagination).toBe(false);
    expect(props.scrollbar).toBe(false);
    expect(props.loop).toBe(false);
    expect(props.centeredSlides).toBe(false);
    expect(props.slidesPerView).toBe(1);
    expect(props.spaceBetween).toBe(16);
    expect(props.effect).toBe('slide');
    expect(props.keyboard).toEqual({ enabled: true });
  });

  it('passes a custom aria-label to Swiper a11y config', () => {
    render(
      <Carousel
        {...baseProps}
        aria-label="Featured content"
      />
    );

    const props = getSwiperProps();

    expect(props.a11y).toEqual({
      enabled: true,
      containerMessage: 'Featured content',
    });
  });

  it('includes only A11y and Keyboard modules by default', () => {
    render(<Carousel {...baseProps} />);

    const props = getSwiperProps();

    expect(props.modules).toEqual([{ name: 'A11y' }, { name: 'Keyboard' }]);
  });

  it('includes Navigation when navigation is enabled', () => {
    render(
      <Carousel
        {...baseProps}
        navigation
      />
    );

    const props = getSwiperProps();

    expect(props.navigation).toBe(true);
    expect(props.modules).toContainEqual({ name: 'Navigation' });
  });

  it('includes Pagination and sets clickable pagination config when pagination is enabled', () => {
    render(
      <Carousel
        {...baseProps}
        pagination
      />
    );

    const props = getSwiperProps();

    expect(props.modules).toContainEqual({ name: 'Pagination' });
    expect(props.pagination).toEqual({ clickable: true });
  });

  it('includes Scrollbar and sets draggable scrollbar config when scrollbar is enabled', () => {
    render(
      <Carousel
        {...baseProps}
        scrollbar
      />
    );

    const props = getSwiperProps();

    expect(props.modules).toContainEqual({ name: 'Scrollbar' });
    expect(props.scrollbar).toEqual({ draggable: true });
  });

  it('includes Autoplay and uses default autoplay config when autoplay is true', () => {
    render(
      <Carousel
        {...baseProps}
        autoplay
      />
    );

    const props = getSwiperProps();

    expect(props.modules).toContainEqual({ name: 'Autoplay' });
    expect(props.autoplay).toEqual({
      delay: 5000,
      disableOnInteraction: false,
    });
  });

  it('includes Autoplay and resolves custom autoplay values', () => {
    render(
      <Carousel
        {...baseProps}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
      />
    );

    const props = getSwiperProps();

    expect(props.modules).toContainEqual({ name: 'Autoplay' });
    expect(props.autoplay).toEqual({
      delay: 2500,
      disableOnInteraction: true,
    });
  });

  it('fills in missing autoplay options with defaults', () => {
    render(
      <Carousel
        {...baseProps}
        autoplay={{ delay: 3000 }}
      />
    );

    const props = getSwiperProps();

    expect(props.autoplay).toEqual({
      delay: 3000,
      disableOnInteraction: false,
    });
  });

  it('does not pass autoplay when autoplay is false', () => {
    render(
      <Carousel
        {...baseProps}
        autoplay={false}
      />
    );

    const props = getSwiperProps();

    expect(props.autoplay).toBeUndefined();
  });

  it('includes EffectFade and fadeEffect when effect is fade', () => {
    render(
      <Carousel
        {...baseProps}
        effect="fade"
      />
    );

    const props = getSwiperProps();

    expect(props.modules).toContainEqual({ name: 'EffectFade' });
    expect(props.effect).toBe('fade');
    expect(props.fadeEffect).toEqual({ crossFade: true });
  });

  it('does not pass fadeEffect when effect is slide', () => {
    render(
      <Carousel
        {...baseProps}
        effect="slide"
      />
    );

    const props = getSwiperProps();

    expect(props.effect).toBe('slide');
    expect(props.fadeEffect).toBeUndefined();
  });

  it('passes keyboard config when keyboard is true', () => {
    render(
      <Carousel
        {...baseProps}
        keyboard
      />
    );

    const props = getSwiperProps();

    expect(props.keyboard).toEqual({ enabled: true });
  });

  it('does not pass keyboard config when keyboard is false', () => {
    render(
      <Carousel
        {...baseProps}
        keyboard={false}
      />
    );

    const props = getSwiperProps();

    expect(props.keyboard).toBeUndefined();
  });

  it('passes loop, centeredSlides, slidesPerView and spaceBetween', () => {
    render(
      <Carousel
        {...baseProps}
        loop
        centeredSlides
        slidesPerView="auto"
        spaceBetween={24}
      />
    );

    const props = getSwiperProps();

    expect(props.loop).toBe(true);
    expect(props.centeredSlides).toBe(true);
    expect(props.slidesPerView).toBe('auto');
    expect(props.spaceBetween).toBe(24);
  });

  it('passes breakpoints when provided', () => {
    const breakpoints = {
      640: { slidesPerView: 1 },
      1024: { slidesPerView: 3 },
    };

    render(
      <Carousel
        {...baseProps}
        breakpoints={breakpoints}
      />
    );

    const props = getSwiperProps();

    expect(props.breakpoints).toEqual(breakpoints);
  });

  it('does not pass breakpoints when not provided', () => {
    render(<Carousel {...baseProps} />);

    const props = getSwiperProps();

    expect(props.breakpoints).toBeUndefined();
  });

  it('passes swiperProps through to Swiper', () => {
    render(
      <Carousel
        {...baseProps}
        swiperProps={{
          speed: 700,
          allowTouchMove: false,
        }}
      />
    );

    const props = getSwiperProps();

    expect(props.speed).toBe(700);
    expect(props.allowTouchMove).toBe(false);
  });

  it('supports rendering with an empty slides array', () => {
    render(
      <Carousel
        {...baseProps}
        slides={[]}
      />
    );

    expect(screen.getByTestId('swiper')).toBeInTheDocument();
    expect(screen.queryAllByTestId('swiper-slide')).toHaveLength(0);
    expect(getSlideKey).not.toHaveBeenCalled();
    expect(renderSlide).not.toHaveBeenCalled();
  });

  it('includes all optional modules when all related features are enabled', () => {
    render(
      <Carousel
        {...baseProps}
        navigation
        pagination
        scrollbar
        autoplay
        effect="fade"
      />
    );

    const props = getSwiperProps();

    expect(props.modules).toEqual([
      { name: 'A11y' },
      { name: 'Keyboard' },
      { name: 'Navigation' },
      { name: 'Pagination' },
      { name: 'Scrollbar' },
      { name: 'Autoplay' },
      { name: 'EffectFade' },
    ]);
  });
});
