import clsx from 'clsx';

import { Icon } from '@/components/Icon';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';
import { SITE } from '@/constants/site';
import { IconId } from '@/design-tokens/icons';

import styles from '@/components/Footer/Footer.module.css';

export type FooterLink = {
  /** Visible link label. */
  label: string;
  /** Link destination. */
  href: string;
  /** Optional icon id used for social links. */
  icon?: string;
};

type LinkSection = {
  title: string;
  links: Array<FooterLink>;
};

export type FooterProps = {
  /** Top navigation link sections, limited to four visible groups. */
  topLinks?: LinkSection[];
  /** Secondary links shown in the footer bottom row. */
  bottomLinks?: Array<FooterLink>;
  /** Social links rendered with icons. */
  socialLinks?: Array<FooterLink>;
  /** Optional class applied to the footer root. */
  className?: string;
};

const MAX_TOP_SECTIONS = 4;

export function Footer({
  topLinks = [],
  bottomLinks = [],
  socialLinks = [],
  className,
}: Readonly<FooterProps>) {
  const visibleTopLinks = topLinks.slice(0, MAX_TOP_SECTIONS);
  const t = useMessages('footer');

  return (
    <footer className={clsx(styles.root, className)}>
      <Container>
        <Grid
          gap="lg"
          cols={13}
        >
          <GridItem spanXl={3}>
            <span className={styles.logo}>{SITE.title}</span>
          </GridItem>
          {visibleTopLinks.map((section, sectionIndex) => (
            <GridItem
              key={`${section.title}-${sectionIndex}`}
              span={12}
              spanSm={6}
              spanLg={3}
              spanXl={2}
            >
              <h2 className={styles.sectionTitle}>{section.title}</h2>

              <ul className={styles.list}>
                {section.links.map((link, linkIndex) => (
                  <li key={`${link.href}-${linkIndex}`}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </GridItem>
          ))}

          {socialLinks.length > 0 ? (
            <GridItem
              span={12}
              spanXl={2}
            >
              <h2 className={styles.sectionTitle}>{t.socialTitle}</h2>

              <Stack gap="lg">
                <div className={styles.socialLinks}>
                  {socialLinks.map((link, linkIndex) => (
                    <a
                      key={`${link.href}-${linkIndex}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <Icon id={link.icon as IconId} />
                    </a>
                  ))}
                </div>
              </Stack>
            </GridItem>
          ) : null}
        </Grid>

        <Grid className={styles.separator}>
          <GridItem
            span={12}
            spanMd={10}
          >
            <div className={styles.links}>
              {bottomLinks.map((link, linkIndex) => (
                <a
                  key={`${link.href}-${linkIndex}`}
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </GridItem>
          <GridItem
            span={12}
            spanMd={2}
          >
            <div className={clsx(styles.links, styles.backToTop)}>
              <a href="#content">{t.backToTop}</a>
            </div>
          </GridItem>
        </Grid>
      </Container>
    </footer>
  );
}
