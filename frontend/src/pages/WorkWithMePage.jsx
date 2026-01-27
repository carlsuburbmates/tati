import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import {
  WORK_WITH_ME_HERO,
  WORK_WITH_ME_PACKAGES,
  WORK_WITH_ME_PROCESS,
  SITE_CONFIG,
} from '../data/mock';

const WorkWithMePage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="section-py macro-grid-subtle">
        <div className="container-site">
          <div className="max-w-3xl">
            <SectionMarker number="01/03" />
            <h1 className="display-lg text-[var(--text-primary)] mb-6">
              {WORK_WITH_ME_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-secondary)] max-w-2xl">
              {WORK_WITH_ME_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="section-py bg-[var(--bg-subtle)]">
        <div className="container-site">
          <div className="text-center mb-16">
            <h2 className="heading-1 text-[var(--text-primary)] mb-3">Coaching Options</h2>
            <p className="body-md text-[var(--text-secondary)]">
              Find the level of support that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {WORK_WITH_ME_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`paper-card relative ${
                  pkg.popular ? 'ring-2 ring-[var(--brand-primary)]' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge bg-[var(--brand-primary)] text-[var(--text-ink)]">
                      <Sparkles size={12} />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="label-mono text-[var(--text-ink)] opacity-50 mb-4">
                  0{pkg.id}
                </div>

                <h3 className="heading-2 text-[var(--text-ink)] mb-2">{pkg.name}</h3>
                <p className="label-mono text-[var(--brand-primary)] mb-4">{pkg.price}</p>
                <p className="body-sm text-[var(--text-ink)] opacity-70 mb-6">
                  {pkg.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check size={18} className="flex-shrink-0 text-[var(--brand-primary)] mt-0.5" />
                      <span className="body-sm text-[var(--text-ink)] opacity-80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <CTAButton
                  className={`w-full justify-center ${
                    pkg.popular
                      ? ''
                      : 'bg-[var(--text-ink)] hover:bg-[var(--text-ink)]/90 text-[var(--bg-card)]'
                  }`}
                >
                  Get Started
                </CTAButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-py">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionMarker number="02/03" />
            <h2 className="display-md text-[var(--text-primary)] mb-4">
              How It Works
            </h2>
            <p className="body-md text-[var(--text-secondary)]">
              A simple process designed to get you started quickly and set you up for success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORK_WITH_ME_PROCESS.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {index < WORK_WITH_ME_PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[var(--brand-primary)] to-transparent -z-10" />
                )}
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-light)] flex items-center justify-center mx-auto mb-6">
                    <span className="font-display text-xl font-bold text-[var(--brand-primary)]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="heading-3 text-[var(--text-primary)] mb-3">{item.title}</h3>
                  <p className="body-sm text-[var(--text-secondary)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py bg-[var(--bg-card)]">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <SectionMarker number="03/03" dark />
            <h2 className="display-md text-[var(--text-ink)] mb-6">
              Ready to Get Started?
            </h2>
            <p className="body-lg text-[var(--text-ink)] opacity-70 mb-10">
              Book a free consultation call. We'll discuss your goals, answer your questions, and find the best program for you. No pressure, no commitment.
            </p>
            <CTAButton className="bg-[var(--text-ink)] hover:bg-[var(--text-ink)]/90 text-[var(--bg-card)]">
              Book Free Consultation
            </CTAButton>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WorkWithMePage;
