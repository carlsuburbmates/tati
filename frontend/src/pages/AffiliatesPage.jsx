import React from 'react';
import { ExternalLink, Tag, Info, Sparkles } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import PageLayout from '../components/PageLayout';
import { AFFILIATES_HERO, AFFILIATES_LIST } from '../data/mock';

const AffiliatesPage = () => {
  return (
    <PageLayout>
      {/* Floating Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob blob-rose w-[280px] h-[280px] top-24 -right-10 opacity-25" />
        <div className="blob blob-gold w-[200px] h-[200px] bottom-1/3 -left-10 opacity-20" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative section pt-12 md:pt-20">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="badge badge-gold mb-6 animate-fade-up">
              <Sparkles size={12} />
              {AFFILIATES_HERO.label}
            </div>
            <h1 className="text-display mb-6 animate-fade-up animate-delay-1">
              {AFFILIATES_HERO.headline}
            </h1>
            <p className="text-body-lg text-[var(--text-body)] max-w-2xl animate-fade-up animate-delay-2">
              {AFFILIATES_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Affiliates List */}
      <section className="section bg-[var(--bg-elevated)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {AFFILIATES_LIST.map((affiliate) => (
              <div key={affiliate.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-h2">{affiliate.brand}</h3>
                  <span className="badge">{affiliate.discount}</span>
                </div>
                
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  {affiliate.description}
                </p>
                
                <div className="flex items-center justify-between pt-5 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-[var(--brand-coral)]" />
                    <span className="font-mono text-base font-medium text-[var(--text-primary)]">
                      {affiliate.code}
                    </span>
                  </div>
                  <a
                    href={affiliate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    Shop Now
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclosure Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <SectionLabel>Disclosure</SectionLabel>
            <h2 className="text-h1 mb-6">Affiliate Transparency</h2>
            
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-sage)] to-[var(--accent-sage)]/70 flex items-center justify-center">
                  <Info size={18} className="text-white" />
                </div>
                <div className="space-y-4">
                  <p className="text-body text-[var(--text-body)]">
                    This page contains affiliate links. I earn a small commission from qualifying purchases at no extra cost to you.
                  </p>
                  <p className="text-body text-[var(--text-body)]">
                    I only recommend products I personally use and believe in. My recommendations are based on my experience—not commission rates.
                  </p>
                  <p className="text-body text-[var(--text-body)]">
                    Your support through these links helps me create free content. Thank you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AffiliatesPage;
