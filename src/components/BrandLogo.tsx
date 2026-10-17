import React from 'react';

interface BrandLogoProps {
  customLogoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  customLogoUrl,
  size = 'md',
  showText = true,
  className = '',
}) => {
  // If the store owner has uploaded their own logo, display it
  if (customLogoUrl) {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    }[size];

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={customLogoUrl}
          alt="Ma Babar Dowa Telecom"
          referrerPolicy="no-referrer"
          className={`${sizeClasses} object-contain rounded-full shadow-sm bg-white p-0.5 border border-slate-200`}
        />
        {showText && (
          <div className="flex flex-col text-left">
            <span className="text-base font-bold text-slate-900 leading-tight">
              মা বাবার দোয়া টেলিকম
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Ma Babar Dowa Telecom
            </span>
          </div>
        )}
      </div>
    );
  }

  // Exact vector reproduction of the confirmed circular official logo:
  // Circular blue frame, smartphone with electric blue swoosh orbit, radiating signal waves,
  // bold Bangla typography "মা বাবার দোয়া টেলিকম", and em-dash tagline "— যোগাযোগে থাকুন সবসময় —"
  const pixelSizes = {
    sm: 36,
    md: 46,
    lg: 72,
    xl: 120,
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        width={pixelSizes}
        height={pixelSizes}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-200 hover:scale-105"
        aria-label="মা বাবার দোয়া টেলিকম লোগো"
      >
        {/* Outer Circular Navy/Blue Ring */}
        <circle cx="100" cy="100" r="95" stroke="#0056B3" strokeWidth="8" fill="#FFFFFF" />

        {/* Radio / Signal Waves emitting from phone */}
        <path
          d="M135 48 C145 53, 152 64, 155 76"
          stroke="#0056B3"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M142 38 C158 45, 168 59, 172 75"
          stroke="#0056B3"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tilted Smartphone Body */}
        <g transform="rotate(14 100 70)">
          {/* Phone Shell */}
          <rect
            x="76"
            y="26"
            width="48"
            height="86"
            rx="9"
            fill="#0F172A"
            stroke="#0F172A"
            strokeWidth="3"
          />
          {/* Inner Screen */}
          <rect
            x="80"
            y="32"
            width="40"
            height="70"
            rx="4"
            fill="#FFFFFF"
          />
          {/* Home Indicator / Button */}
          <circle cx="100" cy="106" r="3.5" fill="#E2E8F0" />
          {/* Top Speaker Notch */}
          <line x1="94" y1="29" x2="106" y2="29" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Electric Blue Dynamic Elliptical Orbit Swoosh around phone */}
        <path
          d="M 52 82 C 42 96, 68 116, 120 110 C 158 105, 170 85, 148 76 C 136 71, 118 73, 102 78"
          stroke="#0284C7"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Official Store Name in Bengali typography */}
        <text
          x="100"
          y="136"
          textAnchor="middle"
          fill="#0A1E3F"
          fontFamily="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif"
          fontWeight="800"
          fontSize="23"
          letterSpacing="0.2"
        >
          মা বাবার দোয়া
        </text>
        <text
          x="100"
          y="164"
          textAnchor="middle"
          fill="#0056B3"
          fontFamily="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif"
          fontWeight="800"
          fontSize="27"
          letterSpacing="0.5"
        >
          টেলিকম
        </text>

        {/* Tagline between em-dashes */}
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#1E293B"
          fontFamily="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif"
          fontWeight="600"
          fontSize="9.5"
          letterSpacing="0.3"
        >
          — যোগাযোগে থাকুন সবসময় —
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
            মা বাবার দোয়া টেলিকম
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Ma Babar Dowa Telecom
          </span>
        </div>
      )}
    </div>
  );
};
