import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Link = ({ href, className, children, ...props }) => {
  // Determine if external link
  const isExternal =
    href?.startsWith('http') ||
    href?.startsWith('mailto:') ||
    href?.startsWith('#');

  // Convert .html to React Router paths
  const getTo = (href) => {
    if (!href) return '#';
    if (href.endsWith('.html')) {
      const path = href === 'index.html' ? '/' : href.slice(0, -5);
      return path.startsWith('/') ? path : '/' + path;
    }
    return href;
  };

  if (isExternal) {
    return (
      <a className={className} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink className={className} to={getTo(href)} {...props}>
      {children}
    </RouterLink>
  );
};