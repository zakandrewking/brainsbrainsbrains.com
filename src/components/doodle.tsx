import { use, useContext, useEffect, useRef } from "react";
import rough from "roughjs";

import { PaperStoreContext } from "@/stores/paper-store";

export default function Doodle() {
  const ref = useRef<SVGSVGElement>(null);
  const { state, dispatch } = useContext(PaperStoreContext);
  const generatorKey = "doodle";
  const size = "sm";

  const drawRect = (el: SVGSVGElement) => {
    if (state.generators[generatorKey]?.[size]) {
      const rc = rough.svg(el);
      const shapes = state.generators[generatorKey][size];
      for (const shape of shapes) {
        const node = rc.draw(shape);
        el.appendChild(node);
      }
    } else {
      const rc = rough.svg(el);
      const generator = rc.generator;
      const opts = {
        roughness: 0.6,
        strokeWidth: 0.15,
        bowing: 1,
        stroke: "hsl(var(--card-foreground))",
      };
      const shapes = [
        generator.polygon(
          [
            [20, 80],
            [50, 30],
            [80, 80],
          ],
          opts
        ),
        generator.circle(50, 30, 60, opts),
        generator.circle(50, 30, 38, opts),
        generator.circle(50, 30, 20, opts),
        generator.circle(50, 30, 10, opts),
        generator.path("M 20 80 Q 50 90 80 80", opts),
      ];
      dispatch({
        generators: {
          ...state.generators,
          [generatorKey]: {
            ...state.generators[generatorKey],
            [size]: shapes,
          },
        },
      });
      for (const shape of shapes) {
        const node = rc.draw(shape);
        el.appendChild(node);
      }
    }
  };

  const removeRect = (el: SVGSVGElement) => {
    if (!el.firstChild) return;
    // remove all children
    for (let i = el.children.length - 1; i >= 0; i--) {
      el.removeChild(el.children[i]);
    }
  };

  useEffect(() => {
    if (!ref.current) return;
    drawRect(ref.current);
    return () => {
      if (!ref.current) return;
      removeRect(ref.current);
    };
  }, [ref, size]);

  return <svg ref={ref} width="100" height="100"></svg>;
}
