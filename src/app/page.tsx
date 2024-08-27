import Link from "next/link";

import Footer from "@/components/footer";
import PaperHeader from "@/components/paper-header";
import { Button } from "@/components/ui/button";
import { H1, H3 } from "@/components/ui/typography";

import { getSortedPostsData } from "../util/blog-util";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <>
      <PaperHeader isRolledUp={true} />
      {/* <main className="flex flex-col w-[350px] md:w-[750px] pt-8 px-2">
        <H1>Posts</H1>
        {allPostsData.posts.map(({ id, date, title, tags }) => (
          <div>
            <Button
              variant="link"
              asChild
              className="flex flex-col items-start"
            >
              <Link href={`/blog/${id}`} key={id}>
                <div>{title}</div>
                <div>{date}</div>
              </Link>
            </Button>
            <div>tags: {tags.join(", ")}</div>
          </div>
        ))}
        <H3 className="mt-8">Tags</H3>
        {allPostsData.tags.map((tag) => (
          <Link href={`/#${tag}`}>{tag}</Link>
        ))}
      </main> */}
      <Footer />
    </>
  );
}
