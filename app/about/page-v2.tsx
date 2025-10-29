import { Metadata } from 'next';
import { Suspense } from 'react';
import HeroSection from '@/components/about-v2/HeroSection';
import ActOneSection from '@/components/about-v2/ActOneSection';
import ActTwoSection from '@/components/about-v2/ActTwoSection';
import ActThreeSection from '@/components/about-v2/ActThreeSection';
import ActFourSection from '@/components/about-v2/ActFourSection';
import ValuesSection from '@/components/about-v2/ValuesSection';
import TeamSection from '@/components/about-v2/TeamSection';
import TimelineSection from '@/components/about-v2/TimelineSection';
import FinalCTASection from '@/components/about-v2/FinalCTASection';
import StructuredData from '@/components/about-v2/StructuredData';
import aboutData from '@/lib/about-data.json';

export const metadata: Metadata = {
  title: "From AI Pilots to Proof | About Artifically",
  description: "End AI theater. Ship outcomes. Learn how Artifically turns enterprise AI pilots into production systems that deliver measurable business impact in weeks, not quarters.",
  openGraph: {
    title: "From AI Pilots to Proof | About Artifically",
    description: "End AI theater. Ship outcomes. Enterprise AI infrastructure that works.",
    images: ['/images/about/hero-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "From AI Pilots to Proof | About Artifically", 
    description: "End AI theater. Ship outcomes. Enterprise AI infrastructure that works.",
    images: ['/images/about/hero-og.png'],
  }
};

export default function AboutPageV2() {
  return (
    <>
      <StructuredData />
      <main className="about-page" role="main">
        <h1 className="sr-only">From AI Pilots to Proof</h1>
        
        <HeroSection />
        <ActOneSection />
        <ActTwoSection />
        <ActThreeSection />
        <ActFourSection />
        <ValuesSection />
        <TeamSection />
        <TimelineSection />
        <FinalCTASection />
      </main>
    </>
  );
}
