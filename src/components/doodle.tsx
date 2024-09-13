import { useContext, useEffect, useRef } from "react";
import rough from "roughjs";

import { PaperStoreContext } from "@/stores/paper-store";

{
  /* <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
  <polygon
    points="20,80 50,30 80,80"
    className="pencil"
    style={{ strokeWidth: 0.3 }}
  />
  <circle cx="50" cy="30" r="30" className="pencil" />
  <circle cx="50" cy="30" r="19" className="pencil" />
  <circle cx="50" cy="30" r="10" className="pencil" />
  <circle cx="50" cy="30" r="5" className="pencil" />
  <path
    d="M 20 80 Q 50 90 80 80"
    className="pencil"
    style={{ strokeWidth: 0.3 }}
  ></path>
</svg> */
}

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
        roughness: 0.2,
        strokeWidth: 0.15,
        bowing: 15,
        stroke: "hsl(var(--card-foreground))",
      };
      const fillOpts = {
        ...opts,
        fill: "hsl(var(--card-foreground))",
        hachureAngle: -60,
        hachureGap: 4,
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
        generator.circle(50, 30, 60, fillOpts),
        generator.circle(50, 30, 38, opts),
        generator.circle(50, 30, 20, opts),
        generator.circle(50, 30, 10, opts),
        generator.path("M 20 80 Q 50 90 80 80", fillOpts),
      ];
      dispatch({
        type: "update_generator",
        generatorKey,
        generator: shapes,
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
