import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0D1211] focus:text-[#B7FF5A] focus:font-mono focus:text-xs focus:rounded focus:outline-none"
    >
      Skip to main scientific content
    </a>
  );
};
