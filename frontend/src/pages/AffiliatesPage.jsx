import React from 'react';
import { ExternalLink, Tag, Info } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
import PageLayout from '../components/PageLayout';
import { AFFILIATES_HERO, AFFILIATES_LIST } from '../data/mock';

const AffiliatesPage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 notebook-margin">
        <div className="container-site">
          <div className="max-w-3xl">
            <SectionMarker number="01" />
            <h1 className="display-lg text-[var(--text-ink)] mb-6">
              {AFFILIATES_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-muted)] max-w-2xl">
              {AFFILIATES_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Affiliates List */}
      <section className="section-py bg-[var(--bg-card)] border-y border-[var(--border)]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {AFFILIATES_LIST.map((affiliate) => (
              <div key={affiliate.id} className="paper-card">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="heading-1 text-[var(--text-ink)]">{affiliate.brand}</h3>
                  <span className="badge">{affiliate.discount}</span>
                </div>
                
                <p className="body-sm text-[var(--text-muted)] mb-6">
                  {affiliate.description}
                </p>
                
                <div className="flex items-center justify-between pt-5 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-[var(--brand-clay)]" />
                    <span className="font-mono text-base font-medium text-[var(--text-ink)]">
                      {affiliate.code}
                    </span>
                  </div>
                  <a
                    href={affiliate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost hover:text-[var(--accent-violet)]"
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
      <section className="section-py">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <SectionMarker number="02" />
            <h2 className="heading-1 text-[var(--text-ink)] mb-6">
              Affiliate Disclosure
            </h2>
            <div className="paper-card">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--bg-page)] border border-[var(--border)] flex items-center justify-center">
                  <Info size={18} className="text-[var(--brand-pine)]" />
                </div>
                <div className="space-y-4">
                  <p className="body-md text-[var(--text-muted)]">
                    This page contains affiliate links. As an affiliate, I earn a small commission from qualifying purchases at no additional cost to you.
                  </p>
                  <p className="body-md text-[var(--text-muted)]">
                    I only recommend products I personally use and believe in. My recommendations are based on my own experience and are not influenced by commission rates.
                  </p>
                  <p className="body-md text-[var(--text-muted)]">
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
