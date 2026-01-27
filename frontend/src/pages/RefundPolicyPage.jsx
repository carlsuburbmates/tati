import React from 'react';
import PolicyLayout from '../components/PolicyLayout';
import { REFUND_POLICY } from '../data/mock';

const RefundPolicyPage = () => {
  return (
    <PolicyLayout
      title={REFUND_POLICY.title}
      lastUpdated={REFUND_POLICY.lastUpdated}
      content={REFUND_POLICY.content}
    />
  );
};

export default RefundPolicyPage;
