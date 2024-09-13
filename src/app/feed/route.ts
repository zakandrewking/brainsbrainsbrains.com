import { Feed } from "feed";
import { NextResponse } from "next/server";

import { getSortedPostsData } from "@/util/blog-util";

export async function GET() {
  const { posts } = await getSortedPostsData();

  const feed = new Feed({
    title: "Zak King's Blog",
    description: "BrainsBrainsBrains",
    id: "https://www.brainsbrainsbrains.com/",
    link: "https://www.brainsbrainsbrains.com/",
    language: "en",
    favicon: "https://www.brainsbrainsbrains.com/favicon.ico",
    copyright: `All rights reserved ${new Date().getFullYear()}, Zak King`,
    author: {
      name: "Zak King",
      link: "https://www.brainsbrainsbrains.com/",
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `https://www.brainsbrainsbrains.com/blog/${post.id}`,
      link: `https://www.brainsbrainsbrains.com/blog/${post.id}`,
      description: post.preview,
      content:
        post.preview +
        `<p><a href="https://www.brainsbrainsbrains.com/blog/${post.id}">Read more</a></p>`,
      author: [
        {
          name: "Zak King",
          link: "https://www.brainsbrainsbrains.com/",
        },
      ],
      date: new Date(post.date),
    });
  });

  return new NextResponse(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
