/**
 * blog setup:
 * https://nextjs.org/docs/app/building-your-application/configuring/mdx
 * https://nextjs.org/learn-pages-router/basics/data-fetching/blog-data
 * https://www.tybarho.com/articles/filtering-by-tags-nextjs-mdx-blog
 */

import Link from "next/link";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="p-10">
      <Button variant="link" asChild>
        <Link href="/">← Home</Link>
      </Button>
      {children}
    </div>
  );
}
