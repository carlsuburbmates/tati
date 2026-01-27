import React from 'react';

const PageLayout = ({ children, className = '' }) => {
  return (
    <main className={`pt-16 md:pt-20 min-h-screen ${className}`}>
      {children}
    </main>
  );
};

export default PageLayout;
