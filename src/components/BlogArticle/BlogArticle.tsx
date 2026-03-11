import { ReactNode } from 'react';

import {
  formatISODate,
  formatReadableDate,
  parseLooseDate,
} from '@/utils/convertDates/convertDates';
import socialLinks from '@/mocks/socialLinks'; // TODO: Remove mocks from components

import styles from '@/components/BlogArticle/BlogArticle.module.css';

type BlogImage = {
  src: string;
  alt: string;
  caption: string;
};

type Author = {
  name: string;
  id: string;
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
};

type WrapperSizes = 'default' | 'small';

const Wrapper = ({
  children,
  size = 'default',
}: {
  children: Readonly<ReactNode>;
  size?: WrapperSizes;
}) => {
  let classList = 'span-12';
  if (size === 'default') {
    classList += ' lg:start-3 lg:span-8';
  }
  if (size === 'small') {
    classList += ' lg:start-4 lg:span-6';
  }

  return (
    <div className="container">
      <div className="grid">
        <div className={classList}>{children}</div>
      </div>
    </div>
  );
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
  children,
}: Readonly<BlogArticleProps>) {
  const parsedDate = parseLooseDate(publishDate);
  const stringDate = parsedDate ? formatReadableDate(parsedDate) : '';
  const formattedDate = parsedDate ? formatISODate(parsedDate) : '';

  return (
    <div className={styles.wrapper}>
      <article className={styles.root}>
        <div className={styles.headerWrapper}>
          <Wrapper>
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
                          src="https://placehold.co/20x20"
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
                  <svg
                    className="icon"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                  >
                    <use xlinkHref={`/icons/icons.svg#clock`} />
                  </svg>
                  {readingTime} minute read
                </span>
                <div className={styles.socialLinks}>
                  SHARE
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hoam-newsletter-banner__social-link"
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
            </header>
          </Wrapper>
        </div>

        {image && (
          <Wrapper>
            <figure className={styles.figure}>
              <img
                src={image.src}
                alt={image.alt}
              />
              <figcaption className={styles.figcaption}>{image.caption}</figcaption>
            </figure>
          </Wrapper>
        )}

        <Wrapper size="small">
          <section className={`${styles.body} | ${styles.bodyText}`}>{children}</section>
        </Wrapper>

        <footer className={styles.footer}>
          <Wrapper>
            {tags?.length > 0 ? (
              <p className={styles.tags}>
                <span className={styles.tagsTitle}>Tags: </span>
                {tags?.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/blog/tag/${tag.id}`}
                    className={styles.tag}
                  >
                    {tag.name}
                  </a>
                ))}
              </p>
            ) : null}
          </Wrapper>
        </footer>
      </article>
    </div>
  );
}
