import { Container, Grid, GridItem } from '../Layout';

import styles from '@/components/Footer/Footer.module.css';

export type SocialLink = {
  name: string;
  url: string;
  icon: string;
};

type LinkSection = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export type FooterProps = {
  topLinks?: LinkSection[];
  bottomLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<SocialLink>;
};

const MAX_TOP_SECTIONS = 4;

export function Footer({
  topLinks = [],
  bottomLinks = [],
  socialLinks = [],
}: Readonly<FooterProps>) {
  const visibleTopLinks = topLinks.slice(0, MAX_TOP_SECTIONS);

  return (
    <footer className={styles.root}>
      <Container>
        <Grid>
          <GridItem
            span={12}
            spanXl={2}
          >
            <img
              src="/logo.png"
              alt="HOAM logo"
              className={styles.logo}
            />
          </GridItem>

          {visibleTopLinks.map((section) => (
            <GridItem
              key={section.title}
              span={12}
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

          <GridItem
            span={12}
            spanXl={2}
          >
            <h4 className={styles.sectionTitle}>Connect with us</h4>

            <div className={styles.socialLinks}>
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="icon"
                    width="1.25em"
                    height="1.25em"
                    fill="currentColor"
                  >
                    <use xlinkHref={`/icons/icons.svg#${link.icon}`} />
                  </svg>
                </a>
              ))}
            </div>
          </GridItem>
        </Grid>

        <Grid className={styles.separator}>
          <GridItem span={12}>
            <div className={styles.links}>
              {bottomLinks.map((link) => (
                <div key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </div>
              ))}
            </div>
          </GridItem>
        </Grid>
      </Container>
    </footer>
  );
}
