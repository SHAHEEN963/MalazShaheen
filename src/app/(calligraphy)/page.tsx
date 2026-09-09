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
import { Backdrop } from "@/components/three/Backdrop";
import { getContent } from "@/lib/content/store";

export default async function Home() {
  // Everything on this page comes from the dashboard-editable store.
  const { artist, stats, works, services, process, testimonials, contact, sections } =
    await getContent();

  return (
    <>
      <Backdrop />
      <div className="vignette" aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />
      <InkTrail />
      <Nav artist={artist} />
      <JourneyRail />

      <main className="relative z-10">
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
