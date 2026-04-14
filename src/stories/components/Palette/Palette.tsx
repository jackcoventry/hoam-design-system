import { Swatch } from '@/stories/components/Swatch/Swatch';
import { ColorSet } from '@/stories/foundations/Colors.stories';

import styles from './Palette.module.css';

type PaletteProps = {
  set: ColorSet;
};

export function Palette({ set }: Readonly<PaletteProps>) {
  return (
    <section className={styles.root}>
      <h3 className={styles.name}>{set.name}</h3>

      <div className={styles.inner}>
        {set.items.map((token) => (
          <div
            key={token.name}
            className={styles.token}
          >
            <Swatch
              name={token.name}
              value={token.value}
              {...(token.cssVar ? { cssVar: token.cssVar } : {})}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
