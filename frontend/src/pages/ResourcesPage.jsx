import React from 'react';
import { ExternalLink, BookOpen, Dumbbell, ChefHat, Brain } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import { RESOURCES_HERO, RESOURCES_PRODUCTS, SITE_CONFIG } from '../data/mock';

const iconMap = {
  'Digital Guide': BookOpen,
  'Workout Program': Dumbbell,
  'Recipe Collection': ChefHat,
  'Digital Bundle': Brain,
};

const ResourcesPage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="section-py macro-grid-subtle">
        <div className="container-site">
          <div className="max-w-3xl">
            <SectionMarker number="01/02" />
            <h1 className="display-lg text-[var(--text-primary)] mb-6">
              {RESOURCES_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-secondary)] max-w-2xl">
              {RESOURCES_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-py bg-[var(--bg-subtle)]">
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
                  className="paper-card group flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center">
                      <IconComponent size={24} className="text-[var(--text-ink)]" />
                    </div>
                    <span className="badge-ink">{product.type}</span>
                  </div>
                  
                  <h3 className="heading-2 text-[var(--text-ink)] mb-3 group-hover:text-[var(--brand-primary)] transition-colors">
                    {product.title}
                  </h3>
                  <p className="body-sm text-[var(--text-ink)] opacity-70 mb-6 flex-grow">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[var(--text-ink)] group-hover:text-[var(--brand-primary)] transition-colors">
                    <span className="body-sm font-medium">View on Newie</span>
                    <ExternalLink size={16} />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="body-md text-[var(--text-secondary)] mb-6">
              Browse my complete collection of programs and guides
            </p>
            <a
              href={SITE_CONFIG.newie.hub}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex"
            >
              Visit My Newie Store
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <SectionMarker number="02/02" />
            <h2 className="display-md text-[var(--text-primary)] mb-6">
              Want Personalized Guidance?
            </h2>
            <p className="body-lg text-[var(--text-secondary)] mb-10">
              Self-guided programs are great, but nothing beats having a coach in your corner. Explore my 1:1 coaching options for fully customized support.
            </p>
            <CTAButton>Book a Consultation</CTAButton>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResourcesPage;
