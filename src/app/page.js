"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { NAV_LINKS } from "@/components/landing/data";
import HeroSection from "@/components/landing/HeroSection";
import ViralClipsSection from "@/components/landing/ViralClipsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CreatorResultsSection from "@/components/landing/CreatorResultsSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";

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
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar links={NAV_LINKS} cta={navCta} userMenu={navUserMenu} loading={status === "loading"} />
      <HeroSection />
      <ViralClipsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CreatorResultsSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
