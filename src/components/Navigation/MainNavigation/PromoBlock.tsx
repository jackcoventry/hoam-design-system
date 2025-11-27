import React from 'react';

function PromoBlock({ title, subtitle, href, image }) {
  const Element = href ? 'a' : 'div';
  const interactiveProps = href
    ? {
        href,
        'data-sub-link': true,
      }
    : {};

  return (
    <Element
      {...interactiveProps}
      style={
        image && {
          backgroundImage: `url(${image})`,
        }
      }
      className="hoam-navigation-promo"
    >
      <h4 className="hoam-navigation-promo__subtitle">{subtitle}</h4>
      <h3 className="hoam-navigation-promo__title">{title}</h3>
    </Element>
  );
}

export default PromoBlock;
