import React from 'react';
import './InfoGridItem.css';

export type InfoGridItemProps = {
  title: string;
  description: string;
  icon: string;
};

function InfoGridItem({ title, description, icon }: Readonly<InfoGridItemProps>) {
  return (
    <div className="hoam-info-grid-item | mb-lg lg:mb-0">
      <span className="hoam-info-grid-item__icon">
        <svg
          className="icon"
          width="3em"
          height="3em"
          fill="currentColor"
        >
          <use xlinkHref={`/icons/icons.svg#${icon}`} />
        </svg>
      </span>
      <h3 className="hoam-info-grid-item__title">{title}</h3>
      <p className="hoam-info-grid-item__description">{description}</p>
    </div>
  );
}

export default InfoGridItem;
