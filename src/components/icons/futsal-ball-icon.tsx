import React from 'react';

interface FutsalBallIconProps extends React.SVGProps<SVGSVGElement> {}

const FutsalBallIcon: React.FC<FutsalBallIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-ai-hint="futsal ball"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2L12 22" />
    <path d="M18.36 18.36L5.64 5.64" />
    <path d="M18.36 5.64L5.64 18.36" />
    <path d="M22 12L2 12" />
    <path d="M19.07 9.5L4.93 14.5" />
    <path d="M19.07 14.5L4.93 9.5" />
  </svg>
);

export default FutsalBallIcon;
