"use client";

import Navbar from "@/components/Navbar";
import { NAV_LINKS } from "@/components/landing/data";
import HeroSection from "@/components/landing/HeroSection";
import ViralClipsSection from "@/components/landing/ViralClipsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CtaSection from "@/components/landing/CtaSection";
import FaqSection from "@/components/FaqSection";
import LandingFooter from "@/components/landing/LandingFooter";
import ScrollReveal from "@/components/ScrollReveal";

const FAQS = [
  {
    question: "What does Cliparo do?",
    answer: "Cliparo takes your long videos and turns them into short clips, automatically.\nNo editing needed — AI finds the best moments, cuts them, adds captions, and formats everything for TikTok, Reels, and Shorts.",
  },
  {
    question: "What kind of videos can I use?",
    answer: "Any long-form video works: YouTube videos, podcasts, interviews, tutorials, courses, talking-head content.\nIf it's longer than a few minutes, Cliparo can work with it.",
  },
  {
    question: "Do I need editing skills?",
    answer: "Zero. You upload, Cliparo does everything.\nYou just pick the clips you like and post them.",
  },
  {
    question: "How long does it take?",
    answer: "A few minutes. While you'd spend hours editing manually, Cliparo processes your entire video and delivers ready-to-post clips — fast.",
  },
  {
    question: "Does it add captions automatically?",
    answer: "Yes. Captions are generated automatically, styled for short-form content, and optimized to keep viewers watching longer.",
  },
  {
    question: "Can I edit the clips after?",
    answer: "Yes. Download your clips and make any tweaks you want in CapCut, Premiere, or any editor you already use.",
  },
  {
    question: "Who is this for?",
    answer: "Anyone creating long-form content who wants to grow on TikTok, Reels, or Shorts without spending hours editing.\nYouTubers, podcasters, coaches, educators, indie creators.",
  },
  {
    question: "When will it be available?",
    answer: "We're in private beta right now. Join the waitlist — early access users get first spots and a lower price when we launch.",
  },
];

export default function Home() {
  const navCta = { label: "Join beta", href: "#waitlist" };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar links={NAV_LINKS} cta={navCta} />
      <ScrollReveal hero>
        <HeroSection />
      </ScrollReveal>
      <ScrollReveal>
        <ViralClipsSection />
      </ScrollReveal>
      <ScrollReveal>
        <HowItWorksSection />
      </ScrollReveal>
      <ScrollReveal>
        <CtaSection />
      </ScrollReveal>
      <ScrollReveal>
        <FaqSection faqs={FAQS} />
      </ScrollReveal>
      <LandingFooter />
    </div>
  );
}
