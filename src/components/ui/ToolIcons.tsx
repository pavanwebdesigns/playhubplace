import React from 'react';

// Props for all icons
const iconProps = {
  className: "w-10 h-10 text-blue-400 mb-4",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor"
};

// --- Health & Mindfulness ---
export const BreathIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 0 1 0 12.728m-12.728 0a9 9 0 0 1 0-12.728m12.728 0L5.636 18.364m12.728 0L5.636 5.636" /></svg>
);
export const HeartIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);
export const TimerIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

// --- Productivity & Utility ---
export const TodoIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
export const TimeZoneIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0h1.5a1.5 1.5 0 0 0 0-3H12V3h1.5a1.5 1.5 0 0 1 0 3H12v1.5m0 3H15m0 0a1.5 1.5 0 0 0 0-3H12v3Z" /></svg>
);

// --- Internet & Web Tools ---
export const SpeedIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
);
export const IpIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 15.91a4.5 4.5 0 0 1-6.364 0m6.364 0a4.5 4.5 0 0 0-6.364 0M12 8.25V15m0-6.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Z" /></svg>
);
export const QRIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A.75.75 0 0 1 4.5 3.75h3A.75.75 0 0 1 8.25 4.5v3A.75.75 0 0 1 7.5 8.25h-3A.75.75 0 0 1 3.75 7.5v-3ZM15.75 4.5A.75.75 0 0 1 16.5 3.75h3A.75.75 0 0 1 20.25 4.5v3A.75.75 0 0 1 19.5 8.25h-3A.75.75 0 0 1 15.75 7.5v-3ZM3.75 15.75A.75.75 0 0 1 4.5 15h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm12 0a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H15v1.5H9v-1.5Zm0 15H15v1.5H9v-1.5Zm0-6H15v1.5H9v-1.5Zm-5.25 0h1.5v1.5h-1.5v-1.5Zm10.5 0h1.5v1.5h-1.5v-1.5Zm-5.25 0h1.5v1.5h-1.5v-1.5Zm0-5.25h1.5v1.5h-1.5v-1.5Zm0 10.5h1.5v1.5h-1.5v-1.5Z" /></svg>
);

// --- Calculation & Conversion ---
export const CalculatorIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m0 0v2.25m0-2.25h-3m3 0h3m-7.5 0V15m0 0V9m0 6.75v-1.5m0 1.5h-3m3 0h3M3 12h18M3 15h18m-9-9h1.5m-1.5 3h1.5m-1.5 3h1.5m3-9h1.5m-1.5 3h1.5m-1.5 3h1.5M3 9h1.5M3 12h1.5M3 15h1.5m1.5-6H6m1.5 3H6m1.5 3H6m3-6H9m3 3H9m3 3H9m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6 6v3m0 3v3m0 3v3m3-12v3m3 0v3m3 0v3m3-12v3m0 3v3m0 3v3" /></svg>
);
export const BMIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" /></svg>
);

// --- Design / Developer ---
export const ColorIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a16.5 16.5 0 0 0-1.636-7.028M15.59 14.37a16.5 16.5 0 0 1 1.636 7.028m-5.84-7.38a16.5 16.5 0 0 0-7.028 1.636M12 1.834v4.82A6 6 0 0 1 15.59 14.37m-3.59 7.38v-4.82a6 6 0 0 1-5.84-7.38m5.84 2.56a16.5 16.5 0 0 1-1.636-7.028M12 1.834a16.5 16.5 0 0 0-7.028 1.636" /></svg>
);
export const CompressIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" /></svg>
);
export const JsonIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12M6 3.75h12" /></svg>
);

// --- Add a fallback icon ---
export const FallbackIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
);