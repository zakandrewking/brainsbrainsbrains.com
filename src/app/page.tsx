import { Metadata } from 'next';

import PuzzleClient from './PuzzleClient';

export const metadata: Metadata = {
  title: "Zak King",
  description: "Zak's resume; now in slide puzzle form",
};

export default function HomePage() {
  return (
    <main>
      <PuzzleClient />
    </main>
  );
}
