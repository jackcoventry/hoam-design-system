import { Button } from '@/components/Button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type HeroSlideProps = {
  title: string;
  subtitle: string;
  text: string;
  image?: string;
  video?: string;
  theme?: string;
  position?: string;
  button: { url: string; text?: string };
};

export function HeroSlide({
  title,
  subtitle,
  text,
  image = '',
  video,
  theme = 'default',
  button,
  position = 'left',
}: Readonly<HeroSlideProps>) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoProps = {
    muted: true,
    className: 'hoam-hero__video',
    ...(!prefersReducedMotion && { autoPlay: true, loop: true }),
  };

  return (
    <div
      className="hoam-hero__slide"
      data-position={position}
      data-theme={theme}
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      {video && (
        <video {...videoProps}>
          <track kind="captions" />
          <source
            src={video}
            type="video/mp4"
          />
        </video>
      )}
      <div className="hoam-hero__content">
        <p className="hoam-hero__subtitle">{subtitle}</p>
        <h1 className="hoam-hero__title">{title}</h1>
        <p className="hoam-hero__text">{text}</p>
        <div className="hoam-hero__content-link">
          <Button variant={theme === 'default' ? 'primary' : 'secondary'}>
            {button?.text || 'Read more'}
          </Button>
        </div>
      </div>
    </div>
  );
}
