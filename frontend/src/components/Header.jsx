import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, ArrowRight } from 'lucide-react';
import { NAV_LINKS, SITE_CONFIG } from '../data/mock';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const TikTokIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[var(--bg-base)]/95 backdrop-blur-md shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="font-display text-lg md:text-xl text-[var(--text-primary)] hover:text-[var(--brand-coral)] transition-colors"
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

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1">
                <a
                  href={SITE_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-coral)] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={SITE_CONFIG.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-coral)] transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
              </div>
              <a 
                href={SITE_CONFIG.bookingUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary py-3 px-6 text-sm"
              >
                Book Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[var(--text-primary)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-[var(--bg-base)] z-40 animate-fade-up">
            <div className="container py-6 flex flex-col gap-2 h-full">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-4 px-4 rounded-xl text-lg font-medium transition-all animate-fade-up ${
                    location.pathname === link.path
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)]'
                      : 'text-[var(--text-body)] hover:bg-[var(--bg-card)]'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-auto pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-4 mb-4">
                  <a
                    href={SITE_CONFIG.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--brand-coral)] transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href={SITE_CONFIG.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--brand-coral)] transition-colors"
                  >
                    <TikTokIcon />
                  </a>
                </div>
                <a
                  href={SITE_CONFIG.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Your Call
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky CTA */}
      <div className="sticky-cta">
        <a
          href={SITE_CONFIG.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full max-w-sm"
        >
          Book Your Call
          <ArrowRight size={18} />
        </a>
      </div>
    </>
  );
};

export default Header;
