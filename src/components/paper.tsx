import "./paper.css";

export default function Paper({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full rounded-lg shadow-lg relative overflow-hidden">
      <div className="paper"></div>

      <div className="relative p-6">{children}</div>

      <svg className="w-0 h-0">
        <filter id="roughpaper">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            result="noise"
            numOctaves="5"
          />
          <feDiffuseLighting in="noise" lighting-color="#fff" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>
      </svg>

      <svg className="w-0 h-0">
        <filter id="roughpaper-dark">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06"
            result="noise"
            numOctaves="4"
          />
          <feDiffuseLighting in="noise" lighting-color="#444" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="50" />
          </feDiffuseLighting>
        </filter>
      </svg>
    </div>
  );
}
