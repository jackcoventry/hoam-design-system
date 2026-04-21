import { useCallback } from 'react';
import { Carousel } from '@/components/Carousel';
import { useMessages } from '@/hooks/useMessages';

import styles from './ImageGallery.module.css';

type ImageProps = {
  id: string | number;
  src: string;
  alt?: string;
};

export type ImageGalleryProps = {
  /** Images rendered as gallery slides. */
  images?: ImageProps[];
  /** Accessible label for the gallery carousel. */
  'aria-label'?: string;
};

export function ImageGallery({
  images = [],
  'aria-label': ariaLabel,
}: Readonly<ImageGalleryProps>) {
  const t = useMessages('imageGallery');
  const getSlideKey = useCallback((item: ImageProps) => item.id, []);
  const renderSlide = useCallback(
    (item: ImageProps) => (
      <div>
        <img
          src={item.src}
          alt={item.alt}
          className={styles.img}
        />
      </div>
    ),
    []
  );

  if (!images.length) return null;

  return (
    <div className={styles.root}>
      <Carousel
        slides={images}
        getSlideKey={getSlideKey}
        renderSlide={renderSlide}
        navigation
        pagination
        loop
        aria-label={ariaLabel ?? t.label}
      />
    </div>
  );
}
