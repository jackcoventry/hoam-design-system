import React, { useLayoutEffect, useRef, useState } from 'react';
import './LogoCarousel.css';

type LogoCarouselItem = { id: number; src: string; alt?: string };
type LogoCarouselProps = {
  items: LogoCarouselItem[];
  pauseOnHover?: boolean;
  ariaLabel?: string;
};

export default function LogoCarousel({
  items,
  pauseOnHover = true,
  ariaLabel,
}: Readonly<LogoCarouselProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(2);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const rail = railRef.current;
    if (!container || !rail) return;

    const imgs = Array.from(rail.querySelectorAll('img'));
    let pending = imgs.length;
    if (!imgs.length) return;

    const done = () => {
      pending -= 1;
      if (pending === 0) {
        requestAnimationFrame(() => {
          let r = repeat;
          // This is just a guard against runaway loop
          for (let safe = 0; safe < 20; safe++) {
            if (rail.scrollWidth >= container.clientWidth * 2) break;
            r += 1;
            setRepeat(r);
          }
        });
      }
    };

    imgs.forEach((image) => {
      if (image.complete) done();
      else {
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
      }
    });
  }, [items]);

  // Build N sequences; first gets aria, others hidden
  const sequences = Array.from({ length: repeat }, (_, i) => (
    <ul
      className={`hoam-logo-carousel__sequence ${i > 0 ? 'hoam-logo-carousel__sequence--clone' : ''}`}
      aria-hidden={i > 0 || undefined}
      key={i}
    >
      {items.map((it) => (
        <li
          className="hoam-logo-carousel__item"
          key={`${i}-${it.id}`}
        >
          <img
            src={it.src}
            alt={it.alt || `Logo ${it.id}`}
            loading="eager"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  ));

  return (
    <div
      ref={containerRef}
      className="hoam-logo-carousel"
      data-pause={pauseOnHover ? 'true' : 'false'}
      aria-label={ariaLabel}
    >
      <div
        ref={railRef}
        className="hoam-logo-carousel__rail"
      >
        {sequences}
      </div>
    </div>
  );
}
