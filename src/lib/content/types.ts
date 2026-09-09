/** The complete, editable content of the calligraphy site. */

export type Work = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  /** Public path such as /uploads/abc.jpg, or "" for the lettermark placeholder. */
  image: string;
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

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
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

export type Sections = {
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
