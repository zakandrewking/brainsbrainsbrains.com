"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';

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
  const tileSize = containerSize / gridSize;

  // tileOffsets[i] => { x, y } offset in px for partial drag or animation
  const [tileOffsets, setTileOffsets] = useState<{ x: number; y: number }[]>(
    []
  );

  // For turning off transitions during drag
  // isDraggingTile[i] = true => the tile has no transition (immediate movement)
  const [isDraggingTile, setIsDraggingTile] = useState<boolean[]>([]);

  /**
   * We store pointerDown info to decide whether the user is "clicking" or "dragging".
   * If they move > 5px, we treat it as a drag and set pointerCapture.
   */
  const [pointerDown, setPointerDown] = useState<{
    tileIndex: number;
    startX: number;
    startY: number;
    captured: boolean; // did we exceed threshold & start a real drag?
  } | null>(null);

  useEffect(() => {
    const total = puzzleImages.length;
    const arr: (number | null)[] = Array.from(
      { length: total - 1 },
      (_, i) => i
    );
    arr.push(null);
    shuffleArray(arr);
    setTiles(arr);
    setTileOffsets(arr.map(() => ({ x: 0, y: 0 })));
    setIsDraggingTile(arr.map(() => false));
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

  /** Convert puzzle index => [row, col] */
  function getRowCol(i: number) {
    return [Math.floor(i / gridSize), i % gridSize];
  }

  /** True if slots differ by exactly one row or column => adjacency. */
  function isAdjacent(i: number, j: number) {
    const [r1, c1] = getRowCol(i);
    const [r2, c2] = getRowCol(j);
    return (
      (r1 === r2 && Math.abs(c1 - c2) === 1) ||
      (c1 === c2 && Math.abs(r1 - r2) === 1)
    );
  }

  /** Swap puzzle slots i and j, also resetting offsets/drag states. */
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
  }

  // ------------------------------------------------------
  // Click-to-slide logic (used if pointer movement < 5px)
  // ------------------------------------------------------
  function clickToSlide(tileIndex: number) {
    // Must be adjacent to blank
    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;
    if (!isAdjacent(tileIndex, blankIndex)) return;

    // figure out how far we must move
    const [tileRow, tileCol] = getRowCol(tileIndex);
    const [blankRow, blankCol] = getRowCol(blankIndex);

    const offsetX = (blankCol - tileCol) * tileSize;
    const offsetY = (blankRow - tileRow) * tileSize;

    // ensure tile has transition enabled
    setIsDraggingTile((prev) => {
      const copy = [...prev];
      copy[tileIndex] = false; // so it animates
      return copy;
    });

    // animate the tile
    setTileOffsets((prev) => {
      const copy = [...prev];
      copy[tileIndex] = { x: offsetX, y: offsetY };
      return copy;
    });

    // after 200ms (the transition duration), swap
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
    // check adjacency
    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;
    if (!isAdjacent(tileIndex, blankIndex)) return;

    // store pointerDown, but do NOT setPointerCapture yet
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
    // if the user is dragging a different tile than pointerDown, ignore
    if (pointerDown.tileIndex !== tileIndex) return;

    const distX = e.clientX - pointerDown.startX;
    const distY = e.clientY - pointerDown.startY;
    const dist = Math.sqrt(distX * distX + distY * distY);

    // threshold for switching to "real drag"
    if (!pointerDown.captured && dist > 5) {
      // now we do a real drag
      e.currentTarget.setPointerCapture(e.pointerId);
      setPointerDown({ ...pointerDown, captured: true });

      // remove transition from this tile
      setIsDraggingTile((prev) => {
        const copy = [...prev];
        copy[tileIndex] = true; // "true" => no transition
        return copy;
      });
    }

    if (!pointerDown.captured) {
      // haven't crossed threshold => do nothing
      return;
    }

    // We are actively dragging => move tile 1:1 with pointer
    e.preventDefault();
    doDragUpdate(e, tileIndex);
  }

  function handlePointerUp(
    e: React.PointerEvent<HTMLDivElement>,
    tileIndex: number
  ) {
    if (!pointerDown) return;

    // release capture if we set it
    e.currentTarget.releasePointerCapture(e.pointerId);

    // If we never captured => treat as a "click"
    if (!pointerDown.captured) {
      // The tile didn't move => we do the clickToSlide approach
      clickToSlide(tileIndex);
      setPointerDown(null);
      return;
    }

    // Otherwise finalize the drag
    finalizeDrag(tileIndex);
    setPointerDown(null);
  }

  /** Actually move the tile in response to pointer. */
  function doDragUpdate(
    e: React.PointerEvent<HTMLDivElement>,
    tileIndex: number
  ) {
    // find blank
    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;

    // figure out row/col
    const [tileRow, tileCol] = getRowCol(tileIndex);
    const [blankRow, blankCol] = getRowCol(blankIndex);

    // which axis
    let axis: "x" | "y";
    let direction: 1 | -1;
    if (tileRow === blankRow) {
      axis = "x";
      direction = blankCol > tileCol ? 1 : -1;
    } else {
      axis = "y";
      direction = blankRow > tileRow ? 1 : -1;
    }

    // base (no offset) position
    const baseX = tileCol * tileSize;
    const baseY = tileRow * tileSize;

    // For simplicity, we don’t factor “offsetWithinTile,” but you could if needed
    let newLeft = baseX + (e.clientX - (pointerDown?.startX ?? 0));
    let newTop = baseY + (e.clientY - (pointerDown?.startY ?? 0));

    // lock to axis
    if (axis === "x") {
      newTop = baseY;
    } else {
      newLeft = baseX;
    }

    // clamp so tile can’t move beyond 1 tile distance
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

  /** On pointerUp after a real drag, decide if we swap or revert. */
  function finalizeDrag(tileIndex: number) {
    // measure how far the tile moved along the relevant axis
    const blankIndex = tiles.indexOf(null);
    if (blankIndex < 0) return;

    // determine axis again
    const [tileRow, tileCol] = getRowCol(tileIndex);
    const [blankRow, blankCol] = getRowCol(blankIndex);
    const axis = tileRow === blankRow ? "x" : "y";

    const dist = Math.abs(
      axis === "x" ? tileOffsets[tileIndex].x : tileOffsets[tileIndex].y
    );

    // if dist > half tile => swap
    if (dist > tileSize / 2) {
      // re-enable transition for final snap
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
        copy[tileIndex] = false; // so we see a short revert snap
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
    <div style={{ width: 400, margin: "20px auto" }}>
      <div
        style={{
          position: "relative",
          width: gridSize * tileSize,
          height: gridSize * tileSize,
          border: "1px solid #999",
        }}
      >
        {tiles.map((tile, i) => {
          if (tile === null) {
            // blank space
            return null;
          }

          const [row, col] = getRowCol(i);
          const baseX = col * tileSize;
          const baseY = row * tileSize;
          const off = tileOffsets[i];

          // If isDraggingTile[i] => no transition
          // else transition 200ms => for click or final snap
          const tileClasses = clsx(
            "absolute pointer-events-auto draggable",
            !isDraggingTile[i] &&
              "transition-transform duration-200 ease-in-out"
          );

          return (
            <div
              key={tile}
              className={tileClasses}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: "#fff",
                border: "1px solid #444",
                boxSizing: "border-box",
                transform: `translate(${baseX + off.x}px, ${baseY + off.y}px)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, i)}
              onPointerMove={(e) => handlePointerMove(e, i)}
              onPointerUp={(e) => handlePointerUp(e, i)}
            >
              <div style={{ lineHeight: tileSize + "px", textAlign: "center" }}>
                Tile {tile}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .draggable {
          touch-action: none; /* prevent scrolling on mobile */
          user-select: none; /* prevent text highlighting */
        }
      `}</style>
    </div>
  );
}
