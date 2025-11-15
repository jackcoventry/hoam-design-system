import socialLinks from '@/mocks/socialLinks.json';
import React from 'react';

import './Footer.css';

type LinkSection = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

type FooterProps = {
  topLinks?: Array<LinkSection>;
  bottomLinks?: Array<{ label: string; href: string }>;
};

function Footer({ topLinks = [], bottomLinks = [] }: Readonly<FooterProps>) {
  return (
    <footer className="hoam-footer">
      <div className="container">
        <div className="grid">
          <div className="span-12 xl:span-2">
            <img
              src="/logo.png"
              alt="HOAM logo"
              className="hoam-footer__logo"
            />
          </div>
          {topLinks.map((section, index) => {
            if (index >= 4) return null; // Limit to 3 sections for layout purposes
            return (
              <div
                key={section.title}
                className="span-12 xl:span-2"
              >
                <h4 className="hoam-footer__section-title">{section.title}</h4>
                <ul className="hoam-footer__list">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="span-12 xl:span-2">
            <h4 className="hoam-footer__section-title">Connect with us</h4>
            <div className="hoam-footer__social-links">
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
        <div className="hoam-footer__separator | grid">
          <div className="span-12">
            <div className="hoam-footer__links">
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

export default Footer;
