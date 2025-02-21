// app/page.tsx
import { Metadata } from "next";

import PuzzleClient from "./PuzzleClient";

// For SEO (optional)
export const metadata: Metadata = {
  title: "Slide Puzzle Resume",
  description:
    "A fun sliding puzzle that reveals resume details in the blank tile.",
};

// Statically generate this page. You can remove revalidate if you want a purely static build.
export const revalidate = 3600;

export default function HomePage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      {/* A single puzzle filling the screen */}
      <PuzzleClient />
    </main>
  );
}
