import { tickerItems } from "@/retro/data";

export function Ticker() {
  // Two identical tracks sliding in lockstep gives a seamless loop.
  const track = (
    <div className="ticker-track" aria-hidden="true">
      {tickerItems.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="title flex items-center gap-3 text-xs text-pink"
        >
          <span className="text-cyan">◆</span>
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker">
      <span className="sr-only">{tickerItems.join(". ")}.</span>
      {track}
      {track}
    </div>
  );
}
