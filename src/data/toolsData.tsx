import type { ReactElement } from 'react';
import * as Icons from '../components/ui/ToolIcons';

// --- THIS IS THE EXPORT ---
// Use `export type` instead of `export interface`
export type Tool = {
    name: string;
    description: string;
    icon: ReactElement; 
    category: string;
    path: string; 
  };

export const toolCategories = [
  "Health & Mindfulness",
  "Productivity & Utility",
  "Internet & Web Tools",
  "Calculation & Conversion",
  "Design / Developer Tools",
  "Data & AI Tools",
  "Personal & Fun",
  "System / Network Tools",
];

export const toolsData: Tool[] = [
  // --- Health & Mindfulness ---
  {
    name: "Breath Trainer",
    description: "Helps with calmness & focus (custom durations, animations).",
    icon: <Icons.BreathIcon />,
    category: "Health & Mindfulness",
    path: "/tools/breath-trainer"
  },
  {
    name: "Heart Rate Detector",
    description: "Uses your webcam to detect heart rate by analyzing skin color changes.",
    icon: <Icons.HeartIcon />,
    category: "Health & Mindfulness",
    path: "/tools/heart-rate-detector"
  },
  {
    name: "Focus Timer / Pomodoro",
    description: "25–5 min work–break timer with soothing background sounds.",
    icon: <Icons.TimerIcon />,
    category: "Health & Mindfulness",
    path: "/tools/focus-timer"
  },
  {
    name: "Sleep Sounds Player",
    description: "Lo-fi / rain / white noise player with fade timer for sleep.",
    icon: <Icons.FallbackIcon />,
    category: "Health & Mindfulness",
    path: "/tools/sleep-sounds"
  },
  
  // --- Productivity & Utility ---
  {
    name: "Daily Planner / To-Do List",
    description: "Minimal local storage task manager (sync optional).",
    icon: <Icons.TodoIcon />,
    category: "Productivity & Utility",
    path: "/tools/todo-list"
  },
  {
    name: "Time Zone Converter",
    description: "Compare times between cities for meetings.",
    icon: <Icons.TimeZoneIcon />,
    category: "Productivity & Utility",
    path: "/tools/time-zone-converter"
  },

  // --- Internet & Web Tools ---
  {
    name: "Internet Speed Test",
    description: "Measures ping, download, upload.",
    icon: <Icons.SpeedIcon />,
    category: "Internet & Web Tools",
    path: "/tools/speed-test"
  },
  {
    name: "IP & Location Finder",
    description: "Shows your public IP, ISP, and approximate location.",
    icon: <Icons.IpIcon />,
    category: "Internet & Web Tools",
    path: "/tools/ip-finder"
  },
  {
    name: "QR Code Generator / Scanner",
    description: "Create and scan QR codes (camera support).",
    icon: <Icons.QRIcon />,
    category: "Internet & Web Tools",
    path: "/tools/qr-code"
  },

  // --- Calculation & Conversion ---
  {
    name: "EMI / Loan Calculator",
    description: "Monthly installment & total interest calculator.",
    icon: <Icons.CalculatorIcon />,
    category: "Calculation & Conversion",
    path: "/tools/loan-calculator"
  },
  {
    name: "BMI Calculator",
    description: "Body Mass Index calculator with chart.",
    icon: <Icons.BMIcon />,
    category: "Calculation & Conversion",
    path: "/tools/bmi-calculator"
  },

  // --- Design / Developer Tools ---
  {
    name: "Color Palette Generator",
    description: "Random, gradient, or image-based color palettes.",
    icon: <Icons.ColorIcon />,
    category: "Design / Developer Tools",
    path: "/tools/color-palette"
  },
  {
    name: "Image Compressor",
    description: "Compress JPG/PNG/WebP without upload.",
    icon: <Icons.CompressIcon />,
    category: "Design / Developer Tools",
    path: "/tools/image-compressor"
  },
  {
    name: "JSON Formatter",
    description: "Beautify JSON for debugging APIs.",
    icon: <Icons.JsonIcon />,
    category: "Design / Developer Tools",
    path: "/tools/json-formatter"
  },
];