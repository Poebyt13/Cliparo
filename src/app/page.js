"use client";

import { useSession, signOut } from "next-auth/react";
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
    answer: "Cliparo turns your long videos into short, viral-ready clips.\nIt finds the best moments, adds captions, and formats everything automatically.",
  },
  {
    question: "What kind of videos can I use?",
    answer: "You can use any long-form video — YouTube, podcasts, interviews, or recorded content.",
  },
  {
    question: "Do I need editing skills?",
    answer: "No. Everything is automatic.\nJust upload your video and get ready-to-post clips.",
  },
  {
    question: "How long does it take?",
    answer: "Most videos are processed in just a few minutes.\nYou'll get multiple clips much faster than editing manually.",
  },
  {
    question: "Does it add captions automatically?",
    answer: "Yes. Cliparo generates captions styled for TikTok, Reels, and Shorts to boost engagement.",
  },
  {
    question: "Can I edit the clips after?",
    answer: "Yes. You can download your clips and edit them in tools like CapCut or Premiere.",
  },
  {
    question: "Who is this for?",
    answer: "Creators, YouTubers, podcasters, and anyone who wants to grow using short-form content.",
  },
  {
    question: "When will it be available?",
    answer: "Cliparo is currently in private beta.\nJoin the waitlist to get early access.",
  },
];

export default function Home() {
  const { data: session, status } = useSession();

  const navCta = status === "unauthenticated" ? { label: "Join beta", href: "/auth/signin" } : null;
  const navUserMenu = status === "authenticated"
    ? {
        label: session.user.email,
        image: session.user.image || null,
        links: [{ label: "Dashboard", href: "/dashboard" }],
        onLogout: () => signOut(),
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar links={NAV_LINKS} cta={navCta} userMenu={navUserMenu} loading={status === "loading"} />
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
