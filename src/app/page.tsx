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

export default function Home() {
  return (
    <>
      <Backdrop />
      <div className="vignette" aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />
      <InkTrail />
      <Nav />
      <JourneyRail />

      <main className="relative z-10">
        <Hero />
        <Studio />
        <Gallery />
        <Offerings />
        <Journey />
        <Voices />
        <InkLab />
        <Signature />
      </main>
    </>
  );
}
