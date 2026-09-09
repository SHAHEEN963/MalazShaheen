import { Heading } from "@/retro/components/Heading";
import { services, site } from "@/retro/data";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="section scan-bg"
    >
      <div className="wrap">
        <Heading
          index="05"
          title="SERVICES"
          id="services-title"
          lede="Three ways to work with us. Fixed prices, fixed scope, no hourly surprises."
        />

        <ul className="grid gap-6 lg:grid-cols-3">
          {services.map(({ title, price, period, body, features, featured }) => (
            <li key={title}>
              <div
                className={`panel flex h-full flex-col p-7 ${
                  featured
                    ? "border-pink/70 shadow-[0_0_0_1px_var(--color-pink),0_0_50px_rgba(255,46,136,0.22)]"
                    : ""
                }`}
              >
                {featured ? (
                  <p className="title mb-4 self-start bg-pink px-3 py-1 text-[0.65rem] text-void">
                    MOST BOOKED
                  </p>
                ) : null}

                <h3 className="title neon-cyan text-xl">{title}</h3>
                <p className="mt-3 text-sm text-ink/75">{body}</p>

                <p className="mt-6">
                  <span className="title chrome block text-4xl">{price}</span>
                  <span className="mt-1 block font-[family-name:var(--font-term)] text-base tracking-[0.2em] text-dim uppercase">
                    {period}
                  </span>
                </p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-violet/30 pt-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span aria-hidden="true" className="text-cyan">
                        ▸
                      </span>
                      <span className="text-ink/80">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                    `Project enquiry — ${title}`
                  )}`}
                  className={`btn mt-7 justify-center ${
                    featured ? "btn-pink" : "btn-cyan"
                  }`}
                >
                  Start a project
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
