import { Heading } from "@/retro/components/Heading";
import { process } from "@/retro/data";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section">
      <div className="wrap">
        <Heading
          index="02"
          title="PROCESS"
          id="process-title"
          lede="Five stages, fixed scope, no mystery. You always know which level we are on and what drops at the end of it."
        />

        <ol className="relative space-y-6">
          {/* the neon spine running behind the level nodes */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-7 hidden w-px bg-gradient-to-b from-cyan via-violet to-pink md:block"
          />

          {process.map(({ step, title, body, deliverable }) => (
            <li key={step} className="relative md:ps-24">
              <span
                aria-hidden="true"
                className="title absolute top-6 left-0 hidden h-14 w-14 place-items-center rounded-full border-2 border-cyan bg-void text-lg text-cyan shadow-[0_0_20px_rgba(0,229,255,0.45)] md:grid"
              >
                {step}
              </span>

              <div className="panel bracket p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="title text-violet text-2xl md:hidden">
                    {step}
                  </span>
                  <h3 className="title neon-pink text-xl sm:text-2xl">
                    {title}
                  </h3>
                </div>

                <p className="mt-4 max-w-2xl text-ink/80">{body}</p>

                <p className="mt-5 inline-flex items-center gap-2 border border-cyan/40 bg-cyan/5 px-3 py-1.5 font-[family-name:var(--font-term)] text-base tracking-[0.15em] text-cyan uppercase">
                  <span aria-hidden="true">▸</span>
                  <span className="sr-only">Deliverable: </span>
                  {deliverable}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
