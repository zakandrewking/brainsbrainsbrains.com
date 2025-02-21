"use client";

import { useEffect, useState } from 'react';

import clsx from 'clsx';

export default function PuzzleClickOrDrag() {
  /** Puzzle layout: 3x3 => 9 slots, with 8 tiles + 1 blank */
  const gridSize = 3;
  const tileSize = 100; // px for each tile

  // puzzle arrangement: slot i => tile index or null for blank
  // for a 3x3, we'll have 9 slots. Indices 0..7 for tiles, slot 8 = null
  const [tiles, setTiles] = useState<(number | null)[]>([]);
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
    // Initialize a simple puzzle: tiles = 0..7 plus null
    const arr: (number | null)[] = [0, 1, 2, 3, 4, 5, 6, 7, null];
    setTiles(arr);
    setTileOffsets(arr.map(() => ({ x: 0, y: 0 })));
    setIsDraggingTile(arr.map(() => false));
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
      <h3>Sliding Puzzle (click or drag)</h3>
      <p>
        - If you barely move the mouse (&lt; 5px), it counts as a click → tile
        slides with animation.
        <br />- If you drag &gt; 5px, you get real-time movement, then snap on
        release.
      </p>
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
