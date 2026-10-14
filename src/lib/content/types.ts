/** The complete, editable content of the calligraphy site. */

/** One slide inside a work's detail carousel. */
export type WorkItem = {
  id: string;
  image: string;
  title: string;
  description: string;
};

export type Work = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  /** Cover shown on the cylinder card: a public path, or "" for the lettermark. */
  image: string;
  /**
   * Extra pieces shown as a carousel when the work is opened. When empty the
   * modal falls back to a single slide built from the fields above.
   */
  items: WorkItem[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
};

export type ProcessStep = {
  id: string;
  step: string;
  title: string;
  description: string;
};

/** A client review, published as an image (a screenshot of the message). */
export type Testimonial = {
  id: string;
  image: string;
  /** Read out to screen readers in place of the picture. */
  caption: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type Stat = {
  id: string;
  value: string;
  label: string;
};

export type Artist = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  philosophy: string;
  bio: string[];
  specialties: string[];
  /** Public path to the portrait, or "" to fall back to the gold lettermark. */
  portrait: string;
  /** Wordmark in the top bar. "" falls back to the name as text. */
  logoHeader: string;
  /** Large wordmark in the hero. "" falls back to the name as text. */
  logoHero: string;
  /** Uploaded CV. "" hides the download button. */
  cv: string;
  /** Looping video shown in place of the hero wordmark. "" uses the wordmark. */
  heroVideo: string;
  /** The artwork's measured bounds in heroVideo, saved with it so the hero can
   *  play at once. Ignored when it was measured for a different video. */
  heroVideoCrop: VideoCrop | null;
};

/** Where the artwork sits in a hero video, as fractions of the frame. */
export type VideoCrop = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Brightness of the backdrop, 0–1; anything at or below it is keyed out. */
  ground: number;
  /** Width ÷ height of the cropped area, in pixels. */
  aspect: number;
};

export type Contact = {
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  socials: SocialLink[];
};

/** Visible copy for each room, so headings are editable without code changes. */
export type SectionCopy = {
  label: string;
  heading: string;
  intro: string;
};

export type NavLink = {
  id: string;
  label: string;
  href: string;
};

export type RailItem = {
  /** Section the entry scrolls to, without the leading #. */
  id: string;
  label: string;
  index: string;
};

export type Sections = {
  /** The top bar: its navigation entries. */
  header: { links: NavLink[] };
  /** The room index down the side of the page. */
  rail: { items: RailItem[] };
  hero: { ctaPrimary: string; ctaSecondary: string; scrollHint: string };
  studio: SectionCopy;
  gallery: SectionCopy & { cardHint: string; detailCta: string };
  services: SectionCopy;
  journey: SectionCopy;
  voices: SectionCopy;
  ink: SectionCopy & { canvasHint: string; clearLabel: string; saveLabel: string };
  signature: SectionCopy & { headingAccent: string };
};

export type SiteMeta = {
  title: string;
  description: string;
};

export type SiteContent = {
  artist: Artist;
  stats: Stat[];
  works: Work[];
  services: Service[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  contact: Contact;
  sections: Sections;
  meta: SiteMeta;
};
