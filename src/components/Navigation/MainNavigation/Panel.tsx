import { Container, Grid, GridItem } from '@/components/Layout';
import { PanelProps } from '@/components/Navigation/types';

import styles from '@/components/Navigation/Navigation.module.css';

export function Panel({ id, labelledBy, hidden, onEnter, left, right }: Readonly<PanelProps>) {
  return (
    <div
      id={id}
      className={styles.panel}
      aria-labelledby={labelledBy}
      hidden={hidden}
      onPointerEnter={onEnter}
    >
      <Container>
        <Grid>
          <GridItem
            span={12}
            spanLg={8}
          >
            {left}
          </GridItem>
          <GridItem
            span={12}
            spanLg={4}
          >
            {right}
          </GridItem>
        </Grid>
      </Container>
    </div>
  );
}
