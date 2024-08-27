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
      const rect = state.generators[generatorKey][size];
      const node = rc.draw(rect);
      el.appendChild(node);
    } else {
      const rc = rough.svg(el);
      const generator = rc.generator;
      let rect = generator.rectangle(5, 5, 20, 20, {
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

  return <svg ref={ref} width="100" height="100"></svg>;
}
