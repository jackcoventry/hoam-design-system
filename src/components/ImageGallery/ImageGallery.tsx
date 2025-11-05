import { Button } from '@/components/Button/Button';
import React, { useEffect, useRef } from 'react';
import type { Swiper as SwiperCore } from 'swiper';
import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './ImageGallery.css';

function ImageGallery({ images = [] }) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const pagRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const thumbBtnsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const handleBeforeInit = (swiper: SwiperCore) => {
    swiperRef.current = swiper;

    // Attach refs so Navigation/Pagination can initialize with them
    swiper.params.navigation = {
      ...(swiper.params.navigation as object),
      prevEl: prevRef.current,
      nextEl: nextRef.current,
    };

    swiper.params.pagination = {
      ...(swiper.params.pagination as object),
      el: pagRef.current,
      clickable: true,
      bulletClass: 'hoam-image-gallery__bullet',
      bulletActiveClass: 'hoam-image-gallery__bullet:active',
      // Has to return string
      renderBullet: (index, className) =>
        `<button type="button" class="${className}" aria-label="Go to slide ${index + 1}">
           <span class="hoam-image-gallery__bullet-inner">${index + 1}</span>
         </button>`,
    };
  };

  const goTo = (i: number) => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const length = images.length;
    const idx = ((i % length) + length) % length;
    swiper.params.loop ? swiper.slideToLoop(idx) : swiper.slideTo(idx);
    thumbBtnsRef.current[idx]?.focus();
  };

  const handleThumbKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const i = swiper.realIndex;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      goTo(i + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      goTo(i - 1);
    }
  };

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    // (Re)bind navigation if needed
    if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation?.destroy();
      swiper.navigation?.init();
      swiper.navigation?.update();
    }

    // (Re)bind pagination if needed
    if (swiper.params.pagination && typeof swiper.params.pagination !== 'boolean') {
      swiper.params.pagination.el = pagRef.current;
      swiper.pagination?.destroy();
      swiper.pagination?.init();
      swiper.pagination?.update();
    }
  }, []);

  return (
    <div className="hoam-image-gallery">
      <Button
        ref={prevRef}
        type="button"
        className="hoam-image-gallery__nav-btn"
        data-direction="left"
        aria-label="Previous slide"
        icon="arrow-left"
        iconOnly
      />
      <Button
        ref={nextRef}
        type="button"
        className="hoam-image-gallery__nav-btn"
        data-direction="right"
        aria-label="Next slide"
        icon="arrow-right"
        iconOnly
      />
      <div className="hoam__hero-controls">
        <div
          ref={pagRef}
          className="hoam-image-gallery__pagination"
          aria-label="Slide pagination"
        />
      </div>
      <Swiper
        centeredSlides={false}
        keyboard={{
          enabled: true,
        }}
        modules={[Pagination, Navigation, Keyboard, A11y]}
        onBeforeInit={handleBeforeInit}
        onSwiper={(s) => (swiperRef.current = s)}
      >
        {images?.map((image) => (
          <SwiperSlide>{<img src={image.src} />}</SwiperSlide>
        ))}
      </Swiper>
      <div
        className="thumbs"
        role="tablist"
        aria-label="Slide thumbnails"
        aria-orientation="vertical"
        tabIndex={0}
        onKeyDown={handleThumbKeyDown}
      >
        {images?.map((image, i) => {
          const isActive = i === swiperRef?.current?.activeIndex;
          return (
            <button
              key={image.src}
              type="button"
              ref={(el: HTMLButtonElement | null) => {
                thumbBtnsRef.current[i] = el;
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`slide-panel-${image.src}`}
              className={`thumb ${isActive ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
            >
              <img
                src={image.src}
                width={100}
                height={100}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ImageGallery;
