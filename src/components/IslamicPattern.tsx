import React from 'react';

interface IslamicPatternProps {
  className?: string;
  opacity?: number;
  color?: string; // e.g. '#C9A84C' or '#1B5E20'
}

/**
 * Reusable, high-fidelity Islamic Geometric SVG Background Pattern.
 * Renders beautifully on responsive screens with low performance cost.
 */
export const IslamicPattern: React.FC<IslamicPatternProps> = ({
  className = "absolute inset-0 pointer-events-none",
  opacity = 0.05,
  color = "#C9A84C"
}) => {
  return (
    <div className={`${className} select-none overflow-hidden`} style={{ opacity }}>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* A traditional 8-point star pattern design (Islamic Girih element) */}
          <pattern
            id="islamic-girih"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30,0 L 45,15 L 60,30 L 45,45 L 30,60 L 15,45 L 0,30 L 15,15 Z"
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
            <path
              d="M 30,10 L 40,20 L 50,30 L 40,40 L 30,50 L 20,40 L 10,30 L 20,20 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            {/* Center concentric circle octagons */}
            <circle cx="30" cy="30" r="5" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="0" cy="0" r="6" fill="none" stroke={color} strokeWidth="0.75" />
            <circle cx="60" cy="0" r="6" fill="none" stroke={color} strokeWidth="0.75" />
            <circle cx="0" cy="60" r="6" fill="none" stroke={color} strokeWidth="0.75" />
            <circle cx="60" cy="60" r="6" fill="none" stroke={color} strokeWidth="0.75" />
            <path
              d="M 0,30 L 15,30 M 45,30 L 60,30 M 30,0 L 30,15 M 30,45 L 30,60"
              stroke={color}
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-girih)" />
      </svg>
    </div>
  );
};

export const IslamicBorder: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-4 py-3 select-none ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C9A84C] to-[#1B5E20]/40"></div>
      <div className="flex items-center gap-1.5 text-[#C9A84C]">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12,2L14.47,7.03L20,7.84L16,11.74L16.94,17.25L12,14.65L7.06,17.25L8,11.74L4,7.84L9.53,7.03L12,2M12,5.27L10.39,8.54L6.8,9.07L9.4,11.6L8.79,15.17L12,13.48L15.21,15.17L14.6,11.6L17.2,9.07L13.61,8.54L12,5.27Z" />
        </svg>
        <svg className="w-3 h-3 fill-current rotate-45" viewBox="0 0 24 24">
          <path d="M12,2L14.47,7.03L20,7.84L16,11.74L16.94,17.25L12,14.65L7.06,17.25L8,11.74L4,7.84L9.53,7.03L12,2Z" />
        </svg>
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12,2L14.47,7.03L20,7.84L16,11.74L16.94,17.25L12,14.65L7.06,17.25L8,11.74L4,7.84L9.53,7.03L12,2M12,5.27L10.39,8.54L6.8,9.07L9.4,11.6L8.79,15.17L12,13.48L15.21,15.17L14.6,11.6L17.2,9.07L13.61,8.54L12,5.27Z" />
        </svg>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-[#1B5E20]/40"></div>
    </div>
  );
};
