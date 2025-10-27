import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import AppShell from "@/components/AppShell";
import PageTransition from "@/components/PageTransition";
import SkipLink from "@/components/SkipLink";
import { ThemeProvider } from "@/context/ThemeContext";
import { CONTRAST_DEFAULT, THEME_DARK } from "@/context/themeConstants";
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
      { url: "/favicon.svg", type: "image/svg+xml" },
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
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const themeBootstrapScript = getThemeBootstrapScript();
const criticalStyles = getCriticalStyles();

const DEFAULT_THEME = THEME_DARK;
const DEFAULT_CONTRAST = CONTRAST_DEFAULT;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={inter.variable}
      data-theme={DEFAULT_THEME}
      data-contrast={DEFAULT_CONTRAST}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        
        {/* Critical inline scripts - Run before any rendering */}
        <script
          id="theme-bootstrap"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        
        {/* Critical CSS - Inline for instant paint */}
        <style 
          data-critical="true" 
          dangerouslySetInnerHTML={{ __html: criticalStyles }} 
        />
        
        {/* DNS Prefetch & Preconnect - Establish connections early */}
        <link rel="dns-prefetch" href="https://api.artifically.com" />
        <link rel="dns-prefetch" href="https://analytics.example.com" />
        <link rel="dns-prefetch" href="https://cdn.artifically.com" />
        <link 
          rel="preconnect" 
          href="https://api.artifically.com" 
          crossOrigin="anonymous" 
        />
        
        {/* 
          CRITICAL: Preload LCP image with fetchpriority="high"
          This is the single most important optimization for LCP
        */}
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
        
        {/* Preload critical fonts with display=swap to prevent invisible text */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Background image - Lower priority, can load after LCP */}
        <link 
          rel="preload" 
          href="/images/hero-background.avif" 
          as="image" 
          type="image/avif"
          fetchPriority="low"
        />
        
        {/* Prefetch next likely navigation targets */}
        <link rel="prefetch" href="/marketplace" as="document" />
        <link rel="prefetch" href="/pricing" as="document" />
        
        {/* Modulepreload for critical JavaScript chunks */}
        <link rel="modulepreload" href="/_next/static/chunks/main.js" />
        
        {/* Analytics - Load asynchronously after everything else */}
        <Script
          id="artifically-analytics"
          src="https://analytics.example.com/script.js"
          strategy="lazyOnload"
          defer
        />
        
        {/* 
          Performance monitoring - Track Web Vitals
          Load early but non-blocking
        */}
        <Script
          id="web-vitals"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Inline Web Vitals tracking
              (function() {
                var vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';
                
                function sendToAnalytics(metric) {
                  var body = JSON.stringify({
                    dsn: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
                    id: metric.id,
                    page: window.location.pathname,
                    href: window.location.href,
                    event_name: metric.name,
                    value: metric.value.toString(),
                    speed: navigator.connection ? navigator.connection.effectiveType : ''
                  });
                  
                  if (navigator.sendBeacon) {
                    navigator.sendBeacon(vitalsUrl, body);
                  } else {
                    fetch(vitalsUrl, { body: body, method: 'POST', keepalive: true });
                  }
                }
                
                // Report all Web Vitals
                if ('PerformanceObserver' in window) {
                  // CLS
                  var clsObserver = new PerformanceObserver(function(list) {
                    var entries = list.getEntries();
                    var cls = 0;
                    entries.forEach(function(entry) {
                      if (!entry.hadRecentInput) {
                        cls += entry.value;
                      }
                    });
                    if (cls > 0) {
                      sendToAnalytics({ name: 'CLS', value: cls, id: 'v3-' + Date.now() });
                    }
                  });
                  try {
                    clsObserver.observe({ type: 'layout-shift', buffered: true });
                  } catch (e) {}
                  
                  // LCP
                  var lcpObserver = new PerformanceObserver(function(list) {
                    var entries = list.getEntries();
                    var lastEntry = entries[entries.length - 1];
                    sendToAnalytics({ 
                      name: 'LCP', 
                      value: lastEntry.renderTime || lastEntry.loadTime, 
                      id: 'v3-' + Date.now() 
                    });
                  });
                  try {
                    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                  } catch (e) {}
                  
                  // FID
                  var fidObserver = new PerformanceObserver(function(list) {
                    var entries = list.getEntries();
                    entries.forEach(function(entry) {
                      sendToAnalytics({ 
                        name: 'FID', 
                        value: entry.processingStart - entry.startTime, 
                        id: 'v3-' + Date.now() 
                      });
                    });
                  });
                  try {
                    fidObserver.observe({ type: 'first-input', buffered: true });
                  } catch (e) {}
                  
                  // FCP
                  var fcpObserver = new PerformanceObserver(function(list) {
                    var entries = list.getEntries();
                    entries.forEach(function(entry) {
                      if (entry.name === 'first-contentful-paint') {
                        sendToAnalytics({ name: 'FCP', value: entry.startTime, id: 'v3-' + Date.now() });
                      }
                    });
                  });
                  try {
                    fcpObserver.observe({ type: 'paint', buffered: true });
                  } catch (e) {}
                  
                  // TTFB
                  var navObserver = new PerformanceObserver(function(list) {
                    var entries = list.getEntries();
                    entries.forEach(function(entry) {
                      sendToAnalytics({ 
                        name: 'TTFB', 
                        value: entry.responseStart - entry.requestStart, 
                        id: 'v3-' + Date.now() 
                      });
                    });
                  });
                  try {
                    navObserver.observe({ type: 'navigation', buffered: true });
                  } catch (e) {}
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={inter.className}
        data-theme={DEFAULT_THEME}
        data-contrast={DEFAULT_CONTRAST}
      >
        {/* Skip link for accessibility - Zero performance impact */}
        <SkipLink />
        
        <ThemeProvider>
          <AppShell>
            <PageTransition>{children}</PageTransition>
          </AppShell>
        </ThemeProvider>
        
        {/* Vercel Analytics - Non-blocking */}
        <Analytics />
      </body>
    </html>
  );
}


