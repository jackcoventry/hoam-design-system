import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

import {
  InfoGridItem,
  type InfoGridItemProps,
} from '@/components/InfoGrid/InfoGridItem/InfoGridItem';
import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { logger } from '@/utils/logger';

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
    <Section
      className={styles.root}
      space="4xl"
    >
      <Stack gap="2xl">
        <Container>
          <Grid>
            <GridItem
              className={styles.content}
              span={12}
              spanLg={8}
              startLg={3}
            >
              <Stack>
                <h2 className={styles.title}>{title}</h2>
                {description ? <p className={styles.description}>{description}</p> : null}
              </Stack>
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

              logger.warn(INVALID_CHILD_MESSAGE);
              return null;
            })}
          </Grid>
        </Container>
      </Stack>
    </Section>
  );
}
