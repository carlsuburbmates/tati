import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowUpRight, Heart } from 'lucide-react';
import { FOOTER_LINKS, SITE_CONFIG, DISCLAIMER_TEXT } from '../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const TikTokIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <footer className="footer">
      <div className="container section">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link 
              to="/" 
              className="font-display text-xl text-white inline-block mb-4"
            >
              TonedwithTati
            </Link>
            <p className="text-sm text-white/60 mb-6 max-w-xs">
              Evidence-based coaching for lasting results. Your goals, your timeline.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[var(--brand-coral)] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={SITE_CONFIG.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[var(--brand-coral)] hover:text-white transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-label text-white/50 mb-4">Navigate</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.main.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link group inline-flex items-center gap-1">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-label text-white/50 mb-4">Legal</h4>
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
            <h4 className="text-label text-white/50 mb-4">Ready?</h4>
            <p className="text-sm text-white/60 mb-5">
              Start your transformation today.
            </p>
            <a
              href={SITE_CONFIG.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-3 px-5"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40 max-w-3xl">
            {DISCLAIMER_TEXT.sitewide}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-label text-white/40">
            © {currentYear} TonedwithTati
          </p>
          <p className="text-label text-white/40 flex items-center gap-1">
            Made with <Heart size={12} className="text-[var(--brand-coral)]" /> for results
          </p>
        </div>
      </div>

      {/* Extra padding for mobile sticky CTA */}
      <div className="h-20 md:hidden" />
    </footer>
  );
};

export default Footer;
