import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Award } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import CTAButton from '../components/CTAButton';
import PageLayout from '../components/PageLayout';
import {
  HOME_HERO,
  HOME_STATS,
  HOME_ABOUT,
  HOME_SERVICES,
  HOME_TESTIMONIALS,
  HOME_CTA,
} from '../data/mock';

const HomePage = () => {
  return (
    <PageLayout>
      {/* Floating Blobs - Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob blob-rose w-[400px] h-[400px] -top-20 -right-20 opacity-30" />
        <div className="blob blob-sage w-[300px] h-[300px] top-1/3 -left-20 opacity-20" style={{ animationDelay: '-3s' }} />
        <div className="blob blob-gold w-[250px] h-[250px] bottom-1/4 right-1/4 opacity-20" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative section pt-12 md:pt-20">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="badge mb-6 animate-fade-up">
              <Sparkles size={12} />
              {HOME_HERO.label}
            </div>
            
            <h1 className="text-display mb-6 animate-fade-up animate-delay-1">
              {HOME_HERO.headline}
            </h1>
            
            <p className="text-body-lg text-[var(--text-body)] mb-10 max-w-2xl animate-fade-up animate-delay-2">
              {HOME_HERO.subheadline}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-3">
              <CTAButton>{HOME_HERO.cta}</CTAButton>
              <Link to="/results" className="btn-secondary">
                {HOME_HERO.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section py-12 md:py-16">
        <div className="container">
          <div className="card !p-0 overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-[var(--border)]">
              {HOME_STATS.map((stat, index) => (
                <div key={index} className="stat">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-[var(--bg-elevated)]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SectionLabel>{HOME_ABOUT.label}</SectionLabel>
              <h2 className="text-h1 mb-6">{HOME_ABOUT.title}</h2>
              <p className="text-body-lg text-[var(--text-body)] mb-8">
                {HOME_ABOUT.description}
              </p>
              
              <ul className="space-y-4 mb-8">
                {HOME_ABOUT.points.map((point, index) => (
                  <li key={index} className="check-item">
                    <div className="check-icon">
                      <Check size={12} />
                    </div>
                    <span className="text-body text-[var(--text-primary)]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="card glass-border">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-sage)] to-[var(--accent-sage)]/70 flex items-center justify-center">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-h3">{HOME_ABOUT.credential}</p>
                    <p className="text-sm text-[var(--text-muted)]">{HOME_ABOUT.credentialSub}</p>
                  </div>
                </div>
                <p className="text-body text-[var(--text-body)] italic leading-relaxed">
                  "My focus is helping you build something sustainable—not another quick fix that leaves you right back where you started."
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl bg-[var(--accent-rose)]/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-[var(--accent-gold)]/30 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Horizontal scroll on mobile */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <SectionLabel>{HOME_SERVICES.label}</SectionLabel>
            <h2 className="text-h1">{HOME_SERVICES.title}</h2>
          </div>
          
          <div className="scroll-x md:grid-cols-3 md:gap-6">
            {HOME_SERVICES.items.map((service) => (
              <div 
                key={service.id} 
                className={`card w-[300px] md:w-auto ${service.popular ? 'card-featured' : ''}`}
              >
                {service.popular && (
                  <div className="badge badge-sage mb-4">
                    <Sparkles size={10} />
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-h2 mb-2">{service.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-[var(--text-body)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-coral)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="pt-5 border-t border-[var(--border)]">
                  <Link to="/work-with-me" className="btn-ghost">
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/work-with-me" className="btn-secondary">
              Explore All Programs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Swipeable on mobile */}
      <section className="section bg-[var(--bg-elevated)]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <SectionLabel>{HOME_TESTIMONIALS.label}</SectionLabel>
            <h2 className="text-h1">{HOME_TESTIMONIALS.title}</h2>
          </div>
          
          <div className="scroll-x md:grid-cols-3 md:gap-6">
            {HOME_TESTIMONIALS.items.map((testimonial) => (
              <div key={testimonial.id} className="card w-[300px] md:w-auto">
                <div className="quote-mark mb-2">"</div>
                <p className="text-body text-[var(--text-primary)] mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-rose)] to-[var(--brand-coral)] flex items-center justify-center text-white font-medium text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-h3">{testimonial.name}</p>
                    <p className="text-label text-[var(--accent-sage)]">{testimonial.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card glass-border text-center max-w-2xl mx-auto py-12 md:py-16">
            <h2 className="text-h1 mb-4">{HOME_CTA.title}</h2>
            <p className="text-body-lg text-[var(--text-body)] mb-8 max-w-lg mx-auto">
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
