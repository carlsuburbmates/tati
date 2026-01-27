import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Award } from 'lucide-react';
import SectionMarker from '../components/SectionMarker';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import {
  HOME_HERO,
  HOME_INTRO,
  HOME_STATS,
  HOME_SERVICES,
  HOME_TESTIMONIALS,
  HOME_CTA,
  SITE_CONFIG,
} from '../data/mock';

const HomePage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 notebook-margin">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="label-mono text-[var(--text-muted)] mb-4 animate-fade-in-up">
              Online Coaching
            </p>
            <h1 className="display-xl text-[var(--text-ink)] mb-6 animate-fade-in-up animate-delay-100">
              {HOME_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-muted)] mb-10 animate-fade-in-up animate-delay-200">
              {HOME_HERO.subheadline}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <CTAButton>{HOME_HERO.cta}</CTAButton>
              <Link to="/results" className="btn-secondary">
                View Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-card)]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
            {HOME_STATS.map((stat, index) => (
              <div key={index} className="stat-card py-10 md:py-12">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-py">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <SectionMarker number={HOME_INTRO.marker} />
              <h2 className="display-md text-[var(--text-ink)] mb-6">
                {HOME_INTRO.title}
              </h2>
              <p className="body-lg text-[var(--text-muted)] mb-8 leading-relaxed">
                {HOME_INTRO.description}
              </p>
              <ul className="space-y-4">
                {HOME_INTRO.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded bg-[var(--brand-pine)] flex items-center justify-center mt-1">
                      <Check size={12} className="text-[var(--bg-card)]" />
                    </span>
                    <span className="body-md text-[var(--text-ink)]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative lg:mt-12">
              <div className="paper-card paper-card-grid p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] flex items-center justify-center">
                    <Award size={24} className="text-[var(--brand-pine)]" />
                  </div>
                  <div>
                    <p className="heading-2 text-[var(--text-ink)]">Tati, RN</p>
                    <p className="body-sm text-[var(--text-muted)]">Registered Nurse & Coach</p>
                  </div>
                </div>
                <p className="body-md text-[var(--text-muted)] leading-relaxed italic">
                  "My focus is on helping you find structure—not perfection. I believe in sustainable, evidence-based approaches that fit into real life."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-py bg-[var(--bg-card)] border-y border-[var(--border)]">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionMarker number={HOME_SERVICES.marker} light />
            <h2 className="display-md text-[var(--text-ink)]">
              {HOME_SERVICES.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOME_SERVICES.items.map((service) => (
              <div 
                key={service.id} 
                className="bg-[var(--bg-page)] border border-[var(--border)] rounded-[var(--radius-card)] p-6 lg:p-8 hover-lift cursor-pointer group"
              >
                <div className="label-mono text-[var(--text-muted)] mb-4">
                  0{service.id}
                </div>
                <h3 className="heading-1 text-[var(--text-ink)] mb-3">
                  {service.title}
                </h3>
                <p className="body-sm text-[var(--text-muted)] mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 body-sm text-[var(--text-ink)]">
                      <span className="w-1 h-1 rounded-full bg-[var(--brand-clay)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="pt-5 border-t border-[var(--border)]">
                  <span className="btn-ghost group-hover:text-[var(--accent-violet)]">
                    Learn More <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/work-with-me" className="btn-secondary">
              Explore All Programs
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-py">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionMarker number={HOME_TESTIMONIALS.marker} />
            <h2 className="display-md text-[var(--text-ink)]">
              {HOME_TESTIMONIALS.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOME_TESTIMONIALS.items.map((testimonial) => (
              <div
                key={testimonial.id}
                className="paper-card"
              >
                <div className="quote-mark mb-2">"</div>
                <p className="body-md text-[var(--text-ink)] mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="pt-5 border-t border-[var(--border)]">
                  <p className="heading-3 text-[var(--text-ink)]">{testimonial.name}</p>
                  <p className="label-mono text-[var(--brand-clay)] mt-1">{testimonial.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-py bg-[var(--bg-card)] border-t border-[var(--border)]">
        <div className="container-site">
          <div className="max-w-2xl mx-auto text-center">
            <SectionMarker number={HOME_CTA.marker} light />
            <h2 className="display-md text-[var(--text-ink)] mb-6">
              {HOME_CTA.title}
            </h2>
            <p className="body-lg text-[var(--text-muted)] mb-10">
              {HOME_CTA.description}
            </p>
            <CTAButton>{HOME_CTA.cta}</CTAButton>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
