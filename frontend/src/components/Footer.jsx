import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { FOOTER_LINKS, SITE_CONFIG, DISCLAIMER_TEXT } from '../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const TikTokIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <footer className="ink-band">
      <div className="container-site section-py">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link 
              to="/" 
              className="font-display text-xl font-semibold text-[var(--bg-card)] inline-block mb-4"
            >
              TonedwithTati
            </Link>
            <p className="body-sm text-[rgba(247,242,232,0.65)] mb-6 max-w-xs">
              Evidence-based coaching. Sustainable methods. Real results.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[rgba(247,242,232,0.1)] flex items-center justify-center text-[rgba(247,242,232,0.7)] hover:bg-[var(--brand-clay)] hover:text-[var(--bg-card)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={SITE_CONFIG.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[rgba(247,242,232,0.1)] flex items-center justify-center text-[rgba(247,242,232,0.7)] hover:bg-[var(--brand-clay)] hover:text-[var(--bg-card)] transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="label-mono text-[rgba(247,242,232,0.5)] mb-4">Navigate</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.main.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="label-mono text-[rgba(247,242,232,0.5)] mb-4">Legal</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Column */}
          <div>
            <h4 className="label-mono text-[rgba(247,242,232,0.5)] mb-4">Get Started</h4>
            <p className="body-sm text-[rgba(247,242,232,0.65)] mb-5">
              Ready to begin? Book a consultation.
            </p>
            <a
              href={SITE_CONFIG.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 pt-8 border-t border-[rgba(247,242,232,0.15)]">
          <p className="body-sm text-[rgba(247,242,232,0.5)] max-w-4xl">
            {DISCLAIMER_TEXT.sitewide}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[rgba(247,242,232,0.1)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="label-mono text-[rgba(247,242,232,0.4)]">
            © {currentYear} TonedwithTati. All rights reserved.
          </p>
          <p className="label-mono text-[rgba(247,242,232,0.4)]">
            Coaching is not medical care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
