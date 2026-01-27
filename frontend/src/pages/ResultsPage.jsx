import React from 'react';
import { Quote, CheckCircle, AlertCircle } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import {
  RESULTS_HERO,
  RESULTS_PROOF_GRID,
  RESULTS_TESTIMONIALS,
  RESULTS_CASE_STUDIES,
  DISCLAIMER_TEXT,
} from '../data/mock';

const ResultsPage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 notebook-margin">
        <div className="container-site">
          <div className="max-w-3xl">
            <SectionMarker number="01" />
            <h1 className="display-lg text-[var(--text-ink)] mb-6">
              {RESULTS_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-muted)] max-w-2xl">
              {RESULTS_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Proof Grid Section */}
      <section className="section-py bg-[var(--bg-card)] border-y border-[var(--border)]">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="heading-1 text-[var(--text-ink)] mb-3">Progress Gallery</h2>
            <p className="body-md text-[var(--text-muted)]">
              Real progress from real clients. Every journey is unique.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {RESULTS_PROOF_GRID.map((item) => (
              <div
                key={item.id}
                className="img-placeholder aspect-[3/4] hover-lift"
              >
                <span className="opacity-50">{item.placeholder}</span>
              </div>
            ))}
          </div>
          <p className="text-center label-mono text-[var(--text-muted)] mt-8 opacity-70">
            Images shown with client permission
          </p>
        </div>
      </section>

      {/* Testimonial Strip */}
      <section className="py-14 md:py-20 border-b border-[var(--border)]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {RESULTS_TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative pl-6 border-l-2 border-[var(--border)]"
              >
                <Quote
                  size={20}
                  className="absolute -left-[11px] top-0 bg-[var(--bg-page)] text-[var(--brand-clay)]"
                />
                <p className="body-md text-[var(--text-ink)] italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="heading-3 text-[var(--text-muted)]">
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="section-py">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionMarker number="02" />
            <h2 className="display-md text-[var(--text-ink)] mb-4">
              Client Stories
            </h2>
            <p className="body-md text-[var(--text-muted)]">
              Behind every result is a unique story. Here's how we approach different challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {RESULTS_CASE_STUDIES.map((study, index) => (
              <div
                key={study.id}
                className="paper-card paper-card-grid"
              >
                <div className="label-mono text-[var(--text-muted)] mb-5">
                  Case Study 0{index + 1}
                </div>

                {/* Starting Point */}
                <div className="mb-6">
                  <p className="label-mono text-[var(--brand-clay)] mb-2">Starting Point</p>
                  <p className="body-md text-[var(--text-ink)]">{study.startingPoint}</p>
                </div>

                {/* Approach */}
                <div className="mb-6">
                  <p className="label-mono text-[var(--text-muted)] mb-3">Approach</p>
                  <ul className="space-y-2">
                    {study.approach.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle size={16} className="flex-shrink-0 text-[var(--brand-pine)] mt-0.5" />
                        <span className="body-sm text-[var(--text-muted)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome */}
                <div className="pt-5 border-t border-[var(--border)]">
                  <p className="label-mono text-[var(--brand-pine)] mb-2">Outcome</p>
                  <p className="heading-2 text-[var(--text-ink)]">{study.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py bg-[var(--bg-card)] border-t border-[var(--border)]">
        <div className="container-site">
          <div className="max-w-2xl mx-auto text-center">
            <SectionMarker number="03" light />
            <h2 className="display-md text-[var(--text-ink)] mb-6">
              Your Story Starts Here
            </h2>
            <p className="body-lg text-[var(--text-muted)] mb-10">
              Ready to create your own results? Book a consultation to discuss your goals and build a plan together.
            </p>
            <CTAButton>Start Your Journey</CTAButton>
          </div>
        </div>
      </section>

      {/* Results Disclaimer */}
      <section className="py-6 md:py-8 border-t border-[var(--border)] bg-[var(--bg-page)]">
        <div className="container-site">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <AlertCircle size={18} className="flex-shrink-0 text-[var(--brand-clay)] mt-0.5" />
            <p className="body-sm text-[var(--text-muted)]">
              <strong className="text-[var(--text-ink)]">Disclaimer:</strong> {DISCLAIMER_TEXT.results}
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResultsPage;
