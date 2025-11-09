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
    <div className="span-12 lg:span-6">
      <img
        src={imageUrl}
        alt={title}
      />
    </div>
  );

  const contentText = () => (
    <div className="span-12 lg:span-6">
      {title && <h2>{title}</h2>}
      {subtitle && <h3>{subtitle}</h3>}
      {description && <p>{description}</p>}
      {linkUrl && linkText && (
        <a
          href={linkUrl}
          className="hoam-button"
        >
          {linkText}
        </a>
      )}
    </div>
  );

  return (
    <div className="hoam-promo-section">
      <div className="container">
        <div className="grid">
          {alignment === 'left' ? (
            <>
              {contentImage()}
              {contentText()}
            </>
          ) : (
            <>
              {contentText()}
              {contentImage()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PromoSection;
