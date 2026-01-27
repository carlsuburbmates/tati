import React from 'react';

const PageLayout = ({ children, className = '' }) => {
  return (
    <main className={`pt-20 min-h-screen ${className}`}>
      {children}
    </main>
  );
};

export default PageLayout;
