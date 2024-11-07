import Link from "next/link";
import { join } from "path";
import * as runtime from "react/jsx-runtime";

import { run } from "@mdx-js/mdx";

import { getMDXComponents } from "../../mdx-components";
import { getSortedPostsData } from "../util/blog-util";
import { H3 } from "./ui/typography";

export default async function PostList({ tag }: { tag?: string }) {
  const allPostsData = await getSortedPostsData();

  const filteredPosts = tag
    ? allPostsData.posts.filter((post) => {
        if (!tag) return true;
        return post.tags.includes(tag);
      })
    : allPostsData.posts;

  return filteredPosts.map(async ({ id, date, title, anchor, preview }) => {
    const { default: MDXContent } = await run(preview, {
      ...(runtime as any),
      baseUrl: join(import.meta.url, ".."),
    });
    return (
      <div className="pb-8">
        <div className="text-gray-600 dark:text-gray-400 mb-2">
          {date.toDateString()}
        </div>
        <Link href={`/blog/${id}`} key={id}>
          <H3 underline={true} className="text-black dark:text-white mb-1">
            {title}
          </H3>
        </Link>
        <MDXContent components={getMDXComponents({})} />
        <Link href={`/blog/${id}#${anchor}`}>[ Keep reading ]</Link>
      </div>
    );
  });
}
