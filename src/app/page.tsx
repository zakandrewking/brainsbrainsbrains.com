import Paper from "@/components/paper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { H1, H3, P } from "@/components/ui/typography";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 min-h-screen pb-10">
      <header className="p-10">
        <Paper>
          <div className="flex flex-col gap-2 items-center">
            <div className="flex flex-col gap-2 items-center">
              The personal website of
              <span className="font-bold text-lg">Zak King</span>
            </div>
            <img
              src="/zak.png"
              alt="Pic of Zak"
              className="rounded-lg h-48 w-48 my-3"
            />
            Find me here:
            <Card>
              {/* TODO wrap */}
              <div className="flex flex-row flex-wrap gap-3 mx-3 justify-center">
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
            {/*<div className="mt-2">About me:</div>
         <Card>
          <div className="p-4">
            I am VP of Engineering at{" "}
            <a
              href="https://delfina.com"
              className="underline underline-offset-4 fg-primary"
            >
              Delfina
            </a>
            . Some tools we like: Flutter, React, Python, FastAPI, Postgres,
            GCP. We're doing RAG search for pregnancy = and so much more. I also
            tell everybody to use Supabase.
          </div>
        </Card> */}
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
    </div>
  );
}
