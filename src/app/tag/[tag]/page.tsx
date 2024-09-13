import Link from "next/link";

import PostList from "@/components/post-list";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { getSortedPostsData } from "@/util/blog-util";

export async function generateStaticParams() {
  const { tags } = await getSortedPostsData();
  return tags.map((tag) => ({ tag }));
}

export default function Tag({ params }: { params: { tag: string } }) {
  return (
    <main className="flex flex-col w-[355px] md:w-[750px] pt-8 px-2 items-start">
      <Button variant="link" asChild>
        <Link href="/">← Home</Link>
      </Button>
      <H1>Tag: {params.tag}</H1>
      <PostList tag={params.tag} />
    </main>
  );
}
