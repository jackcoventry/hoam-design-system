import { CSSProperties, useId } from 'react';

import { BodyText } from '@/components/Common/BodyText';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';
import type { TypographyToken } from '@/design-tokens/types';

import styles from './Typography.module.css';

type TypographyDocsProps = {
  tokens: TypographyToken[];
  previewText?: string;
};

export function TypographyDocs({
  tokens,
  previewText = 'The quick brown fox jumps over the lazy dog',
}: Readonly<TypographyDocsProps>) {
  const id = useId();

  return (
    <Container width="full">
      <Grid>
        <GridItem span={12}>
          <Stack gap="2xl">
            <BodyText>
              <h1>Typography</h1>
            </BodyText>
            <div className={styles.root}>
              {tokens.map((token) => {
                const previewStyle = {
                  font: `var(${token.cssVar})`,
                } satisfies CSSProperties;
                return (
                  <section
                    key={id}
                    className={styles.card}
                    aria-labelledby={`type-token-${id}`}
                  >
                    <div className={styles.preview}>
                      <p
                        id={`type-token-${id}`}
                        className={styles.specimen}
                        style={previewStyle}
                      >
                        {previewText}
                      </p>
                    </div>

                    <div className={styles.meta}>
                      <div className={styles.row}>
                        <span className={styles.label}>Token</span>
                        <code className={styles.code}>{token.cssVar}</code>
                      </div>

                      <div className={styles.row}>
                        <span className={styles.label}>Output</span>
                        <code className={styles.code}>{String(token.value)}</code>
                      </div>

                      <dl className={styles.breakdown}>
                        <div>
                          <dt>Family</dt>
                          <dd>{token.originalValues?.lineHeight}</dd>
                        </div>

                        <div>
                          <dt>Size</dt>
                          <dd>
                            <code>{token.originalValues?.fontSize}</code>
                          </dd>
                        </div>

                        <div>
                          <dt>Weight</dt>
                          <dd>{token.originalValues?.fontWeight}</dd>
                        </div>

                        <div>
                          <dt>Line height</dt>
                          <dd>{token.originalValues?.lineHeight}</dd>
                        </div>
                      </dl>
                    </div>
                  </section>
                );
              })}
            </div>
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  );
}
