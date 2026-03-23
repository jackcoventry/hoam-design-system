import { ReactNode } from 'react';
import clsx from 'clsx';

import type { Link } from '@/components/Footer';
import { Icon } from '@/components/Icon';
import { Container, Grid, GridItem } from '@/components/Layout';
import { formatISODate, formatReadableDate, parseLooseDate } from '@/utils/convertDates';
import type { IconId } from '@/design-tokens/icons';

import styles from '@/components/BlogArticle/BlogArticle.module.css';
import utils from '@/components/Common/Util.module.css';

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

type Tag = {
  name: string;
  id: string;
};

export type BlogArticleProps = {
  category: string;
  title: string;
  summary: string;
  author: Author;
  publishDate: string;
  readingTime: number;
  image: BlogImage;
  tags: Tag[];
  children: ReactNode;
  socialLinks: Array<Link>;
};

export function BlogArticle({
  category,
  title,
  summary,
  author,
  publishDate,
  readingTime,
  image,
  tags,
  socialLinks = [],
  children,
}: Readonly<BlogArticleProps>) {
  const parsedDate = parseLooseDate(publishDate);
  const stringDate = parsedDate ? formatReadableDate(parsedDate) : '';
  const formattedDate = parsedDate ? formatISODate(parsedDate) : '';

  return (
    <div className={styles.wrapper}>
      <article className={styles.root}>
        <div className={styles.headerWrapper}>
          <Container>
            <Grid>
              <GridItem
                span={12}
                startLg={3}
                spanLg={8}
              >
                <header className={styles.header}>
                  {category && <p className={styles.headerCategory}>{category}</p>}
                  {title && <h1>{title}</h1>}
                  {summary && <h2>{summary}</h2>}

                  <div className={styles.meta}>
                    {author && (
                      <span className={styles.author}>
                        By{' '}
                        <a
                          href={`/profile/${author.id}`}
                          rel="author"
                          className={styles.authorLink}
                        >
                          {author.name}
                          <span className={styles.authorAvatar}>
                            <img
                              src={author.image}
                              alt={`The avatar of ${author.name}`}
                            />
                          </span>
                        </a>
                      </span>
                    )}
                    <time
                      className={styles.date}
                      dateTime={formattedDate}
                    >
                      {stringDate}
                    </time>
                    <span className={styles.readingTime}>
                      <Icon id="clock" />
                      {readingTime} minute read
                    </span>
                    <div className={styles.socialLinks}>
                      SHARE
                      {socialLinks?.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hoam-newsletter-banner__social-link"
                          aria-label={`Share on ${link.label}`}
                        >
                          <Icon id={link.icon as IconId} />
                        </a>
                      ))}
                    </div>
                  </div>
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
                startLg={3}
                spanLg={8}
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
              startLg={4}
              spanLg={6}
            >
              <section className={`${styles.body} | ${styles.bodyText}`}>{children}</section>
            </GridItem>
          </Grid>
        </Container>

        <footer className={styles.footer}>
          <Container>
            <Grid>
              <GridItem
                span={12}
                startLg={3}
                spanLg={8}
              >
                {tags?.length > 0 ? (
                  <p className={styles.tags}>
                    <span className={styles.tagsTitle}>Tags: </span>
                    {tags?.map((tag) => (
                      <a
                        key={tag.id}
                        href={`/blog/tag/${tag.id}`}
                        className={clsx(styles.tag, utils.focus)}
                      >
                        {tag.name}
                      </a>
                    ))}
                  </p>
                ) : null}
              </GridItem>
            </Grid>
          </Container>
        </footer>
      </article>
    </div>
  );
}
