type Props = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

export function PromoBlock({ title, subtitle, href, image = '' }: Readonly<Props>) {
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
      style={{
        backgroundImage: `url(${image})`,
      }}
      className="hoam-navigation-promo"
    >
      <h4 className="hoam-navigation-promo__subtitle">{subtitle}</h4>
      <h3 className="hoam-navigation-promo__title">{title}</h3>
    </Element>
  );
}
