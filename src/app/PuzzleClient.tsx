"use client";

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import clsx from 'clsx';
import Image from 'next/image';

function useGridSize() {
  const [gridSize, setGridSize] = useState(3);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) {
        setGridSize(3);
      } else if (width < 1024) {
        setGridSize(4);
      } else {
        setGridSize(5);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return gridSize;
}

// Ordered facts from the resume
const ALL_FACTS = [
  `Zachary A. King | zaking17@gmail.com | Cell: (517) 320-0932`,
  `Experienced technology leader: biotech & health, full-stack dev & team lead.`,
  `Broad technical expertise: software eng, data science, synthetic biology, cloud infra.`,
  `VP of Eng @ Delfina (2022–present): maternal health, AI, EHR integration, mobile apps.`,
  `Associate Dir DevOps @ Amyris: built DevOps practice, GCP, data eng, 400+ strains.`,
  `Project Scientist, PI @ UCSD: big data in biology, new simulations, 5 research articles.`,
  `10+ yrs: Python, JS/TS, React, D3, Linux, SQL, git.`,
  `5+ yrs: Mobile dev (Flutter), Docker, Terraform, HPC, GraphQL, SOC2.`,
  `30+ pubs, 5000+ citations, H-index=25: <a href="https://scholar.google.com/citations?user=ESLgsdUAAAAJ" target="_blank">Google Scholar</a>`,
  // Next 7 => total 16 for 4×4
  `PhD in Bioengineering (UCSD, 2016), BSE (UMich, 2011).`,
  `Developer of <a href="https://escher.github.io" target="_blank">Escher</a> & <a href="http://bigg.ucsd.edu" target="_blank">BiGG Models</a>.`,
  `Trained in Scrum (CSPO 2017), AMA 5-Day MBA (2021).`,
  `Focus on user-centered products, team autonomy & growth.`,
  `NSF GRFP Fellow, Jacobs Fellowship.`,
  `Managed multi-million $ budgets & cross-functional teams.`,
  `Hands-on with iOS, Observability, EHR integration.`,
  // Up to 25 if needed for 5x5
  `Led data warehouse redesign @ Amyris.`,
  `Fluent in multiple programming languages & DB systems.`,
  `Enjoy bridging data science & software engineering.`,
  `Still love coding: Dart, Python, Terraform, TypeScript.`,
  `Integrated mobile apps with EHRs for pregnant patients (Delfina).`,
  `Tackling maternal health crisis with predictive AI & design.`,
  `>30 publications in metabolic modeling & synthetic biology.`,
  `Awards: NSF GRFP, Jacobs Fellowship.`,
  `Last updated July 18, 2024.`,
];

// Slice out exactly N*N facts
function getFactsForGridSize(gridSize: number) {
  const needed = gridSize * gridSize;
  return ALL_FACTS.slice(0, needed);
}

// Generate NxN puzzle image paths in row-major order
function getPuzzleImages(gridSize: number) {
  const basePath = `/puzzle-${gridSize}x${gridSize}`;
  const paths: string[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col + 1;
      const y = gridSize - row;
      paths.push(`${basePath}/image${x}x${y}.jpeg`);
    }
  }
  return paths;
}

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PuzzleClient() {
  const gridSize = useGridSize();

  // Bottom facts
  const resumeFacts = useMemo(() => getFactsForGridSize(gridSize), [gridSize]);

  // Puzzle images
  const puzzleImages = useMemo(() => getPuzzleImages(gridSize), [gridSize]);

  // The tile arrangement: [0..(N*N-2), null]
  const [tiles, setTiles] = useState<(number | null)[]>([]);

  useEffect(() => {
    const total = puzzleImages.length;
    // Instead of [...Array(total - 1).keys()], we do:
    const arr: (number | null)[] = Array.from(
      { length: total - 1 },
      (_, i) => i
    );
    arr.push(null);
    shuffleArray(arr);
    setTiles(arr);
  }, [puzzleImages, gridSize]);

  // Slide puzzle adjacency logic
  function getRowCol(idx: number) {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    return [row, col];
  }
  function isAdjacent(idx1: number, idx2: number) {
    const [r1, c1] = getRowCol(idx1);
    const [r2, c2] = getRowCol(idx2);
    return (
      (r1 === r2 && Math.abs(c1 - c2) === 1) ||
      (c1 === c2 && Math.abs(r1 - r2) === 1)
    );
  }
  function moveTile(from: number, to: number) {
    const newTiles = [...tiles];
    [newTiles[from], newTiles[to]] = [newTiles[to], newTiles[from]];
    setTiles(newTiles);
  }
  function handleTileClick(idx: number) {
    const blankIndex = tiles.indexOf(null);
    if (isAdjacent(idx, blankIndex)) {
      moveTile(idx, blankIndex);
    }
  }

  // Drag-and-drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  function handleDragStart(idx: number) {
    const blankIndex = tiles.indexOf(null);
    if (blankIndex !== -1 && isAdjacent(idx, blankIndex)) {
      setDraggedIndex(idx);
    }
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>, idx: number) {
    if (tiles[idx] === null) {
      e.preventDefault();
    }
  }
  function handleDrop(idx: number) {
    const blankIndex = tiles.indexOf(null);
    if (draggedIndex != null && isAdjacent(draggedIndex, blankIndex)) {
      moveTile(draggedIndex, blankIndex);
    }
    setDraggedIndex(null);
  }

  // Update container size calculation to account for margins
  const [containerSize, setContainerSize] = useState(0);
  useEffect(() => {
    function updateSize() {
      // Account for 8px total margin (4px on each side)
      const maxWidth = window.innerWidth - 8;
      const maxHeight = window.innerHeight - 8;
      setContainerSize(Math.min(maxWidth, maxHeight));
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    // Add flex centering to parent and margins to container
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div
        className="relative mx-1 overflow-hidden"
        style={{
          width: containerSize,
          height: containerSize,
        }}
      >
        {/* Bottom layer: NxN facts */}
        <div
          className="absolute inset-0 grid"
          style={{
            zIndex: 0,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {resumeFacts.map((fact, i) => (
            <div
              key={i}
              className="relative flex items-center justify-center border overflow-hidden"
            >
              {/*
                 We clamp text to avoid expanding each square.
                 This snippet clamps to ~4 lines. Adjust as needed.
              */}
              <div
                className="text-sm text-center"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: fact }}
              />
            </div>
          ))}
        </div>

        {/* Top layer: NxN puzzle */}
        <div
          className="absolute inset-0 grid"
          style={{
            zIndex: 1,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {tiles.map((tile, idx) => {
            const isBlank = tile === null;
            const blankIndex = tiles.indexOf(null);
            const canMove = !isBlank && isAdjacent(idx, blankIndex);

            if (isBlank) {
              // Transparent cell => reveals resume text below
              return (
                <div
                  key={idx}
                  className="relative"
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={() => handleDrop(idx)}
                />
              );
            } else {
              // Image tile
              return (
                <div
                  key={idx}
                  className={clsx(
                    "relative flex items-center justify-center border",
                    canMove ? "cursor-pointer" : "cursor-default"
                  )}
                  onClick={() => handleTileClick(idx)}
                  draggable={canMove}
                  onDragStart={() => handleDragStart(idx)}
                >
                  <Image
                    src={puzzleImages[tile]!}
                    alt={`Tile ${tile}`}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            }
          })}
        </div>

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }
          html {
            color-scheme: light dark;
          }
          body {
            margin: 0;
            background-color: #fdfdfd;
            color: #333;
            padding: 0;
          }
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #111;
              color: #eee;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
