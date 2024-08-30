import Link from "next/link";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { getSortedPostsData } from "../util/blog-util";

export default function PostList({ tag }: { tag?: string }): ReactNode {
  const allPostsData = getSortedPostsData();

  const filteredPosts = tag
    ? allPostsData.posts.filter((post) => {
        if (!tag) return true;
        return post.tags.includes(tag);
      })
    : allPostsData.posts;

  return filteredPosts.map(({ id, date, title, tags }) => (
    <div>
      <Button variant="link" asChild className="flex flex-col items-start">
        <Link href={`/blog/${id}`} key={id}>
          <div>{title}</div>
          <div>{date.toDateString()}</div>
        </Link>
      </Button>
      <div>
        tags:{" "}
        {tags
          .map((tag) => <Link href={`/tag/${tag}`}>{tag}</Link>)
          .reduce((prev, curr) => (
            <>
              {prev}, {curr}
            </>
          ))}
      </div>
    </div>
  ));
}
