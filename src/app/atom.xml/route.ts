import { Feed } from "feed";
import { NextResponse } from "next/server";

import { getSortedPostsData } from "@/util/blog-util";

// // TODO generate from MDX
// // TODO use full URL for images
// const content = `
//     <p class="mb-6">OpenAI has a new model. But it's not GPT-5 (please, please, we just like how it
//         feels increment a number!). It's called
//         <a href="https://openai.com/index/introducing-openai-o1-preview/">"o1-preview"</a>, and
//         it's a GPT that's fine-tuned for chain-of-thought reasoning.
//     </p>
//     <p class="mb-6">On one hand, chain-of-thought prompting has been possible all along with GPT-3+,
//         and is widely used. Heck, you can find it on site called
//         <a href="https://learnprompting.org/docs/intermediate/chain_of_thought">LearnPrompting.org</a>.
//     </p>
//     <p class="mb-6">But OpenAI has taken things a step further by (1) training this model to use
//         chain-of-thought all the time and, (2) more importantly, hiding the
//         chain-of-thought from users. We do get to see a kind of summary of the reasoning
//         steps (at least in ChatGPT), but not the gory details of the LLM output. This
//         might provide OpenAI some protection from other models training on o1 output,
//         but it's a bummer.</p>
//     <p class="mb-6">I don't have access to op1 via API, but I do have it in ChatGPT. And it has no
//         problem with the classic strawberry problem (LLMs struggle here because
//         tokenization swallows letter-counts):</p>
//     <img src="/chain-of-thought/strawberry.png" style="width:100%;max-width:550px;margin-bottom:15px">
//     <p class="mb-6">So, at least we have that. I like to challenge these models to <em>teach me
//             something</em>; let's try that.</p><a href="/blog/chain-of-thought#lets-make-a-syllabus">[ Keep reading ]</a>
//             `;

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

  for (const post of posts) {
    // const renderedContent = await renderMdxToHtml(post.content);
    feed.addItem({
      title: post.title,
      id: `https://www.brainsbrainsbrains.com/blog/${post.id}`,
      link: `https://www.brainsbrainsbrains.com/blog/${post.id}`,
      // description: content,
      author: [
        {
          name: "Zak King",
          link: "https://www.brainsbrainsbrains.com/",
        },
      ],
      date: new Date(post.date),
    });
  }

  return new NextResponse(feed.atom1(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
