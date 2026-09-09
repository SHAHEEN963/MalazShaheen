import { site } from "@/retro/data";

export function Footer() {
  return (
    <footer className="relative border-t border-violet/40 bg-deep/60">
      <div className="wrap grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="title chrome text-3xl">{site.brand}</p>
          <p className="mt-2 font-[family-name:var(--font-term)] text-lg tracking-[0.25em] text-violet uppercase">
            EST. {site.established}
          </p>
          <p className="mt-4 max-w-xs text-sm text-ink/70">{site.tagline}</p>
        </div>

        <div>
          <h2 className="title neon-cyan mb-4 text-sm">CONTACT</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="text-ink/80 underline decoration-pink/50 underline-offset-4 hover:text-pink"
              >
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
                className="text-ink/80 underline decoration-pink/50 underline-offset-4 hover:text-pink"
              >
                {site.contact.phone}
              </a>
            </li>
            <li className="text-dim">{site.contact.location}</li>
          </ul>
        </div>

        <div>
          <h2 className="title neon-cyan mb-4 text-sm">ELSEWHERE</h2>
          <ul className="space-y-2 text-sm">
            {site.social.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="title text-xs text-dim transition-colors hover:text-cyan"
                >
                  ▸ {label}
                </a>
              </li>
            ))}
          </ul>

          <a href="#home" className="btn btn-cyan mt-8">
            ▲ Back to top
          </a>
        </div>
      </div>

      <div className="border-t border-violet/20 py-6 text-center font-[family-name:var(--font-term)] text-base tracking-[0.2em] text-dim uppercase">
        © {site.established}–2026 {site.brand} — All rights reserved
      </div>
    </footer>
  );
}
