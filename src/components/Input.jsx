import React from 'react';

export const Input = ({ className, children, variant, contentKey, ...props }) => {
  return (
    <input className={className} {...props} />
  );
};

