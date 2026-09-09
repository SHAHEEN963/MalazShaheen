"use client";

import { useMemo, useState } from "react";
import { Heading } from "@/retro/components/Heading";
import { projects, type ProjectTag } from "@/retro/data";

const FILTERS = ["ALL", "WEB", "APP", "BRAND", "MOTION"] as const;
type Filter = (typeof FILTERS)[number];

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const shown = useMemo(
    () =>
      filter === "ALL"
        ? projects
        : projects.filter((p) => p.tag === (filter as ProjectTag)),
    [filter]
  );

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className="section scan-bg"
    >
      <div className="wrap">
        <Heading
          index="03"
          title="PORTFOLIO"
          id="portfolio-title"
          lede="Selected work from the last three years. Every thumbnail below is drawn in CSS — no image requests, no layout shift."
        />

        <div
          role="group"
          aria-label="Filter projects by discipline"
          className="mb-10 flex flex-wrap gap-3"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className="chip"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ id, title, client, year, tag, blurb, hue }) => (
            <li key={id}>
              {/* Case-study pages do not exist yet — swap this <article> for a
                  <Link href={`/work/${id}`}> once they do. */}
              <article
                id={id}
                className="panel group h-full transition-[transform,box-shadow] duration-200 hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_var(--color-cyan),0_18px_40px_rgba(0,0,0,0.6)]"
              >
                {/* CSS-only cover art, keyed off the project hue */}
                <div
                  aria-hidden="true"
                  className="relative aspect-[16/10] overflow-hidden border-b border-violet/40"
                  style={{
                    background: `linear-gradient(150deg, hsl(${hue} 90% 22%), hsl(${
                      (hue + 60) % 360
                    } 85% 12%) 60%, #0d0221)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-45"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.28) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <div
                    className="absolute -inset-x-6 top-1/2 h-24 -translate-y-1/2 blur-2xl transition-opacity duration-300 group-hover:opacity-90"
                    style={{
                      background: `hsl(${hue} 100% 60% / 0.55)`,
                      opacity: 0.5,
                    }}
                  />
                  <span className="title absolute inset-0 grid place-items-center text-5xl text-white/90 mix-blend-overlay">
                    {title.slice(0, 2)}
                  </span>
                  <span className="title absolute top-3 right-3 border border-white/40 bg-black/40 px-2 py-1 text-[0.6rem] text-white/90">
                    {tag}
                  </span>
                </div>

                <div className="p-5">
                  <h3
                    className="title glitch neon-cyan text-lg"
                    data-text={title}
                  >
                    {title}
                  </h3>
                  <p className="mt-1 font-[family-name:var(--font-term)] text-base tracking-[0.15em] text-dim uppercase">
                    {client} — {year}
                  </p>
                  <p className="mt-3 text-sm text-ink/75">{blurb}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p aria-live="polite" className="sr-only">
          {shown.length} {shown.length === 1 ? "project" : "projects"} shown for
          filter {filter}.
        </p>
      </div>
    </section>
  );
}
