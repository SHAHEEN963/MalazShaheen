import { Heading } from "@/retro/components/Heading";
import { posts } from "@/retro/data";

// Pinned locale + timezone so the server and client render the same string.
const fmt = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function Blog() {
  return (
    <section id="blog" aria-labelledby="blog-title" className="section">
      <div className="wrap">
        <Heading
          index="04"
          title="BLOG"
          id="blog-title"
          lede="Notes from the workbench — mostly CSS, performance and the unglamorous parts of shipping."
        />

        <ul className="grid gap-6 md:grid-cols-3">
          {posts.map(({ id, title, date, readTime, excerpt, tag }) => (
            <li key={id}>
              {/* Post pages do not exist yet — swap for <Link href={`/blog/${id}`}>. */}
              <article className="panel bracket flex h-full flex-col p-6">
                <div className="mb-4 flex items-center justify-between gap-3 font-[family-name:var(--font-term)] text-base tracking-[0.18em] uppercase">
                  <span className="border border-pink/50 px-2 text-pink">
                    {tag}
                  </span>
                  <span className="text-dim">{readTime}</span>
                </div>

                <h3 className="title neon-cyan text-base leading-snug">
                  {title}
                </h3>

                <p className="mt-4 flex-1 text-sm text-ink/75">{excerpt}</p>

                <time
                  dateTime={date}
                  className="mt-6 block border-t border-violet/30 pt-4 font-[family-name:var(--font-term)] text-base tracking-[0.2em] text-violet uppercase"
                >
                  {fmt.format(new Date(`${date}T00:00:00Z`))}
                </time>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
