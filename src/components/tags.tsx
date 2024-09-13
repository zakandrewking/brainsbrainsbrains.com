import Link from "next/link";

import { cn } from "@/util/ui-util";

import { Button } from "./ui/button";

export default function Tags({
  tags,
  label = false,
}: {
  tags: string[];
  label?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", label ? "mt-12" : "")}>
      {label && <span>Tags:</span>}
      {tags.map((tag: string) => (
        <Button variant="outline" size="chip" key={tag} asChild>
          <Link href={`/tag/${tag}`}>{tag}</Link>
        </Button>
      ))}
    </div>
  );
}
