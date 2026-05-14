import type { Metadata } from "next";
import { Cinzel, Crimson_Text } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import CustomScrollbar from "@/components/CustomScrollbar";
import IntroScreen from "@/components/IntroScreen";
import SoundManager from "@/components/SoundManager";
import AreaToast from "@/components/AreaToast";
import KeyboardNav from "@/components/KeyboardNav";
import MobileWarning from "@/components/MobileWarning";
import ItemToast from "@/components/ItemToast";
import "./globals.css";

/*
  FONTS — loaded via next/font (not a plain CSS import).
  Why next/font? It downloads and self-hosts Google Fonts at build time.
  This means no request to Google's servers at runtime — faster and private.

  Each font is assigned a CSS variable name.
  We registered those variable names in globals.css @theme block.
*/
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",  // becomes font-display in Tailwind
  display: "swap",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-crimson",  // becomes font-body in Tailwind
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vestiges of the Unlit",
  description: "A gaming portfolio documenting 1,000+ hours across soulslike RPGs and action games — 100% achievements in Elden Ring, Sekiro, Bloodborne, and more.",
  keywords: ["gaming portfolio", "soulslike", "completionist", "achievements", "elden ring", "sekiro", "bloodborne", "dark souls"],
  authors: [{ name: "Dimos Gkontevas" }],
  creator: "Dimos Gkontevas",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Vestiges of the Unlit",
    description: "A gaming portfolio documenting 1,000+ hours across soulslike RPGs and action games.",
    siteName: "Vestiges of the Unlit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vestiges of the Unlit",
    description: "A gaming portfolio documenting 1,000+ hours across soulslike RPGs and action games.",
  },
};

/*
  RootLayout wraps EVERY page in the app.
  Whatever you put here — nav, fonts, providers — appears everywhere.
  The {children} is where the actual page content slots in.
*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${crimsonText.variable}`}>
      <body>
        {/* Instant server-rendered cover — prevents flash before IntroScreen hydrates */}
        <div id="intro-cover" style={{ position: 'fixed', inset: 0, background: '#0D0A07', zIndex: 9999 }} />

        {/* Global overlays — order matters for z-index stacking */}
        <CustomScrollbar />
        <IntroScreen />    {/* z-[10000] — topmost, must dismiss first */}
        <CustomCursor />   {/* z-[9998/9999] — above everything except intro */}
        <SoundManager />   {/* z-[200] — mute button, bottom right */}
        <AreaToast />
        <KeyboardNav />
        <MobileWarning />
        <ItemToast />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
