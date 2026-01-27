import React from 'react';
import PageLayout from '../components/PageLayout';

const PolicyLayout = ({ title, lastUpdated, content }) => {
  return (
    <PageLayout>
      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <p className="text-label text-[var(--text-muted)] mb-3">
                Last updated: {lastUpdated}
              </p>
              <h1 className="text-h1">{title}</h1>
            </div>

            <div className="space-y-6">
              {content.map((section, index) => (
                <div key={index} className="card">
                  <h2 className="text-h3 mb-3">{section.heading}</h2>
                  <p className="text-body text-[var(--text-body)] leading-relaxed">
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
