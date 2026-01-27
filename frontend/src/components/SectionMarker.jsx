import React from 'react';

const SectionMarker = ({ number, light = false }) => {
  return (
    <div className={`section-marker ${light ? 'section-marker-light' : ''}`}>
      <span>{number}</span>
    </div>
  );
};

export default SectionMarker;
