import React from 'react';
import PolicyLayout from '../components/PolicyLayout';
import { MEDICAL_DISCLAIMER } from '../data/mock';

const DisclaimerPage = () => {
  return (
    <PolicyLayout
      title={MEDICAL_DISCLAIMER.title}
      lastUpdated={MEDICAL_DISCLAIMER.lastUpdated}
      content={MEDICAL_DISCLAIMER.content}
    />
  );
};

export default DisclaimerPage;
