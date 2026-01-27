import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../data/mock';

const CTAButton = ({ 
  children, 
  variant = 'primary', 
  href = SITE_CONFIG.bookingUrl, 
  external = true,
  showArrow = true,
  className = '',
  ...props 
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${className}`}
        {...props}
      >
        {children}
        {showArrow && <ArrowRight size={16} />}
      </a>
    );
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
      {showArrow && <ArrowRight size={16} />}
    </button>
  );
};

export default CTAButton;
