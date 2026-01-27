import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import {
  WORK_WITH_ME_HERO,
  WORK_WITH_ME_PACKAGES,
  WORK_WITH_ME_PROCESS,
} from '../data/mock';

const WorkWithMePage = () => {
  return (
    <PageLayout>
      {/* Floating Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob blob-gold w-[300px] h-[300px] top-20 -left-20 opacity-25" />
        <div className="blob blob-rose w-[250px] h-[250px] bottom-1/4 right-0 opacity-20" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative section pt-12 md:pt-20">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="badge mb-6 animate-fade-up">
              <Sparkles size={12} />
              {WORK_WITH_ME_HERO.label}
            </div>
            <h1 className="text-display mb-6 animate-fade-up animate-delay-1">
              {WORK_WITH_ME_HERO.headline}
            </h1>
            <p className="text-body-lg text-[var(--text-body)] max-w-2xl animate-fade-up animate-delay-2">
              {WORK_WITH_ME_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="section bg-[var(--bg-elevated)]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-h1 mb-2">Coaching Options</h2>
            <p className="text-body text-[var(--text-muted)]">
              Choose the level of support that fits your needs
            </p>
          </div>

          <div className="scroll-x md:grid-cols-3 md:gap-6">
            {WORK_WITH_ME_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`card w-[300px] md:w-auto ${pkg.popular ? 'card-featured' : ''}`}
              >
                {pkg.popular && (
                  <div className="badge mb-4">
                    <Sparkles size={10} />
                    Recommended
                  </div>
                )}

                <h3 className="text-h2 mb-1">{pkg.name}</h3>
                <p className="text-label text-[var(--accent-sage)] mb-4">{pkg.price}</p>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  {pkg.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="check-item">
                      <div className="check-icon">
                        <Check size={12} />
                      </div>
                      <span className="text-sm text-[var(--text-body)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <CTAButton className="w-full justify-center">
                  Get Started
                </CTAButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <SectionLabel>The Process</SectionLabel>
            <h2 className="text-h1 mb-3">How It Works</h2>
            <p className="text-body text-[var(--text-muted)]">
              A simple path from where you are to where you want to be.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="journey-line">
              {WORK_WITH_ME_PROCESS.map((item) => (
                <div key={item.step} className="journey-step">
                  <div className="mb-1">
                    <span className="text-label text-[var(--brand-coral)]">{item.step}</span>
                  </div>
                  <h3 className="text-h3 mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-[var(--bg-elevated)]">
        <div className="container">
          <div className="card glass-border text-center max-w-2xl mx-auto py-12">
            <h2 className="text-h1 mb-4">Ready to Start?</h2>
            <p className="text-body-lg text-[var(--text-body)] mb-8 max-w-lg mx-auto">
              Book a free consultation. We'll chat about your goals and find the right fit. No pressure.
            </p>
            <CTAButton>Book Your Call</CTAButton>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WorkWithMePage;
