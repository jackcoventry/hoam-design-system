import InfoGridItem, { InfoGridItemProps } from '@/components/InfoGrid/InfoGridItem/InfoGridItem';

import { Children, isValidElement, ReactElement, ReactNode } from 'react';
import './InfoGrid.css';

type InfoGridProps = {
  title: string;
  description?: string;
  children: ReactNode | ReactNode[];
};

function isInfoGridItemElement(child: ReactNode): child is ReactElement<InfoGridItemProps> {
  return isValidElement(child) && child.type === InfoGridItem;
}

function InfoGrid({ title, description, children }: Readonly<InfoGridProps>) {
  return (
    <div className="hoam-info-grid">
      <div className="container">
        <div className="grid">
          <div className="hoam-info-grid__content | span-12 lg:span-6 lg:start-4 body-text">
            {title && <h2 className="hoam-info-grid__title">{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="grid">
          {Children.map(children, (child, index) => {
            if (
              isValidElement(child) &&
              index < 3 && // Keep to 3 children or below for now
              isInfoGridItemElement(child)
            ) {
              return <div className="span-12 lg:span-4">{child}</div>;
            } else {
              console.error('InfoGrid component only accepts child of type InfoGridItem');
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default InfoGrid;
