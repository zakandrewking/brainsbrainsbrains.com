import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "src", "app", "blog");

interface PostData {
  id: string;
  title: string;
  date: string;
  tags: string[];
}

export function getSortedPostsData() {
  //   // Get file names under /posts
  //   const fileNames = fs.readdirSync(postsDirectory);
  //   const allPostsData = fileNames
  //     .map((fileName) => {
  //       if (fileName === "layout.tsx") return null;
  //       // folder names are unique
  //       const id = fileName;
  //       // Read markdown file as string
  //       const fullPath = path.join(postsDirectory, fileName, "page.mdx");
  //       const fileContents = fs.readFileSync(fullPath, "utf8");
  //       // Use gray-matter to parse the post metadata section
  //       const matterResult = matter(fileContents);
  //       // Combine the data with the id
  //       return {
  //         id,
  //         ...matterResult.data,
  //       } as PostData;
  //     })
  //     .filter((post) => post !== null);
  //   // Sort posts by date
  //   return {
  //     posts: allPostsData.sort((a, b) => {
  //       if (a.date < b.date) {
  //         return 1;
  //       } else {
  //         return -1;
  //       }
  //     }),
  //     tags: allPostsData
  //       .flatMap((post) => post.tags)
  //       .reduce((acc, tag) => {
  //         if (!acc.includes(tag)) {
  //           acc.push(tag);
  //         }
  //         return acc;
  //       }, [] as string[]),
  //   };
}
