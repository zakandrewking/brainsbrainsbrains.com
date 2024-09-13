import fs from "fs";
import matter from "gray-matter";
import path from "path";
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

const postsDirectory = path.join(process.cwd(), "src", "app", "blog");

interface PostData {
  id: string;
  title: string;
  date: Date;
  tags: string[];
  preview: string;
  anchor: string;
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
        // Combine the data with the id
        return {
          ...matterResult.data,
          preview,
          id,
          // preview,
        } as PostData;
      })
    )
  ).filter((post) => post !== null) as PostData[];

  // Sort posts by date
  return {
    posts: allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    }),
    tags: allPostsData
      .flatMap((post) => post.tags)
      .reduce((acc, tag) => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
        return acc;
      }, [] as string[]),
  };
}
