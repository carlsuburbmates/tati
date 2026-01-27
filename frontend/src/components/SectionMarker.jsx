import React from 'react';

const SectionMarker = ({ number, dark = false }) => {
  return (
    <div className={`section-marker ${dark ? 'section-marker-dark' : ''}`}>
      <span>{number}</span>
    </div>
  );
};

export default SectionMarker;
