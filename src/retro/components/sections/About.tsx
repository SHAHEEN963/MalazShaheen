import { Heading } from "@/retro/components/Heading";
import { about } from "@/retro/data";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="section scan-bg"
    >
      <div className="wrap">
        <Heading index="01" title="ABOUT" id="about-title" />

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          {/* the terminal window */}
          <div className="terminal">
            <div className="terminal-bar">
              <span className="led bg-pink text-pink" aria-hidden="true" />
              <span className="led bg-amber text-amber" aria-hidden="true" />
              <span className="led bg-cyan text-cyan" aria-hidden="true" />
              <span className="ms-2">{about.terminalName}</span>
            </div>

            <div className="p-6 font-[family-name:var(--font-term)] text-xl leading-relaxed text-cyan/90 sm:p-8">
              {about.lines.map((line, i) => (
                <p key={i} className="min-h-[1.4em]">
                  {line ? (
                    <>
                      <span className="text-violet select-none">&gt; </span>
                      {line}
                    </>
                  ) : null}
                </p>
              ))}
              <p aria-hidden="true">
                <span className="text-violet select-none">&gt; </span>
                <span className="inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-cyan" />
              </p>
            </div>
          </div>

          {/* readout stats */}
          <dl className="grid grid-cols-2 gap-4">
            {/* column-reverse: the number reads first, but <dt> still precedes <dd> */}
            {about.stats.map(({ value, label }) => (
              <div
                key={label}
                className="panel bracket flex flex-col-reverse p-5 text-center"
              >
                <dt className="mt-2 font-[family-name:var(--font-term)] text-base tracking-[0.2em] text-dim uppercase">
                  {label}
                </dt>
                <dd className="title neon-cyan text-4xl sm:text-5xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* values */}
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {about.values.map(({ title, body }) => (
            <li key={title} className="panel p-6">
              <h3 className="title neon-pink mb-3 text-base">{title}</h3>
              <p className="text-ink/75">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
