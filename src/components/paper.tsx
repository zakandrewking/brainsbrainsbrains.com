import "./paper.css";

import Ink from "./ink";

export default function Paper({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full relative">
      <div className="shadow-md w-[101%] left-[-0.5%] h-[101%] top-[-0.5%] absolute rounded-sm"></div>

      <div
        className="w-[101%] left-[-0.5%] h-[101%] top-[-0.5%] absolute border-[#f3f3f3] dark:border-[#3d3d3d] border-8 rounded-sm"
        style={{ filter: "url(#rough-paper-outline)" }}
      ></div>
      <div className="w-full h-full absolute bg-gray-100 overflow-hidden">
        <div className="paper-filter w-full h-full top-0 left-0"></div>
      </div>

      <div
        className="w-full h-full relative p-6"
        style={{ filter: "url(#pencil-texture-5)" }}
      >
        {children}
      </div>
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
            baseFrequency="0.06"
            result="noise"
            numOctaves="4"
          />
          <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
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
      <Ink />
    </div>
  );
}
