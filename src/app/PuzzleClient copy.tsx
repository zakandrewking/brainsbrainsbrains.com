"use client";

import {
  useEffect,
  useMemo,
  useRef,
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

const ALL_FACTS = [
  // 1
  `Zak King <a href="mailto:zaking17@gmail.com">zaking17@gmail.com</a>`,
  // 2
  `Reach out on <a href="https://www.linkedin.com/in/zakandrewking/" target="_blank">LinkedIn</a>`,
  // 3
  `VP of Eng @ <a href="https://www.delfina.com" target="_blank">Delfina</a> (2022–present): maternal health, AI, EHR integration`,
  // 4
  `Associate Dir DevOps (2019–2022) @ <a href="https://www.amyris.com" target="_blank">Amyris</a>`,
  // 5
  `Project Scientist, Principle Investigator (2017–2019) @ <a href="https://ucsd.edu" target="_blank">UC San Diego</a>`,
  // 6
  `PhD in Bioengineering, UC San Diego, <a href="http://systemsbiology.ucsd.edu" target="_blank">SBRG Lab</a>`,
  // 7
  `<a href="https://scholar.google.com/citations?user=ESLgsdUAAAAJ" target="_blank">30+ publications, 5000+ citations</a>`,
  // 8
  `BSE (Biomedical Eng) @ <a href="https://umich.edu" target="_blank">UMich</a> (2011)`,
  // 9
  `Primary dev of <a href="https://escher.github.io" target="_blank">Escher</a> & <a href="http://bigg.ucsd.edu" target="_blank">BiGG Models</a>`,
  // 10
  `Scrum (CSPO 2017) & <a href="https://www.amanet.org/5-day-mba-certificate-program/" target="_blank">AMA 5-Day MBA (2021)</a>`,
  // 11
  `Expert in Docker, Terraform, HPC, GraphQL, Observability (<a href="https://datadog.com" target="_blank">Datadog</a>)`,
  // 12
  `Focus on user-centered products, team autonomy & growth: <a href="https://www.delfina.com/resource/finding-your-users-in-digital-health" target="_blank">Learn more</a>`,
  // 13
  `Synthetic biology & metabolic engineering: <a href="https://doi.org/10.1016/j.copbio.2014.12.016" target="_blank">Research highlights</a>`,
  // 14
  `Expertise in compliance: <a href="https://www.delfina.com/security" target="_blank">SOC2 & HIPAA at Delfina</a>`,
  // 15
  // 16
  `<a href="https://www.nsfgrfp.org/" target="_blank">NSF GRFP</a> & <a href="https://jacobsschool.ucsd.edu/idea/admitted-undergraduates/jacobs-scholars" target="_blank">Jacobs Fellowship</a> recipient`,
  // 17
  // 18
  `I love coding: Dart, Python, Terraform, TS: <a href="https://github.com/zakandrewking" target="_blank">My GitHub</a>`,
  // 19
  `App on iOS: <a href="https://apps.apple.com/us/app/delfina-pregnancy-tracker/id6478985864" target="_blank">Delfina iOS link</a> | Android: <a href="https://play.google.com/store/apps/details?id=com.delfina.gaia" target="_blank">Delfina Android link</a>`,
  // 20
  `Driving maternal health crisis solutions w/ AI: <a href="https://delfina.com" target="_blank">Learn about mission</a>`,
  // 21
  `Strain engineering: <a href="https://www.biorxiv.org/content/10.1101/2023.01.03.521657v1" target="_blank">DARPA & 400+ production strains</a>`,
  // 22
  // 23
  // 24
  `Dissertation: <a href="https://escholarship.org/content/qt83d340c7/qt83d340c7.pdf" target="_blank">"Optimization of microbial cell factories..."</a>`,
  // 25
  `<a href="/resume.pdf" target="_blank">Resume PDF</a>`,
  `Last updated Feb 20, 2025`,
];

function getFactsForGridSize(gridSize: number) {
  const needed = gridSize * gridSize;
  return ALL_FACTS.slice(0, needed);
}

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

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PuzzleClient() {
  const gridSize = useGridSize();
  const resumeFacts = useMemo(() => getFactsForGridSize(gridSize), [gridSize]);
  const puzzleImages = useMemo(() => getPuzzleImages(gridSize), [gridSize]);
  const [tiles, setTiles] = useState<(number | null)[]>([]);
  const [containerSize, setContainerSize] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number; index: number } | null>(
    null
  );

  useEffect(() => {
    const total = puzzleImages.length;
    const arr: (number | null)[] = Array.from(
      { length: total - 1 },
      (_, i) => i
    );
    arr.push(null);
    shuffleArray(arr);
    setTiles(arr);
  }, [puzzleImages, gridSize]);

  useEffect(() => {
    function updateSize() {
      const maxWidth = window.innerWidth - 8;
      const maxHeight = window.innerHeight - 8;
      setContainerSize(Math.min(maxWidth, maxHeight));
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function getRowCol(idx: number) {
    return [Math.floor(idx / gridSize), idx % gridSize];
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
    setTiles((prev) => {
      const newTiles = [...prev];
      [newTiles[from], newTiles[to]] = [newTiles[to], newTiles[from]];
      return newTiles;
    });
  }

  function handleTileClick(idx: number) {
    const blankIndex = tiles.indexOf(null);
    if (isAdjacent(idx, blankIndex)) {
      moveTile(idx, blankIndex);
    }
  }

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, index };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchStart = touchStartRef.current;
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) < 10) {
      handleTileClick(touchStart.index);
      touchStartRef.current = null;
      return;
    }

    let direction: "left" | "right" | "up" | "down" | null = null;
    if (absDeltaX > absDeltaY) {
      direction = deltaX > 0 ? "right" : "left";
    } else {
      direction = deltaY > 0 ? "down" : "up";
    }

    const currentIndex = touchStart.index;
    const [row, col] = getRowCol(currentIndex);
    let adjacentIndex: number | null = null;

    switch (direction) {
      case "left":
        adjacentIndex = col > 0 ? currentIndex - 1 : null;
        break;
      case "right":
        adjacentIndex = col < gridSize - 1 ? currentIndex + 1 : null;
        break;
      case "up":
        adjacentIndex = row > 0 ? currentIndex - gridSize : null;
        break;
      case "down":
        adjacentIndex = row < gridSize - 1 ? currentIndex + gridSize : null;
        break;
    }

    if (adjacentIndex !== null && tiles[adjacentIndex] === null) {
      moveTile(currentIndex, adjacentIndex);
    }

    touchStartRef.current = null;
  };

  const tileSize = containerSize / gridSize;

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div
        className="relative mx-1 overflow-hidden"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* Bottom layer: NxN facts */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {resumeFacts.map((fact, i) => (
            <div
              key={i}
              className="relative flex items-center justify-center border overflow-hidden"
            >
              <div
                className="text-sm text-center [&_a]:cursor-pointer [&_a]:text-primary [&_a]:underline [&_a]:pointer-events-auto hover:[&_a]:opacity-70 px-1"
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
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {tiles.map((tile, index) => {
            if (tile === null) return null;

            const [row, col] = getRowCol(index);
            const x = col * tileSize;
            const y = row * tileSize;
            const blankIndex = tiles.indexOf(null);
            const canMove = isAdjacent(index, blankIndex);

            return (
              <div
                key={tile}
                className={clsx(
                  "absolute flex items-center justify-center border pointer-events-auto",
                  canMove
                    ? "cursor-pointer hover:opacity-90"
                    : "cursor-default",
                  "transition-transform duration-300 ease-in-out"
                )}
                style={{
                  width: tileSize,
                  height: tileSize,
                  transform: `translate(${x}px, ${y}px)`,
                }}
                onClick={() => canMove && handleTileClick(index)}
                onTouchStart={(e) => canMove && handleTouchStart(e, index)}
                onTouchEnd={(e) => canMove && handleTouchEnd(e)}
              >
                <Image
                  src={puzzleImages[tile]}
                  alt={`Tile ${tile}`}
                  fill
                  className="object-cover"
                />
              </div>
            );
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
