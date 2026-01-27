import React from 'react';
import { ArrowRight, Quote, CheckCircle } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import {
  RESULTS_HERO,
  RESULTS_PROOF_GRID,
  RESULTS_TESTIMONIALS,
  RESULTS_CASE_STUDIES,
  DISCLAIMER_TEXT,
  SITE_CONFIG,
} from '../data/mock';

const ResultsPage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="section-py macro-grid-subtle">
        <div className="container-site">
          <div className="max-w-3xl">
            <SectionMarker number="01/03" />
            <h1 className="display-lg text-[var(--text-primary)] mb-6">
              {RESULTS_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-secondary)] max-w-2xl">
              {RESULTS_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Proof Grid Section */}
      <section className="section-py bg-[var(--bg-subtle)]">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="heading-1 text-[var(--text-primary)] mb-3">Transformation Gallery</h2>
            <p className="body-md text-[var(--text-secondary)]">
              Real progress from real clients. Every journey is unique.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {RESULTS_PROOF_GRID.map((item) => (
              <div
                key={item.id}
                className="img-placeholder aspect-[3/4] hover-lift"
              >
                <span className="opacity-40">{item.placeholder}</span>
              </div>
            ))}
          </div>
          <p className="text-center label-mono text-[var(--text-secondary)] mt-8 opacity-60">
            Images shown with client permission
          </p>
        </div>
      </section>

      {/* Testimonial Strip */}
      <section className="py-16 bg-[var(--bg-card)] overflow-hidden">
        <div className="container-site">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {RESULTS_TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-1 relative pl-8 border-l-2 border-[var(--text-ink)]/10"
              >
                <Quote
                  size={24}
                  className="absolute -left-3 top-0 bg-[var(--bg-card)] text-[var(--text-ink)]/20"
                />
                <p className="body-md text-[var(--text-ink)] italic mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="heading-3 text-[var(--text-ink)]">
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
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionMarker number="02/03" />
            <h2 className="display-md text-[var(--text-primary)] mb-4">
              Client Stories
            </h2>
            <p className="body-md text-[var(--text-secondary)]">
              Behind every transformation is a unique story. Here's how we approach different challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {RESULTS_CASE_STUDIES.map((study, index) => (
              <div
                key={study.id}
                className="paper-card"
              >
                <div className="label-mono text-[var(--text-ink)] opacity-40 mb-4">
                  Case Study 0{index + 1}
                </div>

                {/* Starting Point */}
                <div className="mb-6">
                  <p className="label-mono text-[var(--brand-warn)] mb-2">Starting Point</p>
                  <p className="body-md text-[var(--text-ink)]">{study.startingPoint}</p>
                </div>

                {/* Approach */}
                <div className="mb-6">
                  <p className="label-mono text-[var(--text-ink)] opacity-60 mb-3">Approach</p>
                  <ul className="space-y-2">
                    {study.approach.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle size={18} className="flex-shrink-0 text-[var(--brand-primary)] mt-0.5" />
                        <span className="body-sm text-[var(--text-ink)] opacity-80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome */}
                <div className="pt-6 border-t border-[var(--text-ink)]/10">
                  <p className="label-mono text-[var(--brand-primary)] mb-2">Outcome</p>
                  <p className="heading-3 text-[var(--text-ink)]">{study.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py bg-[var(--bg-subtle)]">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <SectionMarker number="03/03" />
            <h2 className="display-md text-[var(--text-primary)] mb-6">
              Your Transformation Awaits
            </h2>
            <p className="body-lg text-[var(--text-secondary)] mb-10">
              Ready to write your own success story? Let's discuss your goals and create a plan that works for you.
            </p>
            <CTAButton>Start Your Journey</CTAButton>
          </div>
        </div>
      </section>

      {/* Results Disclaimer */}
      <section className="py-8 border-t border-[var(--border-light)]">
        <div className="container-site">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-warn)]/20 flex items-center justify-center mt-0.5">
              <span className="text-[var(--brand-warn)] text-xs font-bold">!</span>
            </span>
            <p className="body-sm text-[var(--text-secondary)] opacity-70">
              <strong className="text-[var(--text-primary)]">Disclaimer:</strong> {DISCLAIMER_TEXT.results}
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResultsPage;
