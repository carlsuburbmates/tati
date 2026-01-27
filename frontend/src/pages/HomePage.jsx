import React from 'react';
import { ArrowRight, Check, Star, Users, Award } from 'lucide-react';
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
      <section className="relative min-h-[90vh] flex items-center macro-grid-subtle">
        <div className="container-site py-20 md:py-32">
          <div className="max-w-4xl">
            <div className="badge mb-6 animate-fade-in-up">
              <Star size={12} />
              Evidence-Based Coaching
            </div>
            <h1 className="display-xl text-[var(--text-primary)] mb-6 animate-fade-in-up animate-delay-100">
              {HOME_HERO.headline}
            </h1>
            <p className="body-lg text-[var(--text-secondary)] max-w-2xl mb-10 animate-fade-in-up animate-delay-200">
              {HOME_HERO.subheadline}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <CTAButton>{HOME_HERO.cta}</CTAButton>
              <CTAButton variant="secondary" href="/results" external={false} showArrow={false}>
                View Results
              </CTAButton>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
      </section>

      {/* Stats Strip */}
      <section className="bg-[var(--bg-subtle)] border-y border-[var(--border-light)]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-light)]">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionMarker number={HOME_INTRO.marker} />
              <h2 className="display-md text-[var(--text-primary)] mb-6">
                {HOME_INTRO.title}
              </h2>
              <p className="body-lg text-[var(--text-secondary)] mb-8">
                {HOME_INTRO.description}
              </p>
              <ul className="space-y-4">
                {HOME_INTRO.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center mt-0.5">
                      <Check size={14} className="text-[var(--text-ink)]" />
                    </span>
                    <span className="body-md text-[var(--text-secondary)]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="paper-card p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center">
                    <Award size={28} className="text-[var(--text-ink)]" />
                  </div>
                  <div>
                    <p className="heading-3 text-[var(--text-ink)]">Tati, RN</p>
                    <p className="body-sm text-[var(--text-ink)] opacity-60">Registered Nurse & Coach</p>
                  </div>
                </div>
                <p className="body-md text-[var(--text-ink)] leading-relaxed">
                  "My mission is to help you find balance—not perfection. I believe in sustainable, science-backed approaches that fit into real life."
                </p>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[var(--brand-primary)] rounded-xl -z-10 opacity-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-py bg-[var(--bg-subtle)]">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionMarker number={HOME_SERVICES.marker} />
            <h2 className="display-md text-[var(--text-primary)]">
              {HOME_SERVICES.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOME_SERVICES.items.map((service) => (
              <div key={service.id} className="paper-card group cursor-pointer">
                <div className="label-mono text-[var(--text-ink)] opacity-50 mb-4">
                  0{service.id}
                </div>
                <h3 className="heading-2 text-[var(--text-ink)] mb-3">
                  {service.title}
                </h3>
                <p className="body-sm text-[var(--text-ink)] opacity-70 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 body-sm text-[var(--text-ink)] opacity-80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-[var(--text-ink)]/10">
                  <span className="btn-ghost text-[var(--text-ink)] group-hover:text-[var(--brand-primary)] transition-colors">
                    Learn More <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <CTAButton href="/work-with-me" external={false}>
              Explore All Programs
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-py">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionMarker number={HOME_TESTIMONIALS.marker} />
            <h2 className="display-md text-[var(--text-primary)]">
              {HOME_TESTIMONIALS.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOME_TESTIMONIALS.items.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative bg-[var(--bg-subtle)] rounded-2xl p-8 border border-[var(--border-light)]"
              >
                <div className="quote-mark mb-4">“</div>
                <p className="body-md text-[var(--text-primary)] mb-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--border-light)] flex items-center justify-center">
                    <Users size={18} className="text-[var(--text-secondary)]" />
                  </div>
                  <div>
                    <p className="heading-3 text-[var(--text-primary)]">{testimonial.name}</p>
                    <p className="label-mono text-[var(--brand-primary)]">{testimonial.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-py bg-[var(--bg-card)]">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <SectionMarker number={HOME_CTA.marker} dark />
            <h2 className="display-md text-[var(--text-ink)] mb-6">
              {HOME_CTA.title}
            </h2>
            <p className="body-lg text-[var(--text-ink)] opacity-70 mb-10">
              {HOME_CTA.description}
            </p>
            <CTAButton className="bg-[var(--text-ink)] hover:bg-[var(--text-ink)]/90 text-[var(--bg-card)]">
              {HOME_CTA.cta}
            </CTAButton>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
