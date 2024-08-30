"use client";

import { ReactNode, useEffect } from "react";

import { init as amplitudeInit } from "@amplitude/analytics-browser";

export default function AmplitudeConfig({ children }: { children: ReactNode }) {
  useEffect(() => {
    amplitudeInit("fa7fe1da2097c2ef1bab973587d6bbab", { autocapture: true });
  }, []);
  return children;
}
