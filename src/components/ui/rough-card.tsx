"use client";

import { ReactNode, useContext, useEffect, useRef } from "react";
import rough from "roughjs";

import useIsSSR from "@/hooks/useIsSSR";
import { PaperStoreContext } from "@/stores/paper-store";

import { Card } from "./card";

export function MaybeRoughCard({
  height,
  width,
  size,
  generatorKey,
  children,
}: {
  height: number;
  width: number;
  size: "sm" | "md";
  generatorKey: string;
  children: ReactNode;
}) {
  const isSSR = useIsSSR();
  return isSSR ? (
    <Card>{children}</Card>
  ) : (
    <RoughCard
      height={height}
      width={width}
      size={size}
      generatorKey={generatorKey}
    >
      {children}
    </RoughCard>
  );
}

export function RoughCard({
  height,
  width,
  size,
  generatorKey,
  children,
}: {
  height: number;
  width: number;
  size: "sm" | "md";
  generatorKey: string;
  children: ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const { state, dispatch } = useContext(PaperStoreContext);

  const drawRect = (el: SVGSVGElement) => {
    if (state.generators[generatorKey]?.[size]) {
      const rc = rough.svg(el);
      const rect = state.generators[generatorKey][size];
      const node = rc.draw(rect);
      el.appendChild(node);
    } else {
      const rc = rough.svg(el);
      const generator = rc.generator;
      let rect = generator.rectangle(5, 5, width - 10, height - 10, {
        roughness: 1.5,
        strokeWidth: 1.5,
        bowing: 1.2,
        stroke: "hsl(var(--card-foreground))",
      });
      dispatch({
        generators: {
          ...state.generators,
          [generatorKey]: {
            ...state.generators[generatorKey],
            [size]: rect,
          },
        },
      });
      const node = rc.draw(rect);
      el.appendChild(node);
    }
  };

  const removeRect = (el: SVGSVGElement) => {
    if (!el.firstChild) return;
    el.removeChild(el.firstChild);
  };

  useEffect(() => {
    if (!ref.current) return;
    drawRect(ref.current);
    return () => {
      if (!ref.current) return;
      removeRect(ref.current);
    };
  }, [ref, size]);

  return (
    <div className="text-card-foreground relative">
      <svg
        ref={ref}
        className="w-full h-full absolute top-0 left-0 pointer-events-none"
      />
      {children}
    </div>
  );
}