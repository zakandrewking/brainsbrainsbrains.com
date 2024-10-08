import PaperHeader from "@/components/paper-header";
import PostList from "@/components/post-list";
import Tags from "@/components/tags";
import { H4 } from "@/components/ui/typography";
import { getSortedPostsData } from "@/util/blog-util";

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <>
      <PaperHeader isRolledUp={true} />
      <main className="flex flex-col w-[355px] md:w-[750px] pt-8 px-2">
        <PostList />
        <H4 className="mt-4">Tags</H4>
        <Tags tags={allPostsData.tags} />
      </main>
    </>
  );
}
