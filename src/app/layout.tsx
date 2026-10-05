import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Not preloaded: no route renders these yet (the public site uses Arial),
// and a preload would spend ~50KB of first-load bandwidth on every page.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Music Mandi",
  description: "Music Mandi frontend",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The public site sets `scroll-behavior: smooth` for in-page anchors;
      // this tells Next.js to switch it off during route changes so a new
      // page starts at the top instantly instead of animating there.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
