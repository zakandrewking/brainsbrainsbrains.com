"use client";

import "./paper.css";
import { Caveat as Handwritten } from "next/font/google";
import { drag as d3Drag } from "d3-drag";
import { select as d3Select } from "d3-selection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { cn } from "@/lib/utils";
import { PaperStoreContext } from "@/stores/paper-store";
import { getUnrolledHeight, rolledHeight, roughSizes } from "@/util/paper-util";

import { Button } from "./ui/button";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { MaybeRoughCard } from "./ui/rough-card";

const handwritten = Handwritten({
  subsets: ["latin"],
  display: "swap",
  fallback: ["sans-serif"],
});

export default function PaperHeader({ isRolledUp }: { isRolledUp: boolean }) {
  const { state, dispatch } = useContext(PaperStoreContext);
  const dragRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const isDarkQuery = useMediaQuery("(prefers-color-scheme: dark)");

  const rollUrl = isRolledUp ? "/about-me" : "/";
  const rollText = isRolledUp ? "About Me" : "Home";

  const handleRoll = async () => {
    router.push(rollUrl, { scroll: false });
  };

  const handleResize = ({ width }: { width: number | null }) => {
    if (isRolledUp) return;
    const unrolledHeight = getUnrolledHeight(width || 0);
    dispatch({ height: `${unrolledHeight}px` });
  };

  const { width: screenWidth } = useWindowDimensions(handleResize);
  const getServerHeight = () => {
    return isRolledUp ? `${rolledHeight}px` : `${getUnrolledHeight(0)}px`;
  };
  const getHeight = () => {
    return isRolledUp
      ? `${rolledHeight}px`
      : `${getUnrolledHeight(screenWidth || 0)}px`;
  };

  useEffect(() => {
    dispatch({ height: getHeight() });
  }, []);

  useEffect(() => {
    // default to false to match the server, and then set here
    setIsDark(isDarkQuery);
  }, [isDarkQuery]);

  const height = state.height ?? getServerHeight();
  const generatorSize = screenWidth && screenWidth < 768 ? "sm" : "md";

  useEffect(() => {
    if (!dragRef.current) return;
    const selection = d3Select(dragRef.current);
    const getDraggedHeight = (dy: number) => {
      return `${Math.max(
        parseInt(heightRef.current?.style.height ?? "0") + dy,
        40
      )}px`;
    };
    const drag: any = d3Drag()
      .on("start", () => {
        dispatch({ shouldTransition: false });
      })
      .on("drag", (event) => {
        if (!heightRef.current) return;
        const newHeight = getDraggedHeight(event.dy);
        d3Select(heightRef.current).style("height", newHeight);
      })
      .on("end", () => {
        dispatch({
          shouldTransition: true,
          height: getDraggedHeight(0),
        });
        handleRoll();
      });
    selection.call(drag);
    return () => {
      selection.on(".drag", null);
    };
  }, [dragRef]);

  return (
    <header
      className={cn(
        "relative pb-6 w-[350px] md:w-[750px] handwritten",
        handwritten.className,
        state.shouldTransition
          ? "transition-[height] duration-500 ease-in-out"
          : ""
      )}
      style={{ height }}
      ref={heightRef}
    >
      {/* <div
        className="p-8"
        style={{ filter: "url(#pencil-texture)", fontSize: "37px" }}
      >
        😁 🙂 🙃 📱 📍 ❤️ 🌞 🫥 🤓 🥸 👨🏻‍💻
      </div> */}
      {/* <div
        className="p-8"
        style={{
          filter: "url(#pencil-texture)",
          fontSize: "45px",
          color: "hsl(var(--primary))",
        }}
      >
        ☺ ←
      </div>
 */}
      <div className="w-full h-full overflow-hidden">
        <div className="w-full h-[calc(100%-24px)] absolute overflow-hidden rounded-t-md shadow-xl">
          <div className="paper-filter w-full h-full top-0 left-0"></div>
        </div>

        <div className="relative w-full p-1 pt-2 md:pt-0 overflow-hidden">
          <div className="md:px-4 md:pt-4">
            <Button variant="paperLink" asChild size="lg">
              <Link
                href={rollUrl}
                onClick={(event) => {
                  event.preventDefault();
                  handleRoll();
                }}
              >
                {rollUrl === "/about-me" ? (
                  <img
                    src={isDark ? "/smile-dark.png" : "smile-light.png"}
                    alt="Smile"
                    className="h-6 pr-1"
                  />
                ) : (
                  <img
                    src={isDark ? "/arrow-dark.png" : "arrow-light.png"}
                    alt="Arrow back"
                    className="h-6 pr-1"
                  />
                )}
                {rollText}
              </Link>
            </Button>

            <div className="flex flex-col gap-6 items-center pt-2 md:pt-0">
              <div className="flex flex-col gap-2 items-center mb-8">
                <div className="text-xl">The personal website of</div>
                <span className="font-bold text-4xl">Zak King</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center px-4">
            <MaybeRoughCard
              height={roughSizes.img[generatorSize].height}
              width={roughSizes.img[generatorSize].width}
              size={generatorSize}
              generatorKey="img"
            >
              <img
                src="/zak.jpeg"
                alt="Pic of Zak"
                className="rounded-sm h-40 m-1 shadow-md"
              />
            </MaybeRoughCard>
            <div className="flex flex-col gap-2">
              <span className="text-xl">Find me here:</span>
              <MaybeRoughCard
                height={roughSizes.links[generatorSize].height}
                width={roughSizes.links[generatorSize].width}
                size={generatorSize}
                generatorKey="bioGenerator"
              >
                <div className="flex flex-row flex-wrap gap-3 m-3 justify-center text-xl">
                  <Button variant="paperLink" asChild>
                    <Link href="https://github.com/zakandrewking">GitHub</Link>
                  </Button>
                  <Button variant="paperLink" asChild>
                    <Link href="https://twitter.com/brainsbrainsbr">
                      Twitter
                    </Link>
                  </Button>
                  <Button variant="paperLink" asChild>
                    <Link href="https://www.linkedin.com/in/zakandrewking/">
                      LinkedIn
                    </Link>
                  </Button>
                  <Button variant="paperLink" asChild>
                    <Link href="mailto:zaking17@gmail.com">Email</Link>
                  </Button>
                </div>
              </MaybeRoughCard>
            </div>
            <MaybeRoughCard
              height={roughSizes.bio[generatorSize].height}
              width={roughSizes.bio[generatorSize].width}
              size={generatorSize}
              generatorKey="linkGenerator"
            >
              <CardHeader>
                <CardTitle className="no-underline">About me</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <p
                  style={{
                    transform:
                      "rotate(-0.6deg) translate(0.2rem, -0.3rem) skewX(-2deg)",
                  }}
                >
                  <span className="mr-2 text-2xl">📱</span> I am VP of
                  Engineering at{" "}
                  <Link href="https://delfina.com" className="fg-primary">
                    Delfina
                  </Link>
                  . Previously I led DevOps at{" "}
                  <Link href="https://www.amyris.com">Amyris</Link>, and before
                  that you might have found me{" "}
                  <Link href="https://scholar.google.com/citations?user=ESLgsdUAAAAJ&hl=en">
                    modeling microorganisms
                  </Link>{" "}
                  at UC San Diego or haunting{" "}
                  <Link href="https://www.google.com/maps/@42.2783983,-83.7414089,3a,25.4y,88.35h,92.52t/data=!3m8!1e1!3m6!1sAF1QipPP8EKHRsoQYKOEzgkySqXr3YwlnjYMGCXC1nAX!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPP8EKHRsoQYKOEzgkySqXr3YwlnjYMGCXC1nAX%3Dw203-h100-k-no-pi-0-ya315.63397-ro-0-fo100!7i8704!8i4352?entry=ttu">
                    Comet Coffee
                  </Link>{" "}
                  between classes at UofM (Go Blue!).
                </p>

                <p
                  style={{
                    transform:
                      "rotate(-0.2deg) translate(0.6rem, -0.3rem) skewX(-3deg)",
                  }}
                >
                  <span className="mr-2 text-2xl">❤️</span> Occasional fan of
                  skeuomorphism; real fan of{" "}
                  <Link href="https://supabase.com/">Supabase</Link> and Dan
                  Dennett's{" "}
                  <Link href="https://en.wikipedia.org/wiki/Consciousness_Explained">
                    "Consciousness Explained"
                  </Link>
                  . Check out{" "}
                  <Link href="https://www.youtube.com/@veritasium">
                    Veritasium
                  </Link>{" "}
                  too for some of the best science content on the Internet.
                </p>

                <p
                  style={{
                    transform:
                      "rotate(-0.5deg) translate(0.5rem, -0.3rem) skewX(-2deg)",
                  }}
                >
                  <span className="mr-2 text-2xl">📍</span> I live in San Diego
                  with my wife Gaby and two kids Elise (8) and Julian (5).
                </p>
              </CardContent>
            </MaybeRoughCard>
            <div className="mt-2">
              <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
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
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* filter under scroll */}
      <div className="w-full h-6 top-[calc(100%-24px)] absolute overflow-hidden">
        <div className="paper-filter w-full h-full top-0 left-0"></div>
      </div>

      <div className="absolute scroll w-full bottom-0 left-0 h-6" ref={dragRef}>
        <Link
          href={rollUrl}
          className="w-full h-full block cursor-ns-resize"
          onClick={(event) => {
            // click is handled by drag-end
            event.preventDefault();
          }}
        />
      </div>

      <svg className="w-0 h-0">
        <filter id="rough-paper">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.12"
            result="noise"
            numOctaves="3"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#f9f5f0"
            surfaceScale="2"
          >
            <feDistantLight azimuth="90" elevation="75" />
          </feDiffuseLighting>
        </filter>
      </svg>

      <svg className="w-0 h-0">
        <filter id="rough-paper-dark">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06"
            result="noise"
            numOctaves="3"
          />
          <feDiffuseLighting in="noise" lightingColor="#444" surfaceScale="2.5">
            <feDistantLight azimuth="45" elevation="50" />
          </feDiffuseLighting>
        </filter>
      </svg>

      {/* Too slow for live use, but we can apply it and capture PNGs */}
      {/* <svg id="svg" width="0" height="0" viewBox="-500 -500 1000 1000">
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
      </svg> */}
    </header>
  );
}
