import clsx from 'clsx';

import { Icon } from '@/components/Icon';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';
import { IconId } from '@/design-tokens/icons';

import styles from '@/components/Footer/Footer.module.css';

export type Link = {
  label: string;
  href: string;
  icon?: string;
};

type LinkSection = {
  title: string;
  links: Array<Link>;
};

export type FooterProps = {
  topLinks?: LinkSection[];
  bottomLinks?: Array<Link>;
  socialLinks?: Array<Link>;
  socialTitle?: string;
};

const MAX_TOP_SECTIONS = 4;

export function Footer({
  topLinks = [],
  bottomLinks = [],
  socialLinks = [],
  socialTitle = 'Connect with us',
}: Readonly<FooterProps>) {
  const visibleTopLinks = topLinks.slice(0, MAX_TOP_SECTIONS);

  return (
    <footer className={styles.root}>
      <Container>
        <Grid
          gap="lg"
          cols={13}
        >
          <GridItem spanXl={3}>
            <span className={styles.logo}>HOAM</span>
          </GridItem>
          {visibleTopLinks.map((section) => (
            <GridItem
              key={section.title}
              span={12}
              spanSm={6}
              spanLg={3}
              spanXl={2}
            >
              <h4 className={styles.sectionTitle}>{section.title}</h4>

              <ul className={styles.list}>
                {section.links.map((link) => (
                  <li key={link.href}>
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
              <h4 className={styles.sectionTitle}>{socialTitle}</h4>

              <Stack gap="lg">
                <div className={styles.socialLinks}>
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
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
          <GridItem span={10}>
            <div className={styles.links}>
              {bottomLinks.map((link) => (
                <div key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </div>
              ))}
            </div>
          </GridItem>
          <GridItem span={2}>
            <div className={clsx(styles.links, styles.backToTop)}>
              <a href="#content">Back to top</a>
            </div>
          </GridItem>
        </Grid>
      </Container>
    </footer>
  );
}
