import { Button } from '@/components/Button/Button';
import React from 'react';
import './PromoSection.css';

type PromoSectionProps = {
  title: string;
  subtitle?: string;
  description?: string;
  linkUrl?: string;
  linkText?: string;
  imageUrl?: string;
  alignment?: 'left' | 'right';
};

function PromoSection({
  title,
  subtitle,
  description,
  linkUrl,
  linkText,
  imageUrl,
  alignment = 'left',
}: Readonly<PromoSectionProps>) {
  const contentImage = () => (
    <div className="span-12 lg:span-5">
      <img
        src={imageUrl}
        alt={title}
        className="hoam-promo-section__image"
      />
    </div>
  );

  const contentText = () => (
    <div className="span-12 lg:span-6">
      <div className="hoam-promo-section__content">
        {subtitle && <h3 className="hoam-promo-section__subtitle">{subtitle}</h3>}
        {title && <h2 className="hoam-promo-section__title">{title}</h2>}
        {description && <p className="hoam-promo-section__description">{description}</p>}
        {linkUrl && linkText && <Button className="hoam-promo-section__button">{linkText}</Button>}
      </div>
    </div>
  );

  return (
    <div className="hoam-promo-section">
      <div className="container">
        <div className="grid">
          {alignment === 'left' ? (
            <>
              {contentImage()}
              {/* spacer */}
              <div className="lg:span-1" />
              {contentText()}
            </>
          ) : (
            <>
              {contentText()}
              {/* spacer */}
              <div className="lg:span-1" />
              {contentImage()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PromoSection;
