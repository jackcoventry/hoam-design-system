import { Children, isValidElement, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

import { InfoGridItem, type InfoGridItemProps } from '@/components/InfoGrid';

import styles from '@/components/InfoGrid/InfoGrid.module.css';

export type InfoGridProps = {
  title: string;
  description?: string | undefined;
  children: ReactNode | ReactNode[];
};

function isInfoGridItemElement(child: ReactNode): child is ReactElement<InfoGridItemProps> {
  return isValidElement(child) && child.type === InfoGridItem;
}

export function InfoGrid({ title, description, children }: Readonly<InfoGridProps>) {
  return (
    <div className={styles.root}>
      <div className="container">
        <div className="grid">
          <div className={clsx(styles.content, 'span-12 lg:span-6 lg:start-4 body-text')}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        </div>
      </div>
      {/* TODO: Remove grid */}
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
