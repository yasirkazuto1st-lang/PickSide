import React from "react";

interface PickSideLogoProps {
  size?: number;
  className?: string;
}

export default function PickSideLogo({ size = 40, className = "" }: PickSideLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <rect width="64" height="64" rx="14" fill="#0f172a" />
      <polygon points="6,26 30,8 30,44" fill="#ef4444" />
      <polygon points="58,38 34,20 34,56" fill="#3b82f6" />
    </svg>
  );
}
