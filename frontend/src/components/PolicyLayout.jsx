import React from 'react';
import PageLayout from '../components/PageLayout';

const PolicyLayout = ({ title, lastUpdated, content }) => {
  return (
    <PageLayout>
      <section className="section-py">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <p className="label-mono text-[var(--text-muted)] mb-4">
                Last updated: {lastUpdated}
              </p>
              <h1 className="display-md text-[var(--text-ink)]">
                {title}
              </h1>
            </div>

            <div className="space-y-10">
              {content.map((section, index) => (
                <div key={index} className="paper-card">
                  <h2 className="heading-2 text-[var(--text-ink)] mb-4">
                    {section.heading}
                  </h2>
                  <p className="body-md text-[var(--text-muted)] leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PolicyLayout;
