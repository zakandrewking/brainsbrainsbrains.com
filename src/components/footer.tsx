import { RssIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col my-10 items-center">
      <Link href="/feed" className="flex items-center">
        <RssIcon className="w-4 h-4 mr-2" />
        <span>Atom Feed</span>
      </Link>
    </footer>
  );
}
