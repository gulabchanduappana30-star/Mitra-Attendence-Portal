import React from 'react';

/**
 * Official MITRA Club & Vishnu Institute of Technology Logo Component
 * Pixel-perfect SVG matching the official Vishnu Institute of Technology branding logo.
 */
export const MitraLogo = ({ 
  className = "h-10", 
  showSubtitle = true,
  colorClass = "text-slate-900 dark:text-white"
}) => {
  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 580 135"
        className={`w-auto h-full ${colorClass} transition-colors duration-200`}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MITRA - Vishnu Institute of Technology"
      >
        {/* MITRA Stylized Futuristic Wordmark */}
        <g className="mitra-exact-brand">
          {/* M - Soft rounded top-left shoulder, clean geometric inner V */}
          <path d="M 10 100 V 32 C 10 14, 25 0, 43 0 H 52 L 82.5 65 L 113 0 H 122 C 140 0, 155 14, 155 32 V 100 H 130 V 34 L 95 100 H 70 L 35 34 V 100 Z" />

          {/* I - Precision vertical stem */}
          <rect x="172" y="0" width="24" height="100" rx="2" />

          {/* T - Wide top crossbar & central stem */}
          <path d="M 212 0 H 312 V 23 H 274 V 100 H 250 V 23 H 212 Z" />

          {/* R - Sleek loop with precision angular cutout diagonal leg */}
          <path d="M 328 0 H 384 C 409 0, 426 14, 426 33 C 426 49, 412 59, 392 61 L 426 100 H 397 L 368 64 H 352 V 100 H 328 Z M 352 22 V 43 H 380 C 392 43, 400 38, 400 32.5 C 400 27, 392 22, 380 22 Z" />

          {/* A - Triangular profile with low crossbar */}
          <path d="M 442 100 L 485 0 H 514 L 557 100 H 531 L 522 78 H 477 L 468 100 Z M 486 57 H 513 L 499.5 24 Z" />
        </g>

        {/* Subtitle: VISHNU INSTITUTE OF TECHNOLOGY */}
        {showSubtitle && (
          <text
            x="283"
            y="130"
            textAnchor="middle"
            fill="currentColor"
            style={{
              fontFamily: "'Inter', 'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
              fontSize: "15px",
              fontWeight: "700",
              letterSpacing: "0.33em",
              textTransform: "uppercase",
              opacity: 0.95
            }}
          >
            VISHNU INSTITUTE OF TECHNOLOGY
          </text>
        )}
      </svg>
    </div>
  );
};

export default MitraLogo;
