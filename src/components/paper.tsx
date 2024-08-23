import Link from "next/link";
import { DragEvent, MouseEvent } from "react";
import "./paper.css";

export default function Paper({
  height,
  children,
  scrollUrl,
  handleRoll,
}: {
  height: string;
  children?: React.ReactNode;
  scrollUrl: string;
  handleRoll: ({
    height,
    event,
  }: {
    height?: string;
    event?: MouseEvent<HTMLAnchorElement>;
  }) => void;
}) {
  const handleDrag = (e: DragEvent<HTMLAnchorElement>) => {
    // handleRoll({height});
  };

  return (
    <div
      className="w-full relative transition-all duration-500 ease-in-out overflow-hidden rounded-t-lg"
      style={{ height }}
    >
      <div className="shadow-md w-[calc(100%+2px)] left-[-1px] h-[calc(100%+2px)] top-[-1px] absolute rounded-lg"></div>

      <div
        className="w-[calc(100%+4px)] left-[-2px] h-[calc(100%+4px)] top-[-2px] absolute border-[#eeeae4] dark:border-[#3d3d3d] border-8 rounded-lg"
        style={{ filter: "url(#rough-paper-outline)" }}
      ></div>

      <div className="w-full h-[calc(100%-24px)] absolute overflow-hidden">
        <div className="paper-filter w-full h-full top-0 left-0"></div>
      </div>

      <div
        className="w-full relative p-6 pb-2 rounded-lg overflow-hidden"
        style={{ filter: "url(#pencil-texture)", height: "calc(100% + 2rem)" }}
      >
        {children}
      </div>

      {/* filter under scroll */}
      <div className="w-full h-8 top-[calc(100%-24px)] absolute overflow-hidden">
        <div className="paper-filter w-full h-full top-0 left-0"></div>
      </div>

      {/* scroll cylinder effect */}
      <Link
        href={scrollUrl}
        onClick={(event) => handleRoll({ event })}
        onDrag={handleDrag}
      >
        <div className="h-6 scroll cursor-ns-resize"></div>
      </Link>

      <svg className="w-0 h-0">
        <filter
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          id="rough-paper-outline"
        >
          <feComposite
            operator="in"
            in="SourceGraphic"
            result="SourceTextured"
          ></feComposite>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            seed="1"
            result="f1"
          ></feTurbulence>
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="2"
            in="SourceTextured"
            in2="f1"
            result="f4"
          ></feDisplacementMap>
        </filter>
      </svg>

      <svg className="w-0 h-0">
        <filter id="rough-paper">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.12"
            result="noise"
            numOctaves="4"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#f9f5f0"
            surfaceScale="2"
          >
            <feDistantLight azimuth="90" elevation="65" />
          </feDiffuseLighting>
        </filter>
      </svg>

      <svg className="w-0 h-0">
        <filter id="rough-paper-dark">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06"
            result="noise"
            numOctaves="4"
          />
          <feDiffuseLighting in="noise" lightingColor="#666" surfaceScale="1">
            <feDistantLight azimuth="45" elevation="20" />
          </feDiffuseLighting>
        </filter>
      </svg>

      <svg id="svg" width="0" height="0" viewBox="-500 -500 1000 1000">
        <defs>
          <filter
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
            id="pencil-texture"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2"
              numOctaves="4"
              stitchTiles="stitch"
              result="t1"
            ></feTurbulence>
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5"
              result="t2"
            ></feColorMatrix>
            <feComposite
              operator="in"
              in2="t2"
              in="SourceGraphic"
              result="SourceTextured"
            ></feComposite>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="3"
              seed="1"
              result="f1"
            ></feTurbulence>
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="4"
              in="SourceTextured"
              in2="f1"
              result="f4"
            ></feDisplacementMap>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.4"
              numOctaves="4"
              seed="100"
              result="f3"
            ></feTurbulence>
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="2"
              in="SourceTextured"
              in2="f3"
              result="f6"
            ></feDisplacementMap>
            <feBlend mode="multiply" in="f4" in2="f6" result="out2"></feBlend>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
