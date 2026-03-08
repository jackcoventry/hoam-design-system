import './RichLink.css';

export type RichLinkProps = {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
};

export function RichLink({ href, title, image, imageAlt = '' }: Readonly<RichLinkProps>) {
  return (
    <a
      href={href}
      className="hoam-rich-link"
    >
      <span className="hoam-rich-link__text">{title}</span>
      <img
        src={image}
        alt={imageAlt}
        className="hoam-rich-link__image"
      />
    </a>
  );
}
