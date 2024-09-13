"use client";

import { ReactNode, useContext, useEffect, useRef } from "react";
import rough from "roughjs";

import { PaperStoreContext } from "@/stores/paper-store";

export function RoughCard({
  height,
  width,
  generatorKey,
  children,
}: {
  height: number;
  width: number;
  generatorKey: string;
  children: ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const { state, dispatch } = useContext(PaperStoreContext);

  const drawRect = (el: SVGSVGElement) => {
    if (state.generators[generatorKey]) {
      const rc = rough.svg(el);
      const rect = state.generators[generatorKey];
      const node = rc.draw(rect);
      el.appendChild(node);
    } else {
      const rc = rough.svg(el);
      const generator = rc.generator;
      const rect = generator.rectangle(5, 5, width - 10, height - 10, {
        roughness: 1.5,
        strokeWidth: 1.5,
        bowing: 1.2,
        stroke: "hsl(var(--card-foreground))",
      });
      dispatch({
        type: "update_generator",
        generatorKey,
        generator: rect,
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
  }, [ref]);

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
