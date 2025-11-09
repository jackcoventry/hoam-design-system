import React from 'react';
import './LogoCarousel.css';

type LogoCarouselItem = {
  id: number;
  src: string;
  alt?: string;
};

type LogoCarouselProps = {
  items: Array<LogoCarouselItem>;
  pauseOnHover?: boolean;
  ariaLabel?: string;
};

function LogoCarousel({ items, pauseOnHover = true, ariaLabel }: Readonly<LogoCarouselProps>) {
  return (
    <div
      className="hoam-logo-carousel"
      data-pause={pauseOnHover ? 'true' : 'false'}
      aria-label={ariaLabel}
    >
      <ul className="hoam-logo-carousel__track">
        {items.map((item, i) => (
          <li
            className="hoam-logo-carousel__item"
            key={`a-${item.id}`}
          >
            <img
              src={item.src}
              alt={item.alt || `Logo ${item.id}`}
            />
          </li>
        ))}
      </ul>

      <ul
        className="hoam-logo-carousel__track"
        aria-hidden="true"
      >
        {items.map((item, i) => (
          <li
            className="hoam-logo-carousel__item"
            key={`b-${item.id}`}
          >
            <img
              src={item.src}
              alt={item.alt || `Logo ${item.id}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LogoCarousel;
