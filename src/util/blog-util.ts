// server-only because we `eval`
import "server-only";
import fs from "fs";
import matter from "gray-matter";
import path, { join } from "path";
import * as runtime from "react/jsx-runtime";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

import { compile } from "@mdx-js/mdx";

async function make(content: string) {
  return await compile(content, {
    outputFormat: "function-body",
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [],
  });
}

async function mdxToJavascript(content: string) {
  return String(await make(content));
}

export async function renderMdxToHtml(content: string) {
  const code = await compile(content, {
    outputFormat: "function-body",
    development: false,
    baseUrl: join(import.meta.url, "..", "..", ".."),
  });

  const { default: MDXContent } = await eval(
    `(async () => {
      const runtime = ${JSON.stringify(runtime)};
      const {jsx} = runtime;
      ${code}
      return { default: MDXContent };
    })()`
  );

  const ReactDOMServer = await import("react-dom/server");
  return ReactDOMServer.renderToString(MDXContent({}));
}

const postsDirectory = path.join(process.cwd(), "src", "app", "blog");

interface PostData {
  id: string;
  title: string;
  date: Date;
  tags: string[];
  preview: string;
  anchor: string;
  content: string; // Add this to include the content property
}

export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = (
    await Promise.all(
      fileNames.map(async (fileName) => {
        if (fileName === "layout.tsx" || fileName === ".DS_Store") return null;
        // folder names are unique
        const id = fileName;
        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName, "page.mdx");
        const fileContents = fs.readFileSync(fullPath, "utf8");
        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);
        // Extract preview content based on start and end lines
        const lines = fileContents.split("\n");
        const previewContents = lines
          .slice(
            matterResult.data.preview_start_line - 1,
            matterResult.data.preview_end_line
          )
          .join("\n");
        const preview = await mdxToJavascript(previewContents);

        // Extract the full content for the feed
        const content = fileContents;

        // Combine the data with the id
        return {
          id,
          title: matterResult.data.title,
          date: new Date(matterResult.data.date),
          tags: matterResult.data.tags || [],
          preview,
          anchor: matterResult.data.anchor || "",
          content,
        } as PostData;
      })
    )
  ).filter((post) => post !== null) as PostData[];

  // Sort posts by date
  const sortedPosts = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return {
    posts: sortedPosts,
    tags: sortedPosts
      .flatMap((post) => post.tags)
      .reduce((acc, tag) => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
        return acc;
      }, [] as string[]),
  };
}
