import React from 'react';
import PolicyLayout from '../components/PolicyLayout';
import { PRIVACY_POLICY } from '../data/mock';

const PrivacyPage = () => {
  return (
    <PolicyLayout
      title={PRIVACY_POLICY.title}
      lastUpdated={PRIVACY_POLICY.lastUpdated}
      content={PRIVACY_POLICY.content}
    />
  );
};

export default PrivacyPage;
