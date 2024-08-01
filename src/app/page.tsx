"use client";

import { useCallback, useState } from 'react';

import Paper from '@/components/paper';
import RollUpAnimation from '@/components/RollUpAnimation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [isRolledUp, setIsRolledUp] = useState(false);
  const [paperHeight, setPaperHeight] = useState("auto");

  const toggleRollUp = () => {
    setIsRolledUp(!isRolledUp);
  };

  const handleHeightChange = useCallback((height: number) => {
    setPaperHeight(`${height + 130}px`); // Add 180px for the header content
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-8 items-center">
      <header className="max-w-xl">
        <Paper height={paperHeight}>
          <Button
            onClick={toggleRollUp}
            className="absolute top-2 right-2 w-16"
          >
            {isRolledUp ? "Unroll" : "Roll Up"}
          </Button>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-2 items-center mb-6">
              <div className="underline underline-offset-4 text-xl">
                The personal website of
              </div>
              <span className="font-bold text-4xl">Zak King</span>
            </div>
            <RollUpAnimation
              isRolledUp={isRolledUp}
              onHeightChange={handleHeightChange}
            >
              <div className="flex flex-col gap-6 items-center">
                <img
                  src="/zak.jpeg"
                  alt="Pic of Zak"
                  className="rounded-lg w-48 my-3 border-2"
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
                      <span className="mr-2 text-2xl">📱</span> I am VP of
                      Engineering at{" "}
                      <a href="https://delfina.com" className="fg-primary">
                        Delfina
                      </a>
                      . Previously I led DevOps at{" "}
                      <a href="https://www.amyris.com">Amyris</a>, and before
                      that you might have found me{" "}
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
                      <span className="mr-2 text-2xl">❤️</span> Occasional fan
                      of skeuomorphism; real fan of{" "}
                      <a href="https://supabase.com/">Supabase</a> and Dan
                      Dennett's{" "}
                      <a href="https://en.wikipedia.org/wiki/Consciousness_Explained">
                        "Consciousness Explained"
                      </a>
                      . Check out{" "}
                      <a href="https://www.youtube.com/@veritasium">
                        Veritasium
                      </a>{" "}
                      too for simply the best science content on the Internet.
                    </p>

                    <p
                      style={{
                        transform:
                          "rotate(-0.5deg) translate(0.5rem, -0.3rem) skewX(-2deg)",
                      }}
                    >
                      <span className="mr-2 text-2xl">📍</span> I live in San
                      Diego with my wife Gaby and two kids Elise (8) and Julian
                      (5).
                    </p>
                  </CardContent>
                </Card>
                <div className="mt-2">
                  <svg
                    height="100"
                    width="100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
            </RollUpAnimation>
          </div>
        </Paper>
      </header>
      <footer className="flex flex-col mt-20 text-muted-foreground">
        <div>Credits:</div>
        <a href="https://github.com/twitter/twemoji">Emoji Favicon</a>
        <a href="https://heredragonsabound.blogspot.com/2020/02/creating-pencil-effect-in-svg.html">
          Pencil effects
        </a>
        <a href="https://codepen.io/Chokcoco/full/OJWLXPY">Paper texture</a>
        <a href="https://www.fxhash.xyz/generative/12059">Inspiration</a>
      </footer>
    </div>
  );
}
