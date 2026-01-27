import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import { NAV_LINKS, SITE_CONFIG } from '../data/mock';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const TikTokIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-page)]/98 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="container-site">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-display text-lg md:text-xl font-semibold text-[var(--text-ink)] hover:text-[var(--brand-clay)] transition-colors"
          >
            TonedwithTati
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? 'nav-link-active' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + Socials */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-1">
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-violet)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={SITE_CONFIG.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-violet)] transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
            <a 
              href={SITE_CONFIG.bookingUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary py-2.5 px-5 text-sm min-h-0"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--text-ink)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--bg-card)] border-b border-[var(--border)] shadow-lg animate-fade-in">
            <div className="container-site py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[var(--bg-page)] text-[var(--text-ink)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-page)]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 px-4 pt-4 mt-2 border-t border-[var(--border)]">
                <a
                  href={SITE_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-violet)]"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={SITE_CONFIG.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-violet)]"
                >
                  <TikTokIcon />
                </a>
              </div>
              <a
                href={SITE_CONFIG.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 mx-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
