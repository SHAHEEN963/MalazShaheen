import { site } from "@/retro/data";

export function Hero() {
  const [line1, line2] = site.hero.headline;

  return (
    <section
      id="home"
      aria-labelledby="home-title"
      className="relative flex min-h-svh items-center overflow-hidden pt-20"
    >
      {/* sunset, stars and the endless grid floor */}
      <div className="horizon" aria-hidden="true">
        <div className="stars" />
        <div className="sun" />
        <div className="floor" />
      </div>

      <div className="wrap relative z-10 py-20 text-center">
        {/* boxed so the cyan stays legible where it crosses the sun */}
        <p className="mb-6">
          <span className="eyebrow inline-block border border-cyan/50 bg-void/80 px-4 py-1">
            {site.hero.kicker}
          </span>
        </p>

        <h1 id="home-title" className="title text-[clamp(3rem,15vw,10.5rem)]">
          <span className="chrome block">{line1}</span>
          <span className="chrome block">{line2}</span>
        </h1>

        <p className="on-sun mt-4 font-[family-name:var(--font-term)] text-2xl tracking-[0.35em] text-[#e6cfff] uppercase">
          {site.tagline}
        </p>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-balance text-ink/85">
          {site.hero.sub}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <a href={site.hero.ctaPrimary.href} className="btn btn-pink">
            {site.hero.ctaPrimary.label}
          </a>
          <a href={site.hero.ctaSecondary.href} className="btn btn-cyan">
            {site.hero.ctaSecondary.label}
          </a>
        </div>
      </div>

      {/* scroll hint */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 z-10 text-center font-[family-name:var(--font-term)] text-lg tracking-[0.4em] text-cyan/70"
      >
        ▼ SCROLL ▼
      </div>
    </section>
  );
}
