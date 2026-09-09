// ─────────────────────────────────────────────────────────────────────────────
// NEON HORIZON — content source of truth for the retro landing page.
//
// PLACEHOLDER CONTENT: the studio name, projects, posts and prices below are
// invented for the build. Swap them before this goes anywhere public.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  brand: "NEON HORIZON",
  tagline: "Design & Engineering Studio",
  established: 1984,
  hero: {
    kicker: "EST. 1984 // STILL RUNNING",
    headline: ["NEON", "HORIZON"],
    sub: "We build interfaces that feel like the future looked in 1984 — loud, fast, and impossible to scroll past.",
    ctaPrimary: { label: "VIEW THE WORK", href: "#portfolio" },
    ctaSecondary: { label: "START A PROJECT", href: "#services" },
  },
  contact: {
    email: "hello@neonhorizon.example",
    phone: "+1 (555) 0184",
    location: "Sector 7 — Remote Worldwide",
  },
  social: [
    { label: "GITHUB", href: "https://github.com" },
    { label: "DRIBBBLE", href: "https://dribbble.com" },
    { label: "X / TWITTER", href: "https://x.com" },
  ],
};

export const nav = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "process", label: "PROCESS" },
  { id: "portfolio", label: "PORTFOLIO" },
  { id: "blog", label: "BLOG" },
  { id: "services", label: "SERVICES" },
] as const;

export type SectionId = (typeof nav)[number]["id"];

export const about = {
  heading: "ABOUT THE CREW",
  terminalName: "ABOUT.EXE",
  lines: [
    "Neon Horizon is a four-person studio that designs and ships digital",
    "products end to end — research, interface, front end, launch.",
    "",
    "We started building for the web when tables were layout and every",
    "page had a hit counter. The tools changed. The obsession did not:",
    "make the thing fast, make it clear, make it unforgettable.",
  ],
  stats: [
    { value: "40", label: "YEARS ONLINE" },
    { value: "212", label: "PROJECTS SHIPPED" },
    { value: "18", label: "COUNTRIES" },
    { value: "99", label: "LIGHTHOUSE AVG" },
  ],
  values: [
    { title: "SPEED IS A FEATURE", body: "Every millisecond of load time is a user you lost. We budget performance before we budget pixels." },
    { title: "CLARITY OVER CLEVER", body: "If a first-time visitor needs a manual, the design failed. Loud can still be legible." },
    { title: "BUILT TO OUTLIVE US", body: "Documented, typed, tested. You should be able to hand our code to anyone." },
  ],
};

export const process: { step: string; title: string; body: string; deliverable: string }[] = [
  {
    step: "01",
    title: "INSERT COIN",
    body: "A 60-minute call to map the problem, the audience and the constraints. You leave with a written brief whether or not we work together.",
    deliverable: "Project brief + fixed quote",
  },
  {
    step: "02",
    title: "BLUEPRINT",
    body: "Sitemap, user flows and low-fidelity wireframes. We argue about structure now so we never have to argue about colour later.",
    deliverable: "Wireframes + content plan",
  },
  {
    step: "03",
    title: "RENDER",
    body: "High-fidelity design in the browser, not in a static mock. You review real screens on real devices at every milestone.",
    deliverable: "Design system + live preview",
  },
  {
    step: "04",
    title: "COMPILE",
    body: "Production build: typed, accessible, responsive, tested. CI on every commit, previews on every pull request.",
    deliverable: "Source code + docs",
  },
  {
    step: "05",
    title: "LAUNCH SEQUENCE",
    body: "Deploy, monitor, measure. Thirty days of included support while the analytics tell us what to sharpen.",
    deliverable: "Live site + 30-day support",
  },
];

export type ProjectTag = "WEB" | "BRAND" | "APP" | "MOTION";

export const projects: {
  id: string;
  title: string;
  client: string;
  year: string;
  tag: ProjectTag;
  blurb: string;
  hue: number;
}[] = [
  { id: "vhs-archive", title: "VHS ARCHIVE", client: "Cassette Club", year: "2025", tag: "WEB", blurb: "A searchable archive of 12,000 tape covers with sub-100ms filtering.", hue: 320 },
  { id: "gridrunner", title: "GRIDRUNNER", client: "Vector Labs", year: "2025", tag: "APP", blurb: "Fleet-tracking dashboard rebuilt for operators who work in the dark.", hue: 190 },
  { id: "laserdisc", title: "LASERDISC", client: "Halcyon Media", year: "2024", tag: "BRAND", blurb: "Identity system for a boutique film restoration house.", hue: 275 },
  { id: "chrome-city", title: "CHROME CITY", client: "Meridian", year: "2024", tag: "MOTION", blurb: "Title sequence and motion kit for a documentary series.", hue: 45 },
  { id: "starcourt", title: "STARCOURT", client: "Aurora Retail", year: "2023", tag: "WEB", blurb: "Storefront replatform that cut checkout abandonment by 31%.", hue: 340 },
  { id: "pulsewave", title: "PULSEWAVE", client: "Synth Foundry", year: "2023", tag: "APP", blurb: "Browser synth with a WebAudio engine and zero-latency MIDI.", hue: 165 },
];

export const posts: { id: string; title: string; date: string; readTime: string; excerpt: string; tag: string }[] = [
  {
    id: "css-scanlines",
    title: "Faking a CRT in 12 lines of CSS",
    date: "2026-07-14",
    readTime: "6 MIN",
    tag: "CSS",
    excerpt: "Scanlines, bloom and chromatic aberration without a single image request — and how to switch it all off for prefers-reduced-motion.",
  },
  {
    id: "type-scale",
    title: "The type scale that survived four redesigns",
    date: "2026-06-02",
    readTime: "9 MIN",
    tag: "DESIGN",
    excerpt: "Why we abandoned the golden ratio for a boring modular scale, and the readability numbers that convinced us.",
  },
  {
    id: "ship-fast",
    title: "Our deploy pipeline is 40 seconds. Here's the whole thing.",
    date: "2026-04-28",
    readTime: "11 MIN",
    tag: "ENGINEERING",
    excerpt: "A full walkthrough of the CI config, the caching strategy, and the three checks we refuse to make optional.",
  },
];

export const services: { title: string; price: string; period: string; body: string; features: string[]; featured: boolean }[] = [
  {
    title: "SITE BUILD",
    price: "$6,400",
    period: "FROM / PROJECT",
    body: "Marketing sites and portfolios, designed and built end to end.",
    features: ["Up to 8 unique pages", "Design system + CMS", "Performance budget", "30-day support"],
    featured: false,
  },
  {
    title: "PRODUCT WORK",
    price: "$9,800",
    period: "FROM / PROJECT",
    body: "Application interfaces: dashboards, tools, anything with real state.",
    features: ["Research + flows", "Component library", "Typed front end", "Handoff docs + tests"],
    featured: true,
  },
  {
    title: "RETAINER",
    price: "$3,200",
    period: "PER MONTH",
    body: "An embedded design and front-end team, on call for the long haul.",
    features: ["40 hours monthly", "Same-day responses", "Quarterly roadmap", "Cancel anytime"],
    featured: false,
  },
];

export const tickerItems = [
  "AVAILABLE FOR NEW PROJECTS",
  "DESIGN",
  "FRONT-END ENGINEERING",
  "BRAND SYSTEMS",
  "MOTION",
  "SHIPPING SINCE 1984",
];
