import Link from "next/link";

import Footer from "@/components/footer";
import PaperHeader from "@/components/paper-header";
import PostList from "@/components/post-list";
import { Button } from "@/components/ui/button";
import { H1, H3 } from "@/components/ui/typography";
import { getSortedPostsData } from "@/util/blog-util";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <>
      <PaperHeader isRolledUp={true} />
      <main className="flex flex-col w-[350px] md:w-[750px] pt-8 px-2">
        <H1>Posts</H1>
        <PostList />
        <H3 className="mt-8">Tags</H3>
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
