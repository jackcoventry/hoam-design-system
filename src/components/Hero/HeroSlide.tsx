import { Button } from '@/components/Button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

import styles from '@/components/Hero/Hero.module.css';

export type HeroSlideProps = {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  image?: string | undefined;
  video?: string | undefined;
  theme?: string | undefined;
  button: { url: string; text?: string };
};

export function HeroSlide({
  title = '',
  subtitle,
  text,
  image = '',
  video,
  theme = 'default',
  button,
}: Readonly<HeroSlideProps>) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoProps = {
    muted: true,
    className: styles.video,
    ...(!prefersReducedMotion && { autoPlay: true, loop: true }),
  };

  return (
    <div
      className={styles.slide}
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
      <div className={styles.content}>
        <p className={styles.subtitle}>{subtitle}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{text}</p>
        <div className={styles.contentLink}>
          <Button variant={theme === 'default' ? 'primary' : 'secondary'}>
            {button?.text || 'Read more'}
          </Button>
        </div>
      </div>
    </div>
  );
}
