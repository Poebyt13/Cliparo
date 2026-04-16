// ── Data & constants for the landing page ──

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Results", href: "#results" },
];

export const DEMO_CLIPS = [
  { title: "This entrepreneur from Saudi...", views: "2.3M views", duration: "0:42", src: "/videos/language_video.mp4" },
  { title: "Day 31, we've sold $4,000...", views: "890K views", duration: "0:38", src: "/videos/girl_speaking.mp4" },
  { title: "I asked ChatGPT how to...", views: "4.1M views", duration: "0:55", src: "/videos/more_videos.mp4" },
  { title: "Dropshipping ain't dead, in...", views: "1.7M views", duration: "0:31", src: "/videos/neywork_video.mp4" },
  { title: "How to generate viral clips...", views: "3.2M views", duration: "0:48", src: "/videos/ninja_video.mp4" },
  { title: "Stop wasting time editing...", views: "5.6M views", duration: "0:29", src: "/videos/podcast_video.mp4" },
  { title: "This strategy changed every...", views: "2.8M views", duration: "0:44", src: "/videos/street_video.mp4" },
];

export const FEATURES = [
  {
    title: "Finds your best moments automatically",
    description: "The AI reads your video like a content strategist. It spots hooks, emotional peaks, and high-retention moments — so you never have to guess what to cut.",
    iconPath: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z",
  },
  {
    title: "Captions that keep people watching",
    description: "Styled captions generated automatically. Viewers stay longer. Your content reaches more people.",
    iconPath: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  },
  {
    title: "Platform-ready. Every time.",
    description: "Perfectly cropped to 9:16, ready to post on TikTok, Reels, and Shorts. No exporting, no resizing.",
    iconPath: "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
  },
];

export const CREATORS = [
  {
    name: "Sarah Chen",
    handle: "@sarahcreates",
    verified: true,
    quote: "Cliparo turned my 2-hour podcast into 17 viral clips. Insane.",
    stats: { views: "14.2M", clips: "47", reach: "2,400 views" },
    color: "from-violet-500 to-blue-500",
  },
  {
    name: "Jake Morrison",
    handle: "@jakebuilds",
    verified: true,
    quote: "I went from 6K to 150K followers in 3 weeks using Cliparo clips.",
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
