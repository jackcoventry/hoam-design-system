import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import clsx from 'clsx';

import { InfoGridItem, type InfoGridItemProps } from '@/components/InfoGrid';

import { Container, Grid, GridItem } from '../Layout';

import bodyText from '@/components/common/BodyText.module.css';
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
      <Container>
        <Grid>
          <GridItem
            className={clsx(styles.content, bodyText.root)}
            span={12}
            spanLg={6}
            startLg={4}
          >
            <h2 className={styles.title}>{title}</h2>
            {description ? <p>{description}</p> : null}
          </GridItem>
        </Grid>
      </Container>

      <Container>
        <Grid>
          {Children.map(children, (child, index) => {
            if (index < MAX_ITEMS && isInfoGridItemElement(child)) {
              return (
                <GridItem
                  span={12}
                  spanLg={4}
                >
                  {child}
                </GridItem>
              );
            }

            console.error(INVALID_CHILD_MESSAGE);
            return null;
          })}
        </Grid>
      </Container>
    </div>
  );
}
