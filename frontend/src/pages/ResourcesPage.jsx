import React from 'react';
import { ExternalLink, BookOpen, Dumbbell, ChefHat, Lightbulb } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import { RESOURCES_HERO, RESOURCES_PRODUCTS, SITE_CONFIG } from '../data/mock';

const iconMap = {
  'Digital Guide': BookOpen,
  'Training Program': Dumbbell,
  'Recipe Collection': ChefHat,
  'Digital Bundle': Lightbulb,
};

const ResourcesPage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 notebook-margin">
        <div className="container-site">
          <div className="max-w-3xl">
            <SectionMarker number="01" />
            <h1 className="display-lg text-[var(--text-ink)] mb-6">
              {RESOURCES_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-muted)] max-w-2xl">
              {RESOURCES_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-py bg-[var(--bg-card)] border-y border-[var(--border)]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESOURCES_PRODUCTS.map((product) => {
              const IconComponent = iconMap[product.type] || BookOpen;
              return (
                <a
                  key={product.id}
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-card group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[var(--bg-page)] border border-[var(--border)] flex items-center justify-center">
                      <IconComponent size={20} className="text-[var(--brand-pine)]" />
                    </div>
                    <span className="badge-pine">{product.type}</span>
                  </div>
                  
                  <h3 className="heading-1 text-[var(--text-ink)] mb-3 group-hover:text-[var(--accent-violet)] transition-colors">
                    {product.title}
                  </h3>
                  <p className="body-sm text-[var(--text-muted)] mb-6">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[var(--text-muted)] group-hover:text-[var(--accent-violet)] transition-colors">
                    <span className="body-sm font-medium">View on Newie</span>
                    <ExternalLink size={14} />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="body-md text-[var(--text-muted)] mb-6">
              Browse the complete collection
            </p>
            <a
              href={SITE_CONFIG.newie.hub}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex"
            >
              Visit Newie Store
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py">
        <div className="container-site">
          <div className="max-w-2xl mx-auto text-center">
            <SectionMarker number="02" />
            <h2 className="display-md text-[var(--text-ink)] mb-6">
              Want Personalized Guidance?
            </h2>
            <p className="body-lg text-[var(--text-muted)] mb-10">
              Self-guided programs work well, but nothing beats personalized coaching. Explore 1:1 options for fully customized support.
            </p>
            <CTAButton>Book a Consultation</CTAButton>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResourcesPage;
