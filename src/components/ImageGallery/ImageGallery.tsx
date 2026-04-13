import { Carousel } from '@/components/Carousel';

import styles from './ImageGallery.module.css';

type ImageProps = {
  id: string | number;
  src: string;
  alt?: string;
  title?: string;
};

export type ImageGalleryProps = {
  images?: ImageProps[];
  'aria-label'?: string;
};

export function ImageGallery({
  images = [],
  'aria-label': ariaLabel = 'Image gallery',
}: Readonly<ImageGalleryProps>) {
  if (!images.length) return null;

  return (
    <div className={styles.root}>
      <Carousel
        slides={images}
        getSlideKey={(item) => item.id}
        renderSlide={(item) => (
          <div>
            <img
              src={item.src}
              alt={item.alt}
              className={styles.img}
            />
          </div>
        )}
        navigation
        pagination
        loop
        aria-label={ariaLabel}
      />
    </div>
  );
}
