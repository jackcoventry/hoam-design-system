import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import clsx from 'clsx';

import { InfoGridItem, type InfoGridItemProps } from '@/components/InfoGrid';

import styles from '@/components/InfoGrid/InfoGrid.module.css';

export type InfoGridProps = {
  title: string;
  description?: string | undefined;
  children: ReactNode | ReactNode[];
};

const INVALID_CHILD_MESSAGE = 'InfoGrid component only accepts child of type InfoGridItem';
const MAX_ITEMS = 3;

function isInfoGridItemElement(child: ReactNode): child is ReactElement<InfoGridItemProps> {
  return isValidElement(child) && child.type === InfoGridItem;
}

export function InfoGrid({ title, description, children }: Readonly<InfoGridProps>) {
  return (
    <div className={styles.root}>
      <div className="container">
        <div className="grid">
          <div className={clsx(styles.content, 'span-12 lg:span-6 lg:start-4 body-text')}>
            <h2 className={styles.title}>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid">
          {Children.map(children, (child, index) => {
            if (index < MAX_ITEMS && isInfoGridItemElement(child)) {
              return <div className="span-12 lg:span-4">{child}</div>;
            }

            console.error(INVALID_CHILD_MESSAGE);
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
