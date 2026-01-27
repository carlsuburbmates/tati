import React from 'react';
import { ExternalLink, BookOpen, Dumbbell, ChefHat, Lightbulb, Sparkles } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import { RESOURCES_HERO, RESOURCES_PRODUCTS, SITE_CONFIG } from '../data/mock';

const iconMap = {
  'Guide': BookOpen,
  'Program': Dumbbell,
  'Recipes': ChefHat,
  'Bundle': Lightbulb,
};

const ResourcesPage = () => {
  return (
    <PageLayout>
      {/* Floating Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob blob-sage w-[300px] h-[300px] top-32 -right-20 opacity-20" />
        <div className="blob blob-gold w-[200px] h-[200px] bottom-1/3 -left-10 opacity-25" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative section pt-12 md:pt-20">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="badge badge-sage mb-6 animate-fade-up">
              <Sparkles size={12} />
              {RESOURCES_HERO.label}
            </div>
            <h1 className="text-display mb-6 animate-fade-up animate-delay-1">
              {RESOURCES_HERO.headline}
            </h1>
            <p className="text-body-lg text-[var(--text-body)] max-w-2xl animate-fade-up animate-delay-2">
              {RESOURCES_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-[var(--bg-elevated)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {RESOURCES_PRODUCTS.map((product) => {
              const IconComponent = iconMap[product.type] || BookOpen;
              return (
                <a
                  key={product.id}
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-sage)] to-[var(--accent-sage)]/70 flex items-center justify-center">
                      <IconComponent size={22} className="text-white" />
                    </div>
                    <span className="badge badge-sage">{product.type}</span>
                  </div>
                  
                  <h3 className="text-h2 mb-2 group-hover:text-[var(--brand-coral)] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mb-5">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[var(--text-muted)] group-hover:text-[var(--brand-coral)] transition-colors pt-4 border-t border-[var(--border)]">
                    <span className="text-sm font-medium">View on Newie</span>
                    <ExternalLink size={14} />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-body text-[var(--text-muted)] mb-5">
              Browse the complete collection
            </p>
            <a
              href={SITE_CONFIG.newie.hub}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Visit Newie Store
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card glass-border text-center max-w-2xl mx-auto py-12">
            <h2 className="text-h1 mb-4">Want Personalized Support?</h2>
            <p className="text-body-lg text-[var(--text-body)] mb-8 max-w-lg mx-auto">
              Self-guided programs are great, but 1:1 coaching takes results to another level.
            </p>
            <CTAButton>Book a Consultation</CTAButton>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResourcesPage;
