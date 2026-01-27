import React from 'react';
import { ExternalLink, Tag, Info } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
import PageLayout from '../components/PageLayout';
import { AFFILIATES_HERO, AFFILIATES_LIST } from '../data/mock';

const AffiliatesPage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="section-py macro-grid-subtle">
        <div className="container-site">
          <div className="max-w-3xl">
            <SectionMarker number="01/02" />
            <h1 className="display-lg text-[var(--text-primary)] mb-6">
              {AFFILIATES_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-secondary)] max-w-2xl">
              {AFFILIATES_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Affiliates List */}
      <section className="section-py bg-[var(--bg-subtle)]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {AFFILIATES_LIST.map((affiliate) => (
              <div key={affiliate.id} className="paper-card">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="heading-2 text-[var(--text-ink)]">{affiliate.brand}</h3>
                  <span className="badge">{affiliate.discount}</span>
                </div>
                
                <p className="body-sm text-[var(--text-ink)] opacity-70 mb-6">
                  {affiliate.description}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-[var(--text-ink)]/10">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-[var(--brand-primary)]" />
                    <span className="font-mono text-lg font-semibold text-[var(--text-ink)]">
                      {affiliate.code}
                    </span>
                  </div>
                  <a
                    href={affiliate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-[var(--text-ink)] hover:text-[var(--brand-primary)]"
                  >
                    Shop Now
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclosure Section */}
      <section className="section-py">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <SectionMarker number="02/02" />
            <h2 className="heading-1 text-[var(--text-primary)] mb-6">
              Affiliate Disclosure
            </h2>
            <div className="bg-[var(--bg-subtle)] rounded-2xl p-8 border border-[var(--border-light)]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--brand-primary)]/20 flex items-center justify-center">
                  <Info size={20} className="text-[var(--brand-primary)]" />
                </div>
                <div>
                  <p className="body-md text-[var(--text-secondary)] mb-4">
                    This page contains affiliate links. As an affiliate, I earn a small commission from qualifying purchases at no additional cost to you.
                  </p>
                  <p className="body-md text-[var(--text-secondary)] mb-4">
                    I only recommend products I personally use and believe in. My recommendations are based on my own experience and are not influenced by commission rates.
                  </p>
                  <p className="body-md text-[var(--text-secondary)]">
                    Your support through these links helps me continue creating free content and resources. Thank you!
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
