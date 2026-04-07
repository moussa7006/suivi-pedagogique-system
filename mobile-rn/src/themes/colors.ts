export const COLORS = {
  // Brand - Deep Executive Indigo
  primary: "#4338CA",       // Indigo 700
  primaryDark: "#312E81",   // Indigo 900
  primaryLight: "#EEF2FF",  // Indigo 50
  
  // Accents - Vibrant but Professional
  accent: "#6366F1",        // Indigo 500
  success: "#059669",       // Emerald 600
  warning: "#D97706",       // Amber 600
  error: "#DC2626",         // Red 600
  
  // Neutral - Perfect Slate
  background: "#F1F5F9",    // Slate 100 (Softer than before)
  surface: "#FFFFFF",
  textPrimary: "#0F172A",   // Slate 900
  textSecondary: "#475569", // Slate 600
  textTertiary: "#94A3B8",  // Slate 400
  
  // Glass & Borders
  border: "#E2E8F0",
  glass: "rgba(255, 255, 255, 0.7)",
  white: "#FFFFFF",
  black: "#000000",
};

export const SHADOWS = {
  // Multilayered shadows for realistic depth
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  high: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
};

export const RADIUS = {
  small: 12,
  medium: 20,
  large: 32,
  full: 999,
};
