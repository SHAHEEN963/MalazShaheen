/** One drawn arrow, mirrored for the other direction, so both buttons match
 *  exactly — the → and ← glyphs differ in size and weight between fonts. */
export function ArrowIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={flip ? "-scale-x-100" : undefined}
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}
