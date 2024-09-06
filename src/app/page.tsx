import Link from "next/link";

import Footer from "@/components/footer";
import PaperHeader from "@/components/paper-header";
import PostList from "@/components/post-list";
import { Button } from "@/components/ui/button";
import { H4 } from "@/components/ui/typography";
import { getSortedPostsData } from "@/util/blog-util";

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <>
      <PaperHeader isRolledUp={true} />
      <main className="flex flex-col w-[355px] md:w-[750px] pt-8 px-2">
        <PostList />
        <H4 className="mt-12">Tags</H4>
        <div className="flex flex-wrap gap-2">
          {allPostsData.tags.map((tag: string) => (
            <Button
              variant="outline"
              // color="secondary"
              size="chip"
              key={tag}
              asChild
            >
              <Link href={`/tag/${tag}`}>{tag}</Link>
            </Button>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
