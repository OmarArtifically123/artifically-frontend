import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/context/ThemeContext";
import inter from "@/lib/fonts/inter";
import { getCriticalStyles } from "@/lib/styles/critical";
import { getThemeBootstrapScript } from "@/lib/themeScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artifically - Enterprise AI Automation Platform",
  description: "Deploy Enterprise AI Automations in Minutes. Transform your business operations with battle-tested AI automations.",
  metadataBase: new URL("https://artifically.com"),
  alternates: {
    canonical: "https://artifically.com",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/Artifically.ico", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#6366f1" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://artifically.com/",
    title: "Artifically - Enterprise AI Automation Platform",
    description: "Deploy Enterprise AI Automations in Minutes",
    images: [
      {
        url: "https://artifically.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Artifically platform overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@artifically",
    title: "Artifically - Enterprise AI Automation Platform",
    description: "Deploy Enterprise AI Automations in Minutes",
    images: ["https://artifically.com/twitter-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

const themeBootstrapScript = getThemeBootstrapScript();
const criticalStyles = getCriticalStyles();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <script
          id="theme-bootstrap"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        <link rel="preconnect" href="https://api.artifically.com" crossOrigin="anonymous" />
        <style data-critical="true" dangerouslySetInnerHTML={{ __html: criticalStyles }} />
        <link
          rel="preload"
          href="/images/hero-preview.avif"
          as="image"
          type="image/avif"
          fetchPriority="high"
          imageSrcSet="/images/hero-preview.avif 1920w"
          imageSizes="(max-width: 768px) 92vw, (max-width: 1280px) 60vw, 540px"
        />
        <link
          rel="preload"
          href="/images/hero-preview.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
          imageSrcSet="/images/hero-preview.webp 1920w"
          imageSizes="(max-width: 768px) 92vw, (max-width: 1280px) 60vw, 540px"
        />
        <link rel="preload" href="/images/hero-background.avif" as="image" type="image/avif" />
        <link rel="prefetch" href="/marketplace" as="document" />
        <link rel="prefetch" href="/pricing" as="document" />
        <Script
          id="artifically-analytics"
          src="https://analytics.example.com/script.js"
          async
          strategy="lazyOnload"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}