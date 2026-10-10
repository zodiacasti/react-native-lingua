// Design tokens: typography (Poppins). Keep font names in sync with src/theme/tokens.css
import type { FontSource } from "expo-font";

// Keys are the PostScript names of the font files in assets/fonts
export const fontFiles: Record<string, FontSource> = {
  "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
};

// Reference scale from the design system (size px, line-height ratio)
export const typography = {
  h1: { fontFamily: "Poppins-Bold", fontSize: 32, lineHeight: 1.2 },
  h2: { fontFamily: "Poppins-SemiBold", fontSize: 24, lineHeight: 1.3 },
  h3: { fontFamily: "Poppins-SemiBold", fontSize: 20, lineHeight: 1.3 },
  h4: { fontFamily: "Poppins-Medium", fontSize: 16, lineHeight: 1.4 },
  bodyLg: { fontFamily: "Poppins-Regular", fontSize: 16, lineHeight: 1.6 },
  bodyMd: { fontFamily: "Poppins-Regular", fontSize: 14, lineHeight: 1.6 },
  bodySm: { fontFamily: "Poppins-Regular", fontSize: 13, lineHeight: 1.6 },
  caption: { fontFamily: "Poppins-Regular", fontSize: 11, lineHeight: 1.4 },
} as const;
