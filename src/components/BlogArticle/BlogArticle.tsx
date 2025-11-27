import {
  formatISODate,
  formatReadableDate,
  parseLooseDate,
} from '@/utils/convertDates/convertDates';
import React, { ReactNode } from 'react';
import './BlogArticle.css';

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

type BlogArticleProps = {
  category: string;
  title: string;
  summary: string;
  author: Author;
  publishDate: string;
  readingTime: number;
  image: BlogImage;
  tags: Tag[];
  footnote: string;
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
    classList += ' md:start-3 md:span-8';
  }
  if (size === 'small') {
    classList += ' md:start-4 md:span-6';
  }

  return (
    <div className="container">
      <div className="grid">
        <div className={classList}>{children}</div>
      </div>
    </div>
  );
};

function BlogArticle({
  category,
  title,
  summary,
  author,
  publishDate,
  readingTime,
  image,
  tags,
  footnote,
  children,
}: Readonly<BlogArticleProps>) {
  const parsedDate = parseLooseDate(publishDate);
  const stringDate = formatReadableDate(parsedDate);
  const formattedDate = formatISODate(parsedDate);

  return (
    <div className="hoam-article__wrapper">
      <article className="hoam-article">
        <header className="hoam-article__header">
          <Wrapper>
            {category && <p className="hoam-article__header-category">{category}</p>}
            {title && <h1>{title}</h1>}
            {summary && <h2>{summary}</h2>}

            <p className="hoam-article__meta">
              {author && (
                <span className="hoam-article__author">
                  By
                  <a
                    href={`/profile/${author.id}`}
                    rel="author"
                  >
                    {author.name}
                  </a>
                </span>
              )}
              <time
                className="hoam-article__date"
                dateTime={formattedDate}
              >
                {stringDate}
              </time>
              <span className="hoam-article__reading-time">{readingTime} minute read</span>
            </p>
          </Wrapper>
        </header>

        {image && (
          <Wrapper>
            <figure className="hoam-article__figure">
              <img
                src={image.src}
                alt={image.alt}
              />
              <figcaption>{image.caption}</figcaption>
            </figure>
          </Wrapper>
        )}

        <Wrapper size="small">
          <section className="hoam-article__body | body-text">{children}</section>
        </Wrapper>

        <footer className="hoam-article__footer">
          <Wrapper>
            {tags?.length > 0 ? (
              <p className="hoam-article__tags">
                <strong>Tags:</strong>
                {tags?.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/blog/tag/${tag.id}`}
                    className="hoam-article__tag"
                  >
                    {tag.name}
                  </a>
                ))}
              </p>
            ) : null}

            {footnote && (
              <p className="hoam-article__footnote">
                <small>{footnote}</small>
              </p>
            )}
          </Wrapper>
        </footer>
      </article>
    </div>
  );
}

export default BlogArticle;
