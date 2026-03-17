import socialLinks from '@/mocks/socialLinks';

import styles from '@/components/Footer/Footer.module.css';

type LinkSection = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export type FooterProps = {
  topLinks?: LinkSection[];
  bottomLinks?: Array<{ label: string; href: string }>;
};

const MAX_TOP_SECTIONS = 4;

export function Footer({ topLinks = [], bottomLinks = [] }: Readonly<FooterProps>) {
  const visibleTopLinks = topLinks.slice(0, MAX_TOP_SECTIONS);

  return (
    <footer className={styles.root}>
      <div className="container">
        <div className="grid">
          <div className="span-12 xl:span-2">
            <img
              src="/logo.png"
              alt="HOAM logo"
              className={styles.logo}
            />
          </div>

          {visibleTopLinks.map((section) => (
            <div
              key={section.title}
              className="span-12 xl:span-2"
            >
              <h4 className={styles.sectionTitle}>{section.title}</h4>

              <ul className={styles.list}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="span-12 xl:span-2">
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
          </div>
        </div>

        <div className={`${styles.separator} | grid`}>
          <div className="span-12">
            <div className={styles.links}>
              {bottomLinks.map((link) => (
                <div key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
