import { Nav } from "@/retro/components/Nav";
import { Ticker } from "@/retro/components/Ticker";
import { About } from "@/retro/components/sections/About";
import { Blog } from "@/retro/components/sections/Blog";
import { Footer } from "@/retro/components/sections/Footer";
import { Hero } from "@/retro/components/sections/Hero";
import { Portfolio } from "@/retro/components/sections/Portfolio";
import { Process } from "@/retro/components/sections/Process";
import { Services } from "@/retro/components/sections/Services";

export default function RetroLanding() {
  return (
    <>
      <a
        href="#about"
        className="btn btn-cyan sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:bg-void"
      >
        Skip to content
      </a>

      <div className="crt" aria-hidden="true" />
      <Nav />

      <main>
        <Hero />
        <Ticker />
        <About />
        <Process />
        <Portfolio />
        <Blog />
        <Services />
      </main>

      <Footer />
    </>
  );
}
