import { InkTrail } from "@/components/InkTrail";
import { JourneyRail } from "@/components/JourneyRail";
import { Nav } from "@/components/Nav";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { InkLab } from "@/components/sections/InkLab";
import { Journey } from "@/components/sections/Journey";
import { Offerings } from "@/components/sections/Offerings";
import { Signature } from "@/components/sections/Signature";
import { Studio } from "@/components/sections/Studio";
import { Voices } from "@/components/sections/Voices";
import { getContent } from "@/lib/content/store";

/**
 * Rendered per request.
 *
 * The content lives in a Blob the dashboard writes to, which Next has no way
 * to tie a cache entry to, so a prerendered copy kept serving an older
 * document — a saved review simply never appeared. Reading on each request
 * costs a little latency and removes that whole class of confusion.
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  // Everything on this page comes from the dashboard-editable store.
  const { artist, stats, works, services, process, testimonials, contact, sections } =
    await getContent();

  // Voices only renders once a review image exists, so its nav link must go
  // too — otherwise it would scroll nowhere.
  const hasVoices = testimonials.some((t) => t.image);
  const headerCopy = {
    ...sections.header,
    links: sections.header.links.filter(
      (link) => hasVoices || link.href !== "#voices"
    ),
  };

  return (
    <>
      <div className="vignette" aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />
      <InkTrail />
      <Nav artist={artist} copy={headerCopy} />
      <JourneyRail />

      <main
        className="relative z-10"
        data-reviews={testimonials.length}
        data-reviews-with-image={testimonials.filter((t) => t.image).length}
      >
        <Hero artist={artist} copy={sections.hero} />
        <Studio artist={artist} stats={stats} copy={sections.studio} />
        <Gallery works={works} copy={sections.gallery} />
        <Offerings services={services} copy={sections.services} />
        <Journey steps={process} copy={sections.journey} />
        <Voices testimonials={testimonials} copy={sections.voices} />
        <InkLab artistName={artist.name} copy={sections.ink} />
        <Signature artist={artist} contact={contact} copy={sections.signature} />
      </main>
    </>
  );
}
