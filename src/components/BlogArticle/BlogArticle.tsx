import { ReactNode } from 'react';
import clsx from 'clsx';

import { BodyText } from '@/components/Common/BodyText';
import type { FooterLink } from '@/components/Footer';
import { Icon } from '@/components/Icon';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';
import { useDate } from '@/hooks/useDate';
import { useMessages } from '@/hooks/useMessages';
import type { IconId } from '@/design-tokens/icons';

import styles from '@/components/BlogArticle/BlogArticle.module.css';

type BlogImage = {
  src: string;
  alt: string;
  caption: string;
};

type Author = {
  name: string;
  id: string;
  image: string;
};

export type BlogArticleProps = {
  /** Article category label shown above the title. */
  category: string;
  /** Main article headline. */
  title: string;
  /** Short summary shown below the title. */
  summary: string;
  /** Author metadata displayed in the article header. */
  author: Author;
  /** Optional author profile destination. */
  profileLink?: string | undefined;
  /** Publish date input passed to the library date formatter. */
  publishDate: string;
  /** Estimated reading time in minutes. */
  readingTime: number;
  /** Hero image shown with the article. */
  image: BlogImage;
  /** Main article content. */
  children: ReactNode;
  /** Social links rendered in the sharing section. */
  socialLinks: Array<FooterLink>;
  /** Optional class applied to the article wrapper. */
  className?: string;
};

export function BlogArticle({
  category,
  title,
  summary,
  author,
  profileLink,
  publishDate,
  readingTime,
  image,
  socialLinks = [],
  children,
  className,
}: Readonly<BlogArticleProps>) {
  const t = useMessages('blogArticle');
  const tGlobal = useMessages('global');
  const { formatDate } = useDate();

  const parsedDate = formatDate(publishDate, {
    dateStyle: 'long',
  });

  return (
    <div className={clsx(styles.wrapper, className)}>
      <article className={styles.root}>
        <div className={styles.headerWrapper}>
          <Container>
            <Grid>
              <GridItem span={12}>
                <header className={styles.header}>
                  <Stack gap="md">
                    {category && <p className={styles.headerCategory}>{category}</p>}
                    {title && <h1 className={styles.title}>{title}</h1>}
                    {summary && <h2 className={styles.summary}>{summary}</h2>}

                    <div className={styles.meta}>
                      {author && (
                        <span className={styles.author}>
                          {t.by}
                          {profileLink ? (
                            <a
                              href={profileLink}
                              rel="author"
                              className={styles.authorLink}
                            >
                              {author.name}
                              <span className={styles.authorAvatar}>
                                <img
                                  src={author.image}
                                  alt={t.avatarAria(author.name)}
                                />
                              </span>
                            </a>
                          ) : (
                            <span className={styles.authorLink}>
                              {author.name}
                              <span className={styles.authorAvatar}>
                                <img
                                  src={author.image}
                                  alt={t.avatarAria(author.name)}
                                />
                              </span>
                            </span>
                          )}
                        </span>
                      )}
                      <time
                        className={styles.date}
                        dateTime={parsedDate}
                      >
                        {parsedDate}
                      </time>
                      <span className={styles.readingTime}>
                        <Icon id="clock" />
                        {t.readingTime(readingTime)}
                      </span>
                      <div className={styles.socialLinks}>
                        {tGlobal.share}
                        {socialLinks?.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={tGlobal.shareAria(link.label)}
                          >
                            <Icon id={link.icon as IconId} />
                          </a>
                        ))}
                      </div>
                    </div>
                  </Stack>
                </header>
              </GridItem>
            </Grid>
          </Container>
        </div>

        {image && (
          <Container>
            <Grid>
              <GridItem
                span={12}
                spanLg={12}
              >
                <figure className={styles.figure}>
                  <img
                    src={image.src}
                    alt={image.alt}
                  />
                  <figcaption className={styles.figcaption}>{image.caption}</figcaption>
                </figure>
              </GridItem>
            </Grid>
          </Container>
        )}

        <Container>
          <Grid>
            <GridItem
              span={12}
              startLg={3}
              spanLg={8}
            >
              <section className={styles.body}>
                <BodyText>{children}</BodyText>
              </section>
            </GridItem>
          </Grid>
        </Container>
      </article>
    </div>
  );
}
