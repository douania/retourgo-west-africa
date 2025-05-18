
import React from "react";

const RetourGoLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Route shape */}
      <path
        d="M5 12C5 8.13401 8.13401 5 12 5H20C23.866 5 27 8.13401 27 12V20C27 23.866 23.866 27 20 27H12C8.13401 27 5 23.866 5 20V12Z"
        fill="#F97316"
        strokeWidth="2"
      />
      {/* Arrow path representing return/retour */}
      <path
        d="M10 16H22M10 16L14 12M10 16L14 20"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Circular element representing "go" */}
      <circle cx="22" cy="16" r="3" fill="#22C55E" stroke="white" strokeWidth="1.5" />
    </svg>
  );
};

export default RetourGoLogo;
