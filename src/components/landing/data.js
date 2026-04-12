// ── Data & constants for the landing page ──

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Results", href: "#results" },
];

export const DEMO_CLIPS = [
  { title: "This entrepreneur from Saudi...", views: "2.3M views", duration: "0:42", gradient: "from-violet-600 to-blue-600" },
  { title: "Day 31, we've sold $4,000...", views: "890K views", duration: "0:38", gradient: "from-pink-600 to-purple-600" },
  { title: "I asked ChatGPT how to...", views: "4.1M views", duration: "0:55", gradient: "from-blue-600 to-cyan-500" },
  { title: "Dropshipping ain't dead, in...", views: "1.7M views", duration: "0:31", gradient: "from-purple-600 to-pink-600" },
  { title: "How to generate viral clips...", views: "3.2M views", duration: "0:48", gradient: "from-indigo-600 to-violet-600" },
  { title: "Stop wasting time editing...", views: "5.6M views", duration: "0:29", gradient: "from-fuchsia-600 to-purple-600" },
  { title: "This strategy changed every...", views: "2.8M views", duration: "0:44", gradient: "from-violet-500 to-indigo-600" },
];

export const FEATURES = [
  {
    title: "AI viral moment detection",
    description: "Identifies hooks, emotional peaks, and high-engagement markers to automatically select the best clips.",
    iconPath: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z",
  },
  {
    title: "Auto-generated captions",
    description: "Accurate, stylized captions that boost watch time and accessibility across all platforms.",
    iconPath: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  },
  {
    title: "TikTok optimized formatting",
    description: "9:16 aspect ratio, perfect cropping, and platform-ready export for TikTok, Reels, and Shorts.",
    iconPath: "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
  },
];

export const CREATORS = [
  {
    name: "Sarah Chen",
    handle: "@sarahcreates",
    verified: true,
    quote: "clipFast turned my 2-hour podcast into 17 viral clips. Insane.",
    stats: { views: "14.2M", clips: "47", reach: "2,400 views" },
    color: "from-violet-500 to-blue-500",
  },
  {
    name: "Jake Morrison",
    handle: "@jakebuilds",
    verified: true,
    quote: "I went from 6K to 150K followers in 3 weeks using clipFast clips.",
    stats: { views: "31.7M", clips: "89", reach: "6,100 views" },
    color: "from-orange-500 to-pink-500",
  },
  {
    name: "Luna Park",
    handle: "@lunafilms",
    verified: true,
    quote: "The AI captures moments I'd always overlook. My engagement doubled.",
    stats: { views: "8.9M", clips: "24", reach: "1,800 views" },
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Marcus Reed",
    handle: "@marcustalks",
    verified: true,
    quote: "Real time in my creative work. Nothing else comes close.",
    stats: { views: "22.4M", clips: "63", reach: "7,300 views" },
    color: "from-rose-500 to-purple-500",
  },
];
