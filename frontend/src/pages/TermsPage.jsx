import React from 'react';
import PolicyLayout from '../components/PolicyLayout';
import { TERMS_OF_SERVICE } from '../data/mock';

const TermsPage = () => {
  return (
    <PolicyLayout
      title={TERMS_OF_SERVICE.title}
      lastUpdated={TERMS_OF_SERVICE.lastUpdated}
      content={TERMS_OF_SERVICE.content}
    />
  );
};

export default TermsPage;
