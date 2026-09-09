import type { Metadata } from "next";
import { Chakra_Petch, Orbitron, VT323 } from "next/font/google";
import "../retro.css";

// Orbitron for the chrome headlines, VT323 for anything pretending to be a
// terminal, Chakra Petch for body copy that still has to be readable.
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
  display: "swap",
});

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEON HORIZON — Design & Engineering Studio",
  description:
    "A design and front-end engineering studio building fast, loud, unmistakably built interfaces. Web, product, brand and motion work.",
};

export default function RetroRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${orbitron.variable} ${vt323.variable} ${chakra.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
