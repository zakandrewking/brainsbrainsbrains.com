import Link from "next/link";

import { Button } from "./ui/button";

export default function Tags({
  tags,
  label = false,
}: {
  tags: string[];
  label?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {label && <span>Tags:</span>}
      {tags.map((tag: string) => (
        <Button variant="outline" size="chip" key={tag} asChild>
          <Link href={`/tag/${tag}`}>{tag}</Link>
        </Button>
      ))}
    </div>
  );
}
