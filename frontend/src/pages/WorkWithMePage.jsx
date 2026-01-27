import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
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
      {/* Hero Section */}
      <section className="py-16 md:py-24 notebook-margin">
        <div className="container-site">
          <div className="max-w-3xl">
            <SectionMarker number="01" />
            <h1 className="display-lg text-[var(--text-ink)] mb-6">
              {WORK_WITH_ME_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-muted)] max-w-2xl">
              {WORK_WITH_ME_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="section-py bg-[var(--bg-card)] border-y border-[var(--border)]">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="heading-1 text-[var(--text-ink)] mb-3">Coaching Options</h2>
            <p className="body-md text-[var(--text-muted)]">
              Find the level of support that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {WORK_WITH_ME_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-[var(--bg-page)] border rounded-[var(--radius-card)] p-6 lg:p-8 ${
                  pkg.popular 
                    ? 'border-[var(--brand-clay)] border-2' 
                    : 'border-[var(--border)]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="badge flex items-center gap-1">
                      <Sparkles size={10} />
                      Recommended
                    </span>
                  </div>
                )}

                <div className="label-mono text-[var(--text-muted)] mb-4">
                  0{pkg.id}
                </div>

                <h3 className="heading-1 text-[var(--text-ink)] mb-2">{pkg.name}</h3>
                <p className="label-mono text-[var(--brand-pine)] mb-4">{pkg.price}</p>
                <p className="body-sm text-[var(--text-muted)] mb-6">
                  {pkg.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check size={16} className="flex-shrink-0 text-[var(--brand-pine)] mt-0.5" />
                      <span className="body-sm text-[var(--text-ink)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <CTAButton
                  className={`w-full justify-center ${
                    pkg.popular
                      ? ''
                      : 'bg-[var(--brand-pine)] hover:bg-[var(--brand-pine-hover)]'
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
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionMarker number="02" />
            <h2 className="display-md text-[var(--text-ink)] mb-4">
              How It Works
            </h2>
            <p className="body-md text-[var(--text-muted)]">
              A structured process designed to get you started quickly.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              {WORK_WITH_ME_PROCESS.map((item) => (
                <div key={item.step} className="process-step">
                  <div className="process-number">{item.step}</div>
                  <div className="pl-2">
                    <h3 className="heading-2 text-[var(--text-ink)] mb-2">{item.title}</h3>
                    <p className="body-md text-[var(--text-muted)]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py bg-[var(--bg-card)] border-t border-[var(--border)]">
        <div className="container-site">
          <div className="max-w-2xl mx-auto text-center">
            <SectionMarker number="03" light />
            <h2 className="display-md text-[var(--text-ink)] mb-6">
              Ready to Get Started?
            </h2>
            <p className="body-lg text-[var(--text-muted)] mb-10">
              Book a consultation to discuss your goals and find the right program. No pressure, no commitment.
            </p>
            <CTAButton>Book Your Consultation</CTAButton>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WorkWithMePage;
