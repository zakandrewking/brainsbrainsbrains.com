"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, useContext, useEffect } from "react";

import useIsSSR from "@/hooks/useIsSSR";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { PaperStoreContext } from "@/stores/paper-store";
import { getUnrolledHeight, rolledHeight } from "@/util/paper-util";

import Paper from "./paper";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function PaperHeader({ isRolledUp }: { isRolledUp: boolean }) {
  const isSSR = useIsSSR();
  const router = useRouter();
  const paperStore = useContext(PaperStoreContext);

  const handleResize = ({ width }: { width: number | null }) => {
    const unrolledHeight = getUnrolledHeight(width || 0);
    console.log({ width, unrolledHeight });
    paperStore.dispatch({
      type: "update",
      height: unrolledHeight,
    });
  };

  const { width: screenWidth } = useWindowDimensions(handleResize);

  const unrolledHeight = getUnrolledHeight(screenWidth || 0);

  const handleRoll = (event?: MouseEvent<HTMLAnchorElement>) => {
    if (!isSSR && event) {
      event.preventDefault();
      router.push(event.currentTarget.href, {
        scroll: false,
      });
    }
    if (isRolledUp) {
      paperStore.dispatch({
        type: "update",
        height: unrolledHeight,
        wasRolledUp: false,
      });
    } else {
      paperStore.dispatch({
        type: "update",
        height: rolledHeight,
        wasRolledUp: true,
      });
    }
  };

  useEffect(() => {
    if (isRolledUp) {
      paperStore.dispatch({
        type: "update",
        height: rolledHeight,
        wasRolledUp: true,
      });
    } else {
      paperStore.dispatch({
        type: "update",
        height: unrolledHeight,
        wasRolledUp: false,
      });
    }
  }, []);

  const baselineHeight = isRolledUp ? rolledHeight : unrolledHeight;
  const height = paperStore.state.height ?? baselineHeight;
  const linkUrl = isRolledUp ? "/about-me" : "/";
  const linkText = isRolledUp ? "☺ About Me" : "← Home";

  return (
    <header className="absolute pb-8 w-[350px] md:w-[750px]">
      <Paper scrollUrl={linkUrl} height={height} handleRoll={handleRoll}>
        <Button
          variant="link"
          className="absolute top-2 left-4 w-20 hover:no-underline hover:text-fuchsia-700 dark:hover:text-fuchsia-300"
          asChild
        >
          <Link href={linkUrl} onClick={handleRoll}>
            {linkText}
          </Link>
        </Button>
        <div className="flex flex-col gap-6 items-center mt-6">
          <div className="flex flex-col gap-2 items-center mb-8">
            <div className="underline underline-offset-4 text-xl">
              The personal website of
            </div>
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
              <CardTitle>About me</CardTitle>
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
                <span className="mr-2 text-2xl">📍</span> I live in San Diego
                with my wife Gaby and two kids Elise (8) and Julian (5).
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
      </Paper>
    </header>
  );
}