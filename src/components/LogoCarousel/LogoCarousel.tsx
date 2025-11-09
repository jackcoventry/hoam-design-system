import React from 'react';
import './LogoCarousel.css';

type MarqueeProps = {
  items: Array<React.ReactNode | string>;
  pauseOnHover?: boolean;
  ariaLabel?: string;
};

function LogoCarousel({ items, pauseOnHover = true, ariaLabel }: Readonly<MarqueeProps>) {
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
            {item}
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
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LogoCarousel;
