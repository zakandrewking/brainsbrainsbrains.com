"use client";

import "./paper.css";
import { drag as d3Drag } from "d3-drag";
import { select as d3Select } from "d3-selection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { Ban } from "lucide-react";

import { PaperStoreContext } from "@/stores/paper-store";
import { rolledHeight, roughSizes, unrolledHeight } from "@/util/paper-util";
import { cn } from "@/util/ui-util";

import Doodle from "./doodle";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { PaperButton, PaperLink } from "./ui/paper-button";
import { RoughCard } from "./ui/rough-card";

export default function PaperHeader({ isRolledUp }: { isRolledUp: boolean }) {
  const { state, dispatch } = useContext(PaperStoreContext);
  const dragRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const rollUrl = isRolledUp ? "/about-me" : "/";
  const rollText = isRolledUp ? "About Me" : "Home";

  const handleRoll = async () => {
    router.push(rollUrl, { scroll: false });
  };

  const getHeight = () => {
    return isRolledUp ? `${rolledHeight}px` : `${unrolledHeight}px`;
  };

  useEffect(() => {
    dispatch({ type: "update", height: getHeight() });
  }, []);

  const height = state.height ?? getHeight();

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
        dispatch({ type: "update", shouldTransition: false });
      })
      .on("drag", (event) => {
        if (!heightRef.current) return;
        const newHeight = getDraggedHeight(event.dy);
        d3Select(heightRef.current).style("height", newHeight);
      })
      .on("end", () => {
        dispatch({
          type: "update",
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
        "relative pb-6 w-[355px] handwritten font-handwritten",
        state.shouldTransition
          ? "transition-[height] duration-500 ease-in-out"
          : ""
      )}
      style={{ height }}
      ref={heightRef}
    >
      <div className="w-full h-full overflow-hidden">
        <div className="w-full h-[calc(100%-24px)] absolute overflow-hidden rounded-t-md">
          <div className="paper-filter w-full h-full top-0 left-0"></div>
        </div>

        <div className="relative w-full p-1 pt-2 overflow-hidden">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-6 items-center pt-2">
              <div className="flex flex-col gap-2 items-center">
                <div className="text-xl">The personal website of</div>
                <span className="font-bold text-4xl">Zak King</span>
              </div>
            </div>

            <PaperButton
              href={rollUrl}
              onClick={(event) => {
                event.preventDefault();
                handleRoll();
              }}
              className="my-3"
            >
              {rollUrl === "/about-me" ? (
                <>
                  <img
                    src="/smile-dark.png"
                    alt="Smile (dark)"
                    className="h-6 pr-1 hidden dark:inline"
                  />
                  <img
                    src="smile-light.png"
                    alt="Smile (light)"
                    className="h-6 pr-1 inline dark:hidden"
                  />
                </>
              ) : (
                <>
                  <img
                    src="/arrow-dark.png"
                    alt="Arrow back (dark)"
                    className="h-6 pr-1 hidden dark:inline"
                  />
                  <img
                    src="arrow-light.png"
                    alt="Arrow back (light)"
                    className="h-6 pr-1 inline dark:hidden"
                  />
                </>
              )}
              {rollText}
            </PaperButton>
          </div>

          <div className="flex flex-col gap-6 items-center px-4">
            <RoughCard
              height={roughSizes.img.height}
              width={roughSizes.img.width}
              generatorKey="img"
            >
              <img
                src="/zak.jpeg"
                alt="Pic of Zak"
                className="rounded-sm h-40 m-1"
              />
            </RoughCard>
            <div className="flex flex-col gap-2">
              <span className="text-xl">Find me here:</span>
              <RoughCard
                height={roughSizes.links.height}
                width={roughSizes.links.width}
                generatorKey="bioGenerator"
              >
                <div className="flex flex-row flex-wrap gap-3 m-3 justify-center text-xl">
                  <PaperButton href="https://github.com/zakandrewking">
                    GitHub
                  </PaperButton>
                  <PaperButton href="https://twitter.com/brainsbrainsbr">
                    Twitter
                  </PaperButton>
                  <PaperButton href="https://www.linkedin.com/in/zakandrewking/">
                    LinkedIn
                  </PaperButton>
                  <PaperButton href="mailto:zaking17@gmail.com">
                    Email
                  </PaperButton>
                </div>
              </RoughCard>
            </div>
            <RoughCard
              height={roughSizes.bio.height}
              width={roughSizes.bio.width}
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
                  <img
                    src="/phone.png"
                    alt="Phone"
                    className="h-10 inline align-bottom pr-2"
                  />
                  I am VP of Engineering at{" "}
                  <PaperLink href="https://delfina.com" className="fg-primary">
                    Delfina
                  </PaperLink>
                  . Previously I led DevOps at{" "}
                  <PaperLink href="https://www.amyris.com">Amyris</PaperLink>,
                  and before that you might have found me{" "}
                  <PaperLink href="https://scholar.google.com/citations?user=ESLgsdUAAAAJ&hl=en">
                    modeling
                  </PaperLink>{" "}
                  microorganisms at UC San Diego or haunting{" "}
                  <PaperLink href="https://www.google.com/maps/@42.2783983,-83.7414089,3a,25.4y,88.35h,92.52t/data=!3m8!1e1!3m6!1sAF1QipPP8EKHRsoQYKOEzgkySqXr3YwlnjYMGCXC1nAX!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPP8EKHRsoQYKOEzgkySqXr3YwlnjYMGCXC1nAX%3Dw203-h100-k-no-pi-0-ya315.63397-ro-0-fo100!7i8704!8i4352?entry=ttu">
                    Comet Coffee
                  </PaperLink>{" "}
                  between classes at UofM (Go Blue!).
                </p>

                <p
                  style={{
                    transform:
                      "rotate(-0.2deg) translate(0.6rem, -0.3rem) skewX(-3deg)",
                  }}
                >
                  <img
                    src="/heart.png"
                    alt="Heart"
                    className="h-8 inline align-bottom pr-1"
                  />
                  Occasional fan of skeuomorphism; real fan of{" "}
                  <PaperLink href="https://supabase.com/">Supabase</PaperLink>{" "}
                  and Dan Dennett's{" "}
                  <PaperLink href="https://en.wikipedia.org/wiki/Consciousness_Explained">
                    "Consciousness Explained"
                  </PaperLink>
                  . I'm fascinated by{" "}
                  <PaperLink href="https://github.com/kolbytn/mindcraft">
                    Mindcraft 🧠⛏️
                  </PaperLink>{" "}
                  and the prospect of setting LLMs free in an open digital
                  world.
                </p>

                <p
                  style={{
                    transform:
                      "rotate(-0.5deg) translate(0.5rem, -0.3rem) skewX(-2deg)",
                  }}
                >
                  <img
                    src="/pin.png"
                    alt="Pin"
                    className="h-10 inline align-bottom pr-1"
                  />
                  I live in San Diego with my wife Gaby and two kids Elise (8)
                  and Julian (5).
                </p>
              </CardContent>
            </RoughCard>
            <div className="mt-2">
              <Doodle />
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
          aria-label={"Go to " + rollText}
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
