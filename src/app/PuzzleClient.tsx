"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Confetti from 'react-confetti';

import AccessibilityLinks from '@/components/accessibility-links';

import { getUserCity, sendPuzzleCompletionEmail } from '../util/supabase-util';

function useContainerSize() {
  const [containerSize, setContainerSize] = useState(0);
  useEffect(() => {
    function updateSize() {
      const maxWidth = window.innerWidth - 32;
      const maxHeight = window.innerHeight - 64;
      setContainerSize(Math.min(maxWidth, maxHeight));
    }
    updateSize();
  }, []);
  return containerSize;
}

function useGridSize() {
  const containerSize = useContainerSize();
  const [gridSize, setGridSize] = useState(0);
  useEffect(() => {
    function updateSize() {
      if (containerSize < 500) {
        setGridSize(3);
      } else if (containerSize < 650) {
        setGridSize(4);
      } else {
        setGridSize(5);
      }
    }
    updateSize();
  }, [containerSize]);
  return gridSize;
}

// --------------------------------------------------------------------------
// 1) A random "legal moves" scramble function
// --------------------------------------------------------------------------
function randomLegalScramble(gridSize: number, steps = 200): (number | null)[] {
  const total = gridSize * gridSize;

  // Start with a solved arrangement: 0..(total-2), null
  const puzzle: (number | null)[] = Array.from(
    { length: total - 1 },
    (_, i) => i
  );
  puzzle.push(null);

  // Helper to get row, col in 0-based from a puzzle index
  function rc(i: number) {
    return [Math.floor(i / gridSize), i % gridSize];
  }

  let blankIndex = puzzle.indexOf(null);

  // Make `steps` random moves
  for (let step = 0; step < steps; step++) {
    const [blankRow, blankCol] = rc(blankIndex);
    const neighbors: number[] = [];

    // up
    if (blankRow > 0) neighbors.push(blankIndex - gridSize);
    // down
    if (blankRow < gridSize - 1) neighbors.push(blankIndex + gridSize);
    // left
    if (blankCol > 0) neighbors.push(blankIndex - 1);
    // right
    if (blankCol < gridSize - 1) neighbors.push(blankIndex + 1);

    // pick a random neighbor
    const n = neighbors[Math.floor(Math.random() * neighbors.length)];

    // swap puzzle[n] and puzzle[blankIndex]
    [puzzle[n], puzzle[blankIndex]] = [puzzle[blankIndex], puzzle[n]];

    blankIndex = n;
  }

  return puzzle;
}

/** Helper to detect puzzle completion. */
function isPuzzleSolved(tiles: (number | null)[]) {
  // The solution is [0, 1, 2, ..., lastIndex-1, null]
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i) return false;
  }
  return tiles[tiles.length - 1] === null;
}

const ALL_FACTS = [
  // 1
  `I'm <b>Zak</b> - this is my website.`,
  // 2
  `Find me on <a href="https://www.linkedin.com/in/zakandrewking/" target="_blank">LinkedIn</a>`,
  // 3
  `VP Engineering @ <a href="https://www.delfina.com" target="_blank">Delfina</a> (2022–present): software for maternal health`,
  // 4
  `Asc. Director DevOps (2019–2022) @ <a href="https://www.amyris.com" target="_blank">Amyris</a>`,
  // 5
  `Project Scientist, Principal Investigator (2017–2019) @ <a href="https://ucsd.edu" target="_blank">UC San Diego</a>`,
  // 6
  `PhD in Bioengineering, UC San Diego, <a href="http://systemsbiology.ucsd.edu" target="_blank">SBRG Lab</a>`,
  // 7
  // 8
  `BSE (Biomedical Eng) @ <a href="https://umich.edu" target="_blank">UMich</a> (2011) - Go blue!`,
  `<a href="https://scholar.google.com/citations?user=ESLgsdUAAAAJ" target="_blank">30+ publications, 5000+ citations</a>`,
  `Favorite side project: <a href="https://brainshare.io" target="_blank">Brainshare</a> (code on <a href="https://github.com/zakandrewking/brainshare-golden-eagle" target="_blank">GitHub</a>)`,
  `Primary/early dev of <a href="https://escher.github.io" target="_blank">Escher</a> & <a href="http://bigg.ucsd.edu" target="_blank">BiGG Models</a>`,
  `Software skills: Python, Typescript, Dart, Flutter, React/TS, Terraform, D3.js, ...`,
  // 12
  `Focus on user-centered products, team autonomy & growth: <a href="https://www.delfina.com/resource/finding-your-users-in-digital-health" target="_blank">Learn more</a>`,
  // 13
  `Synthetic biology & metabolic engineering: <a href="https://doi.org/10.1016/j.copbio.2014.12.016" target="_blank">Research highlights</a>`,
  // 14
  `Expertise in compliance: <a href="https://www.delfina.com/security" target="_blank">SOC2 & HIPAA at Delfina</a>`,
  // 15
  `Scrum (CSPO 2017) & <a href="https://www.amanet.org/5-day-mba-certificate-program/" target="_blank">AMA 5-Day MBA (2021)</a>`,
  // 16
  `<a href="https://www.nsfgrfp.org/" target="_blank">NSF GRFP</a> & <a href="https://jacobsschool.ucsd.edu/idea/admitted-undergraduates/jacobs-scholars" target="_blank">Jacobs Fellowship</a> recipient`,
  // 17
  // 18
  `<a href="https://apps.apple.com/us/app/delfina-pregnancy-tracker/id6478985864" target="_blank">Delfina App on iOS</a> | <a href="https://play.google.com/store/apps/details?id=com.delfina.gaia" target="_blank">Delfina App on Android</a>`,
  // 20
  `Driving maternal health crisis solutions with AI: <a href="https://delfina.com" target="_blank">Learn about our mission</a>`,
  // 21
  `Strain engineering: <a href="https://www.biorxiv.org/content/10.1101/2023.01.03.521657v1" target="_blank">DARPA-funded project to develop microbial strains with an AI scientist</a>`,
  // 22
  // 23
  `Talented at recruiting amazing engineers & empowering them to do their best work`,
  // 24
  `Dissertation: <a href="https://escholarship.org/content/qt83d340c7/qt83d340c7.pdf" target="_blank">"Optimization of microbial cell factories..."</a>`,
  `Favorite AI: <a href="https://www.youtube.com/watch?v=syyXdBg9BIc" target="_blank">Ash in Alien</a>`,
  `<a href="/resume.pdf" target="_blank">Resume PDF</a>`,
  `Source code for this site on <a href="https://github.com/zakandrewking/brainsbrainsbrains.com" target="_blank">GitHub</a>`,
  `Last updated February 21, 2025`,
];

function getFactsForGridSize(gridSize: number) {
  return ALL_FACTS.slice(0, gridSize * gridSize);
}

function getPuzzleImages(gridSize: number) {
  const basePath = `/puzzle-${gridSize}x${gridSize}`;
  const paths: string[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col + 1;
      const y = row + 1;
      paths.push(`${basePath}/image${x}x${y}.jpeg`);
    }
  }
  return paths;
}

export default function PuzzleClient() {
  const gridSize = useGridSize();
  const containerSize = useContainerSize();

  const resumeFacts = useMemo(() => getFactsForGridSize(gridSize), [gridSize]);
  const puzzleImages = useMemo(() => getPuzzleImages(gridSize), [gridSize]);

  const [tiles, setTiles] = useState<(number | null)[]>([]);
  const [tileOffsets, setTileOffsets] = useState<{ x: number; y: number }[]>(
    []
  );
  const [isDraggingTile, setIsDraggingTile] = useState<boolean[]>([]);
  const [pointerDown, setPointerDown] = useState<{
    tileIndex: number;
    startX: number;
    startY: number;
    captured: boolean;
  } | null>(null);

  // "You win!" state
  const [isWon, setIsWon] = useState(false);
  const tileSize = containerSize / gridSize;

  // Add these new state variables near the other useState declarations
  const [moveCount, setMoveCount] = useState(0);
  const [easyMode, setEasyMode] = useState(false);
  const [showEasyModePrompt, setShowEasyModePrompt] = useState(false);

  // Timer related state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Email notification related state
  const [emailSent, setEmailSent] = useState(false);

  // Arrow key indicator state
  const [highlightedArrow, setHighlightedArrow] = useState<string | null>(null);

  // Throttle state for preventing rapid moves
  const [isMoveInProgress, setIsMoveInProgress] = useState(false);

  // Start the timer when the component loads or puzzle resets
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset timer state
    setStartTime(Date.now());
    setElapsedTime(0);
    setEmailSent(false);

    // Start new timer
    timerRef.current = setInterval(() => {
      if (startTime && !isWon) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [puzzleImages, gridSize]); // Same dependencies as the puzzle reset effect

  useEffect(() => {
    const arr = randomLegalScramble(gridSize, 200);
    setTiles(arr);
    setTileOffsets(arr.map(() => ({ x: 0, y: 0 })));
    setIsDraggingTile(arr.map(() => false));
    setIsWon(false);
    setMoveCount(0);
    setEasyMode(false);
    setShowEasyModePrompt(false);
    setIsMoveInProgress(false);
  }, [puzzleImages, gridSize]);

  // Send email notification when puzzle is solved
  const sendCompletionEmail = useCallback(async () => {
    try {
      const city = await getUserCity();
      await sendPuzzleCompletionEmail({
        gridSize,
        timeInSeconds: elapsedTime,
        city,
        moveCount,
      });
    } catch (error) {
      console.error("Failed to send completion email:", error);
    }
  }, [gridSize, elapsedTime, moveCount]);

  // Whenever tiles change, check if puzzle is solved
  useEffect(() => {
    if (!isWon && isPuzzleSolved(tiles)) {
      setIsWon(true);

      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Send the email notification
      if (!emailSent) {
        setEmailSent(true);
        sendCompletionEmail();
      }
    }
  }, [tiles, isWon, sendCompletionEmail]);

  // Format elapsed time for display
  const formatTime = () => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isWon || isMoveInProgress) return;

      const blankIndex = tiles.indexOf(null);
      if (blankIndex < 0) return;

      let targetTileIndex: number | null = null;
      let arrowKey: string | null = null;

      switch (e.key) {
        case "ArrowUp":
          // Move tile down into blank space (blank is above the tile)
          if (blankIndex + gridSize < tiles.length) {
            targetTileIndex = blankIndex + gridSize;
          }
          arrowKey = "ArrowUp";
          break;
        case "ArrowDown":
          // Move tile up into blank space (blank is below the tile)
          if (blankIndex - gridSize >= 0) {
            targetTileIndex = blankIndex - gridSize;
          }
          arrowKey = "ArrowDown";
          break;
        case "ArrowLeft":
          // Move tile right into blank space (blank is to the left of the tile)
          if (blankIndex % gridSize < gridSize - 1) {
            targetTileIndex = blankIndex + 1;
          }
          arrowKey = "ArrowLeft";
          break;
        case "ArrowRight":
          // Move tile left into blank space (blank is to the right of the tile)
          if (blankIndex % gridSize > 0) {
            targetTileIndex = blankIndex - 1;
          }
          arrowKey = "ArrowRight";
          break;
        default:
          return;
      }

      if (targetTileIndex !== null && isAdjacent(targetTileIndex, blankIndex)) {
        e.preventDefault();

        // Set move in progress
        setIsMoveInProgress(true);

        // Highlight the arrow key indicator
        if (arrowKey) {
          setHighlightedArrow(arrowKey);
          setTimeout(() => setHighlightedArrow(null), 150);
        }

        clickToSlide(targetTileIndex);

        // Clear move in progress after animation completes
        setTimeout(() => setIsMoveInProgress(false), 200);
      }
    };

    // Add event listener to document for global keyboard control
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [tiles, gridSize, isWon, isMoveInProgress]);

  // Handle arrow key indicator clicks
  const handleArrowClick = (direction: string) => {
    if (isWon || isMoveInProgress) return;

    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;

    let targetTileIndex: number | null = null;

    switch (direction) {
      case "ArrowUp":
        if (blankIndex + gridSize < tiles.length) {
          targetTileIndex = blankIndex + gridSize;
        }
        break;
      case "ArrowDown":
        if (blankIndex - gridSize >= 0) {
          targetTileIndex = blankIndex - gridSize;
        }
        break;
      case "ArrowLeft":
        if (blankIndex % gridSize < gridSize - 1) {
          targetTileIndex = blankIndex + 1;
        }
        break;
      case "ArrowRight":
        if (blankIndex % gridSize > 0) {
          targetTileIndex = blankIndex - 1;
        }
        break;
    }

    if (targetTileIndex !== null && isAdjacent(targetTileIndex, blankIndex)) {
      // Set move in progress
      setIsMoveInProgress(true);

      setHighlightedArrow(direction);
      setTimeout(() => setHighlightedArrow(null), 150);
      clickToSlide(targetTileIndex);

      // Clear move in progress after animation completes
      setTimeout(() => setIsMoveInProgress(false), 150);
    }
  };

  // Convert puzzle index => [row, col]
  function getRowCol(i: number) {
    return [Math.floor(i / gridSize), i % gridSize] as const;
  }

  // True if slots differ by exactly one row or col => adjacency.
  function isAdjacent(i: number, j: number) {
    const [r1, c1] = getRowCol(i);
    const [r2, c2] = getRowCol(j);
    return (
      (r1 === r2 && Math.abs(c1 - c2) === 1) ||
      (c1 === c2 && Math.abs(r1 - r2) === 1)
    );
  }

  // Swap puzzle slots i and j, also resetting offsets/drag states
  function swapTiles(i: number, j: number) {
    setTiles((prev) => {
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
    setTileOffsets((prev) => {
      const copy = [...prev];
      copy[i] = { x: 0, y: 0 };
      copy[j] = { x: 0, y: 0 };
      return copy;
    });
    setIsDraggingTile((prev) => {
      const copy = [...prev];
      copy[i] = false;
      copy[j] = false;
      return copy;
    });

    // Increment move count and check if we should show easy mode prompt
    setMoveCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 40) {
        setShowEasyModePrompt(true);
      }
      return newCount;
    });
  }

  // ------------------------------------------------------
  // Click-to-slide logic (for pointer movement < 5px)
  // ------------------------------------------------------
  function clickToSlide(tileIndex: number) {
    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;
    if (!isAdjacent(tileIndex, blankIndex)) return;

    const [tileRow, tileCol] = getRowCol(tileIndex);
    const [blankRow, blankCol] = getRowCol(blankIndex);

    const offsetX = (blankCol - tileCol) * tileSize;
    const offsetY = (blankRow - tileRow) * tileSize;

    // ensure tile has transition
    setIsDraggingTile((prev) => {
      const copy = [...prev];
      copy[tileIndex] = false;
      return copy;
    });

    // animate the tile
    setTileOffsets((prev) => {
      const copy = [...prev];
      copy[tileIndex] = { x: offsetX, y: offsetY };
      return copy;
    });

    // after 200ms (transition), swap
    setTimeout(() => {
      swapTiles(tileIndex, blankIndex);
    }, 200);
  }

  // ------------------------------------------------------
  // Drag logic
  // ------------------------------------------------------
  function handlePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    tileIndex: number
  ) {
    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;
    if (!isAdjacent(tileIndex, blankIndex)) return;

    setPointerDown({
      tileIndex,
      startX: e.clientX,
      startY: e.clientY,
      captured: false,
    });
  }

  function handlePointerMove(
    e: React.PointerEvent<HTMLDivElement>,
    tileIndex: number
  ) {
    if (!pointerDown) return;
    if (pointerDown.tileIndex !== tileIndex) return;

    const distX = e.clientX - pointerDown.startX;
    const distY = e.clientY - pointerDown.startY;
    const dist = Math.sqrt(distX * distX + distY * distY);

    // threshold for "real drag"
    if (!pointerDown.captured && dist > 5) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setPointerDown({ ...pointerDown, captured: true });
      setIsDraggingTile((prev) => {
        const copy = [...prev];
        copy[tileIndex] = true; // no transition
        return copy;
      });
    }

    if (!pointerDown.captured) {
      // haven't crossed threshold => do nothing
      return;
    }

    e.preventDefault();
    doDragUpdate(e, tileIndex);
  }

  function handlePointerUp(
    e: React.PointerEvent<HTMLDivElement>,
    tileIndex: number
  ) {
    if (!pointerDown) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    // If we never captured => treat as "click"
    if (!pointerDown.captured) {
      clickToSlide(tileIndex);
      setPointerDown(null);
      return;
    }

    // Otherwise finalize the drag
    finalizeDrag(tileIndex);
    setPointerDown(null);
  }

  function doDragUpdate(
    e: React.PointerEvent<HTMLDivElement>,
    tileIndex: number
  ) {
    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;

    const [tileRow, tileCol] = getRowCol(tileIndex);
    const [blankRow, blankCol] = getRowCol(blankIndex);

    let axis: "x" | "y";
    let direction: 1 | -1;
    if (tileRow === blankRow) {
      axis = "x";
      direction = blankCol > tileCol ? 1 : -1;
    } else {
      axis = "y";
      direction = blankRow > tileRow ? 1 : -1;
    }

    const baseX = tileCol * tileSize;
    const baseY = tileRow * tileSize;

    let newLeft = baseX + (e.clientX - (pointerDown?.startX ?? 0));
    let newTop = baseY + (e.clientY - (pointerDown?.startY ?? 0));

    // lock to axis
    if (axis === "x") {
      newTop = baseY;
    } else {
      newLeft = baseX;
    }

    // clamp so tile can't move beyond 1 tile distance
    if (axis === "x") {
      if (direction === 1) {
        newLeft = Math.max(newLeft, baseX);
        newLeft = Math.min(newLeft, baseX + tileSize);
      } else {
        newLeft = Math.min(newLeft, baseX);
        newLeft = Math.max(newLeft, baseX - tileSize);
      }
    } else {
      if (direction === 1) {
        newTop = Math.max(newTop, baseY);
        newTop = Math.min(newTop, baseY + tileSize);
      } else {
        newTop = Math.min(newTop, baseY);
        newTop = Math.max(newTop, baseY - tileSize);
      }
    }

    const offsetX = newLeft - baseX;
    const offsetY = newTop - baseY;

    setTileOffsets((prev) => {
      const copy = [...prev];
      copy[tileIndex] = { x: offsetX, y: offsetY };
      return copy;
    });
  }

  function finalizeDrag(tileIndex: number) {
    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;

    const [tileRow, tileCol] = getRowCol(tileIndex);
    const [blankRow, blankCol] = getRowCol(blankIndex);
    const axis = tileRow === blankRow ? "x" : "y";
    const dist = Math.abs(
      axis === "x" ? tileOffsets[tileIndex].x : tileOffsets[tileIndex].y
    );

    // if dist > some threshold => swap
    if (dist > tileSize / 4) {
      setIsDraggingTile((prev) => {
        const copy = [...prev];
        copy[tileIndex] = false;
        return copy;
      });
      swapTiles(tileIndex, blankIndex);
    } else {
      // revert
      setIsDraggingTile((prev) => {
        const copy = [...prev];
        copy[tileIndex] = false;
        return copy;
      });
      setTileOffsets((prev) => {
        const copy = [...prev];
        copy[tileIndex] = { x: 0, y: 0 };
        return copy;
      });
    }
  }

  // ------------------------------------------------------
  // Render puzzle
  // ------------------------------------------------------
  return (
    <div className="flex items-center justify-center relative p-4 md:p-8">
      <AccessibilityLinks />
      {isWon && (
        <>
          <Confetti
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }}
          />
          <h1 className="text-6xl text-white mb-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-stroke-3 text-stroke-black font-handwritten">
            OMG you solved it!
          </h1>
        </>
      )}

      {showEasyModePrompt && !isWon && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm mx-4">
            <h2 className="text-2xl mb-4">Need a hint?</h2>
            <p className="mb-4">
              Would you like to enable easy mode? This will show the tile
              numbers.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setEasyMode(true);
                  setShowEasyModePrompt(false);
                }}
              >
                Yes, please
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowEasyModePrompt(false)}
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="border-[2px] border-gray-100 box-border flex-none"
        style={{
          position: "relative",
          width: containerSize,
          height: containerSize,
        }}
      >
        {/* Bottom layer: NxN facts */}
        {resumeFacts.map((fact, i) => {
          if (fact === null) return null;
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          const baseX = col * tileSize;
          const baseY = row * tileSize;

          return (
            <div
              key={fact}
              className="absolute"
              style={{
                width: tileSize,
                height: tileSize,
                transform: `translate(${baseX}px, ${baseY}px)`,
              }}
            >
              <div className="text-sm text-center h-full overflow-hidden flex flex-col justify-center select-none [&_a]:cursor-pointer [&_a]:text-primary [&_a]:underline [&_a]:pointer-events-auto hover:[&_a]:opacity-70 px-1">
                <div
                  className="block"
                  dangerouslySetInnerHTML={{ __html: fact }}
                />
              </div>
            </div>
          );
        })}

        {/* Tiles (images) */}
        {tiles.map((tile, i) => {
          if (tile === null) return null; // Blank spot

          const [row, col] = [Math.floor(i / gridSize), i % gridSize];
          const baseX = col * tileSize - 2;
          const baseY = row * tileSize - 2;
          const off = tileOffsets[i] || { x: 0, y: 0 };
          const blankIndex = tiles.indexOf(null);
          const canMove = isAdjacent(i, blankIndex);

          const tileClasses = clsx(
            "absolute pointer-events-auto draggable border-[2px] border-gray-100 box-border",
            !isDraggingTile[i] &&
              "transition-transform duration-200 ease-in-out"
          );

          return (
            <div
              key={tile}
              className={clsx(
                tileClasses,
                isDraggingTile[i]
                  ? "cursor-grabbing"
                  : canMove
                  ? "cursor-grab"
                  : "cursor-default"
              )}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: "#fff",
                transform: `translate(${baseX + off.x}px, ${baseY + off.y}px)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, i)}
              onPointerMove={(e) => handlePointerMove(e, i)}
              onPointerUp={(e) => handlePointerUp(e, i)}
            >
              <Image
                src={puzzleImages[tile]}
                alt={`Tile ${tile}`}
                fill
                className="object-cover pointer-events-none"
              />
              {easyMode && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white bg-opacity-75 dark:bg-black dark:bg-opacity-75 px-2 py-1 rounded text-lg font-bold">
                    {tile + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrow key indicator - desktop only */}
      <div className="hidden md:block fixed bottom-6 left-6 z-10 opacity-60">
        <div className="flex flex-col items-center gap-1">
          {/* Top row - Up arrow */}
          <button
            onClick={() => handleArrowClick("ArrowUp")}
            className={clsx(
              "w-6 h-6 rounded border text-xs flex items-center justify-center transition-colors",
              highlightedArrow === "ArrowUp"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            ↑
          </button>

          {/* Bottom row - Left, Down, Right arrows */}
          <div className="flex gap-1">
            <button
              onClick={() => handleArrowClick("ArrowLeft")}
              className={clsx(
                "w-6 h-6 rounded border text-xs flex items-center justify-center transition-colors",
                highlightedArrow === "ArrowLeft"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              ←
            </button>

            <button
              onClick={() => handleArrowClick("ArrowDown")}
              className={clsx(
                "w-6 h-6 rounded border text-xs flex items-center justify-center transition-colors",
                highlightedArrow === "ArrowDown"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              ↓
            </button>

            <button
              onClick={() => handleArrowClick("ArrowRight")}
              className={clsx(
                "w-6 h-6 rounded border text-xs flex items-center justify-center transition-colors",
                highlightedArrow === "ArrowRight"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html {
          color-scheme: light dark;
          height: 100%;
          overscroll-behavior: none;
        }
        body {
          margin: 0;
          background-color: #fdfdfd;
          color: #333;
          padding: 0;
          min-height: 100%;
        }
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #111;
            color: #eee;
          }
        }
        .draggable {
          touch-action: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
