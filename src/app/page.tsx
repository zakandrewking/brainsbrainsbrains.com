import { Metadata } from "next";

import Paper from "@/components/paper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Zak King",
  description: "The personal website of Zak King",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-8 items-center">
      <header className="max-w-xl">
        <Paper>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-2 items-center">
              <div className="underline underline-offset-4 text-xl">
                The personal website of
              </div>
              <span className="font-bold text-4xl">Zak King</span>
            </div>
            <img
              src="/zak.png"
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
                <p>
                  <span className="mr-2 text-2xl">🛜</span> I am VP of
                  Engineering at{" "}
                  <a href="https://delfina.com" className="fg-primary">
                    Delfina
                  </a>
                  . Previously I led DevOps at{" "}
                  <a href="https://www.amyris.com">Amyris</a>, and before that
                  you might have found me modeling microorganisms at UC San
                  Diego or haunting{" "}
                  <a href="https://www.google.com/maps/@42.2783983,-83.7414089,3a,25.4y,88.35h,92.52t/data=!3m8!1e1!3m6!1sAF1QipPP8EKHRsoQYKOEzgkySqXr3YwlnjYMGCXC1nAX!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPP8EKHRsoQYKOEzgkySqXr3YwlnjYMGCXC1nAX%3Dw203-h100-k-no-pi-0-ya315.63397-ro-0-fo100!7i8704!8i4352?entry=ttu">
                    Comet Coffee
                  </a>{" "}
                  between classes at UofM (Go Blue!).
                </p>

                <p>
                  <span className="mr-2 text-2xl">❤️</span> Occasional fan of
                  skeuomorphism; real fan of{" "}
                  <a href="https://supabase.com/">Supabase</a> and Dan Dennett's{" "}
                  <a href="https://en.wikipedia.org/wiki/Consciousness_Explained">
                    "Consciousness Explained"
                  </a>
                  . Aplogies for my bad handrighting and bad speling.
                </p>

                <p>
                  <span className="mr-2 text-2xl">📍</span> I live in San Diego
                  with the best three people on planet Earth (two of them are
                  still very small).
                </p>
              </CardContent>
            </Card>
          </div>
        </Paper>
      </header>
      {/* <main className="px-10 flex flex-col">
        <H1>Posts</H1>
        <a
          href="/post/eat-state"
          className="flex flex-col content-start underline-offset-4 hover:underline"
        >
          <H3>
            Have your Next.js server component and eat it too (🚧 WIP! 🚧)
          </H3>
          Start with React Server Components; seemlessly adopt client-side
          logic.
        </a>
      </main> */}
      <footer className="flex flex-col mt-20 text-muted-foreground">
        <div>Credits:</div>
        <a
          href="https://www.flaticon.com/free-icons/mountain"
          title="mountain icons"
        >
          Mountain icons created by Freepik - Flaticon
        </a>
        <a href="https://heredragonsabound.blogspot.com/2020/02/creating-pencil-effect-in-svg.html">
          Pencil effects
        </a>
        <a href="https://codepen.io/Chokcoco/full/OJWLXPY">Paper texture</a>
      </footer>
    </div>
  );
}
