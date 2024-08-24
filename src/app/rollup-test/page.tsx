"use client";

import { drag as d3Drag } from "d3-drag";
import { select as d3Select } from "d3-selection";
import { get, set } from "lodash";
import { Caveat as Handwritten } from "next/font/google";
import { useEffect, useReducer, useRef, useState } from "react";
import "./test.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const handwritten = Handwritten({
  subsets: ["latin"],
  //   weight: "700",
  display: "swap",
  fallback: ["sans-serif"],
});

interface State {
  // the height to render
  height?: string;
  // whether to activate CSS transition effects
  shouldTransition: boolean;
  // whether the last state (before this drage) was rolled up
  wasRolledUp?: boolean;
}

type Action =
  | ({ type: "update" } & Partial<State>)
  | {
      type: "drag_height";
      dy: number;
    }
  | { type: "go_to_stop_point"; unrolledHeight: string; rolledHeight: string };

function reducer(state: State, action: Action) {
  if (action.type === "drag_height") {
    if (!state.height) return state;
    const newState = {
      ...state,
      height: `${Math.max(parseInt(state.height) + action.dy, 40)}px`,
    };
    return newState;
  } else if (action.type === "go_to_stop_point") {
    const newState = {
      ...state,
      height: state.wasRolledUp ? action.unrolledHeight : action.rolledHeight,
      wasRolledUp: !state.wasRolledUp,
    };
    return newState;
  } else if (action.type === "update") {
    const newState = {
      ...state,
      ...action,
    };
    return newState;
  } else {
    throw Error("Invalid action type");
  }
}

const rolledHeight = 160;
const unrolledHeight = 1300;

const initialState = {
  height: `${rolledHeight}px`,
  shouldTransition: true,
  wasRolledUp: true,
};

export default function RollupTest() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getHeight = (isRolledUp: boolean) => {
    return isRolledUp ? `${rolledHeight}px` : `${unrolledHeight}px`;
  };
  const dragRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);
  const handleRollup = () => {
    dispatch({
      type: "update",
      height: getHeight(!state.wasRolledUp),
      wasRolledUp: !state.wasRolledUp,
    });
  };

  useEffect(() => {
    if (!dragRef.current) return;
    const selection = d3Select(dragRef.current);
    const drag: any = d3Drag()
      .on("start", () => {
        dispatch({ type: "update", shouldTransition: false });
      })
      .on("drag", (event) => {
        if (!heightRef.current) return;
        d3Select(heightRef.current).style(
          "height",
          `${Math.max(
            parseInt(heightRef.current?.style.height ?? "0") + event.dy,
            40
          )}px`
        );
      })
      .on("end", () => {
        dispatch({ type: "update", shouldTransition: true });
        dispatch({
          type: "go_to_stop_point",
          unrolledHeight: `${unrolledHeight}px`,
          rolledHeight: `${rolledHeight}px`,
        });
      });
    selection.call(drag);
    return () => {
      selection.on(".drag", null);
    };
  }, [dragRef]);

  return (
    <div
      className={cn(
        "relative pb-6 w-[350px] md:w-[750px]",
        handwritten.className,
        state.shouldTransition
          ? "transition-[height] duration-500 ease-in-out"
          : ""
      )}
      style={{ height: state.height }}
      ref={heightRef}
    >
      <div className="w-full h-full overflow-hidden">
        <div className="w-full h-[calc(100%-24px)] absolute overflow-hidden rounded-t-lg">
          <div className="paper-filter w-full h-full top-0 left-0"></div>
        </div>

        <div
          className="relative w-full p-6 pb-2 overflow-hidden"
          //   pencil texture is WAY slow on safari
          // style={{ filter: "url(#pencil-texture)"}}
        >
          <Content />
        </div>
      </div>

      {/* filter under scroll */}
      <div className="w-full h-6 top-[calc(100%-24px)] absolute overflow-hidden">
        <div className="paper-filter w-full h-full top-0 left-0"></div>
      </div>

      <div
        className="absolute scroll w-full bottom-0 left-0 h-6 cursor-ns-resize"
        ref={dragRef}
      />

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
            numOctaves="3"
          />
          <feDiffuseLighting in="noise" lightingColor="#666" surfaceScale="1">
            <feDistantLight azimuth="45" elevation="20" />
          </feDiffuseLighting>
        </filter>
      </svg>
    </div>
  );
}

function Content() {
  return (
    <>
      <div className="flex flex-col gap-6 items-center mt-6">
        <div className="flex flex-col gap-2 items-center mb-8">
          <div className="text-xl">The personal website of</div>
          <span className="font-bold text-4xl">Zak King</span>
        </div>
      </div>
      <div className="flex flex-col gap-6 items-center">
        <img
          src="/zak.jpeg"
          alt="Pic of Zak"
          className="rounded-lg h-40 my-3 border-2"
        />
        <div className="flex flex-col gap-2">
          <span className="text-xl">Find me here:</span>
          <Card>
            {/* TODO wrap */}
            <div className="flex flex-row flex-wrap gap-3 mx-3 justify-center text-xl">
              <Button variant="link" asChild>
                <a href="https://github.com/zakandrewking">GitHub</a>
              </Button>
              <Button variant="link" asChild>
                <a href="https://twitter.com/brainsbrainsbr">Twitter</a>
              </Button>
              <Button variant="link" asChild>
                <a href="https://www.linkedin.com/in/zakandrewking/">
                  LinkedIn
                </a>
              </Button>
              <Button variant="link" asChild>
                <a href="mailto:zaking17@gmail.com">Email</a>
              </Button>
            </div>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="no-underline">About me</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              style={{
                transform:
                  "rotate(-0.6deg) translate(0.2rem, -0.3rem) skewX(-2deg)",
              }}
            >
              <span className="mr-2 text-2xl">📱</span> I am VP of Engineering
              at{" "}
              <a href="https://delfina.com" className="fg-primary">
                Delfina
              </a>
              . Previously I led DevOps at{" "}
              <a href="https://www.amyris.com">Amyris</a>, and before that you
              might have found me{" "}
              <a href="https://scholar.google.com/citations?user=ESLgsdUAAAAJ&hl=en">
                modeling microorganisms
              </a>{" "}
              at UC San Diego or haunting{" "}
              <a href="https://www.google.com/maps/@42.2783983,-83.7414089,3a,25.4y,88.35h,92.52t/data=!3m8!1e1!3m6!1sAF1QipPP8EKHRsoQYKOEzgkySqXr3YwlnjYMGCXC1nAX!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPP8EKHRsoQYKOEzgkySqXr3YwlnjYMGCXC1nAX%3Dw203-h100-k-no-pi-0-ya315.63397-ro-0-fo100!7i8704!8i4352?entry=ttu">
                Comet Coffee
              </a>{" "}
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
              <a href="https://supabase.com/">Supabase</a> and Dan Dennett's{" "}
              <a href="https://en.wikipedia.org/wiki/Consciousness_Explained">
                "Consciousness Explained"
              </a>
              . Check out{" "}
              <a href="https://www.youtube.com/@veritasium">Veritasium</a> too
              for some of the best science content on the Internet.
            </p>

            <p
              style={{
                transform:
                  "rotate(-0.5deg) translate(0.5rem, -0.3rem) skewX(-2deg)",
              }}
            >
              <span className="mr-2 text-2xl">📍</span> I live in San Diego with
              my wife Gaby and two kids Elise (8) and Julian (5).
            </p>
          </CardContent>
        </Card>
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
    </>
  );
}
