import { Button } from '@/components/Button/Button';
import getTokenByName from '@/utils/getTokenByName';
import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperCore } from 'swiper';
import { A11y, FreeMode, Keyboard, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import '@/components/Common/Dots.css';
import './ImageGallery.css';

type ImageProps = {
  id: string;
  thumb?: string;
  src: string;
  alt?: string;
  title?: string;
};

export type Props = {
  images?: ImageProps[];
};

function ImageGallery({ images = [] }: Readonly<Props>) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const pagRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const spacingToken = getTokenByName('hoam-spacing-5');
  const spacing =
    typeof spacingToken === 'number' ? spacingToken : Number.parseFloat(String(spacingToken)) || 8;

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
      bulletClass: 'hoam-dots__bullet',
      bulletActiveClass: 'hoam-dots__bullet:active',
      // Has to return string
      renderBullet: (index, className) =>
        `<button type="button" class="${className}" aria-label="Go to slide ${index + 1}">
           <span class="hoam-dots__bullet-inner">${index + 1}</span>
         </button>`,
    };
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
      <div className="hoam-image-gallery__thumbs">
        <Swiper
          freeMode
          modules={[Thumbs, FreeMode]}
          slidesPerView={5}
          spaceBetween={spacing}
          a11y={{ enabled: true }}
          direction="vertical"
          onSwiper={(s) => {
            setThumbsSwiper(s);
            queueMicrotask(() => s.update());
          }}
          watchSlidesProgress
        >
          {images?.map((image, index) => (
            <SwiperSlide key={`${image.id}-${index}`}>
              <img
                className="hoam-image-gallery__thumb-image"
                src={image.thumb ?? image.src}
                alt={image.alt ?? `Slide ${index + 1}`}
                onLoad={() => thumbsSwiper?.update()}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="hoam-image-gallery__images">
        <div className="hoam-image-gallery__controls">
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
          <div className="hoam-image-gallery__dots-wrapper">
            <div
              ref={pagRef}
              className="hoam-dots"
              aria-label="Slide pagination"
            />
          </div>
        </div>
        <Swiper
          keyboard={{
            enabled: true,
          }}
          modules={[Pagination, Navigation, Keyboard, A11y, Thumbs]}
          onBeforeInit={handleBeforeInit}
          onSwiper={(s) => (swiperRef.current = s)}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          a11y={{ enabled: true }}
        >
          {images?.map((image, index) => (
            <SwiperSlide key={`${image.id}-${index}`}>
              {
                <img
                  src={image.src}
                  alt={image.title}
                  className="hoam-image-gallery__img"
                />
              }
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ImageGallery;
