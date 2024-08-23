"use client";

import { useEffect, useState } from "react";

export default function useWindowDimensions(
  handleResize?: ({
    width,
    height,
  }: {
    width: number | null;
    height: number | null;
  }) => void
) {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  function handleResizeInternal() {
    const newWindowDimensions = getWindowDimensions();
    setWindowDimensions(newWindowDimensions);
    handleResize && handleResize(newWindowDimensions);
  }

  useEffect(() => {
    if (hasWindow) {
      window.addEventListener("resize", handleResizeInternal);
      return () => window.removeEventListener("resize", handleResizeInternal);
    }
  }, [hasWindow]);

  return windowDimensions;
}
