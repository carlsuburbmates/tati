import React from 'react';
import { Quote, CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
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
      {/* Floating Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob blob-sage w-[350px] h-[350px] top-20 -right-20 opacity-25" />
        <div className="blob blob-rose w-[250px] h-[250px] bottom-1/3 -left-10 opacity-20" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative section pt-12 md:pt-20">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="badge badge-sage mb-6 animate-fade-up">
              <Sparkles size={12} />
              {RESULTS_HERO.label}
            </div>
            <h1 className="text-display mb-6 animate-fade-up animate-delay-1">
              {RESULTS_HERO.headline}
            </h1>
            <p className="text-body-lg text-[var(--text-body)] max-w-2xl animate-fade-up animate-delay-2">
              {RESULTS_HERO.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Proof Grid Section */}
      <section className="section bg-[var(--bg-elevated)]">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-h2 mb-2">Progress Gallery</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Real transformations from real women.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {RESULTS_PROOF_GRID.map((item) => (
              <div
                key={item.id}
                className="img-placeholder aspect-[3/4] hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <span className="opacity-40 text-xs">{item.placeholder}</span>
              </div>
            ))}
          </div>
          
          <p className="text-center text-label text-[var(--text-muted)] mt-6">
            Images shown with client permission
          </p>
        </div>
      </section>

      {/* Testimonial Strip */}
      <section className="section py-12 md:py-16">
        <div className="container">
          <div className="scroll-x md:grid-cols-3 md:gap-8">
            {RESULTS_TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative pl-6 border-l-2 border-[var(--accent-rose)] w-[280px] md:w-auto flex-shrink-0"
              >
                <Quote
                  size={18}
                  className="absolute -left-[11px] top-0 bg-[var(--bg-base)] text-[var(--brand-coral)]"
                />
                <p className="text-body text-[var(--text-primary)] italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="text-h3 text-[var(--text-muted)]">
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="section bg-[var(--bg-elevated)]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <SectionLabel>Case Studies</SectionLabel>
            <h2 className="text-h1 mb-3">Client Journeys</h2>
            <p className="text-body text-[var(--text-muted)]">
              Every transformation has a story. Here's how we approached different challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {RESULTS_CASE_STUDIES.map((study) => (
              <div key={study.id} className="card">
                <div className="badge badge-gold mb-4">{study.title}</div>

                {/* Starting Point */}
                <div className="mb-5">
                  <p className="text-label text-[var(--brand-coral)] mb-2">Starting Point</p>
                  <p className="text-body text-[var(--text-primary)]">{study.startingPoint}</p>
                </div>

                {/* Approach */}
                <div className="mb-5">
                  <p className="text-label text-[var(--text-muted)] mb-3">The Approach</p>
                  <ul className="space-y-2">
                    {study.approach.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle size={16} className="flex-shrink-0 text-[var(--accent-sage)] mt-0.5" />
                        <span className="text-sm text-[var(--text-body)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome */}
                <div className="pt-5 border-t border-[var(--border)]">
                  <p className="text-label text-[var(--accent-sage)] mb-2">The Outcome</p>
                  <p className="text-h3 text-[var(--text-primary)]">{study.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card glass-border text-center max-w-2xl mx-auto py-12">
            <h2 className="text-h1 mb-4">Write Your Own Story</h2>
            <p className="text-body-lg text-[var(--text-body)] mb-8 max-w-lg mx-auto">
              Ready to start your transformation? Book a free call to discuss your goals.
            </p>
            <CTAButton>Start Your Journey</CTAButton>
          </div>
        </div>
      </section>

      {/* Results Disclaimer */}
      <section className="py-6 border-t border-[var(--border)]">
        <div className="container">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <AlertCircle size={18} className="flex-shrink-0 text-[var(--accent-gold)] mt-0.5" />
            <p className="text-sm text-[var(--text-muted)]">
              <strong className="text-[var(--text-primary)]">Disclaimer:</strong> {DISCLAIMER_TEXT.results}
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResultsPage;
