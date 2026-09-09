export function Heading({
  index,
  title,
  id,
  lede,
}: {
  index: string;
  title: string;
  id: string;
  lede?: string;
}) {
  return (
    <div className="mb-14">
      <p className="eyebrow mb-3">
        <span className="text-pink">{index}</span>
        {" // "}
        {title}
      </p>
      <h2
        id={id}
        className="title chrome text-[clamp(2.2rem,7vw,4.5rem)]"
      >
        {title}
      </h2>
      <div className="rule mt-6" />
      {lede ? (
        <p className="mt-6 max-w-2xl text-lg text-ink/80">{lede}</p>
      ) : null}
    </div>
  );
}
