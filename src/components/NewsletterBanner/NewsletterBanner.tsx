import { Button } from '@/components/Button/Button';
import React from 'react';
import './NewsletterBanner.css';

type NewsletterBannerProps = {
  title: string;
  description?: string;
};

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/',
    icon: 'facebook-icon',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/',
    icon: 'instagram-icon',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/',
    icon: 'tiktok-icon',
  },
];

function NewsletterBanner({ title, description }: Readonly<NewsletterBannerProps>) {
  return (
    <section className="hoam-newsletter-banner">
      <div className="container">
        <div className="grid">
          <div className="hoam-newsletter-banner__content | span-12 lg:span-6 lg:start-4 body-text">
            {title && <h2 className="hoam-newsletter-banner__title">{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="grid">
          <div className="hoam-newsletter-banner__form | span-12 lg:span-6 lg:start-4">
            <form>
              <input
                type="email"
                placeholder="Enter your email"
                className="hoam-newsletter-banner__input"
                required
              />
              <Button
                type="submit"
                className="hoam-newsletter-banner__button"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="grid">
          <div className="hoam-newsletter-banner__form | span-12 lg:span-6 lg:start-4"></div>
        </div>
        <div className="hoam-newsletter-banner__social-links | span-12 lg:span-6 lg:start-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hoam-newsletter-banner__social-link"
            >
              <img
                src={`/icons/${link.icon}.svg`}
                alt={link.name}
                className="hoam-newsletter-banner__social-icon"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsletterBanner;
