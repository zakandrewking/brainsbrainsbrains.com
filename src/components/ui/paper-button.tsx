import Link from "next/link";
import { MouseEvent, ReactNode } from "react";
import { RoughNotation } from "react-rough-notation";

import { cn } from "@/util/ui-util";

import HoverBuilder from "../hover-builder";
import { Button } from "./button";

export function PaperButton({
  href,
  onClick,
  className,
  children,
}: {
  href: string;
  onClick?: (event: MouseEvent) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="px-4">
      <HoverBuilder
        builder={(isHovering) => (
          <RoughNotation
            type="underline"
            show={isHovering}
            color="hsl(var(--primary))"
            animationDuration={400}
            padding={2}
          >
            <Button
              variant="paperLink"
              asChild
              size="lg"
              className={cn("px-0", className)}
            >
              <Link href={href} onClick={onClick}>
                {children}
              </Link>
            </Button>
          </RoughNotation>
        )}
      />
    </div>
  );
}

/**
 * Next.js Link component styled with animated underline
 */
export function PaperLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <HoverBuilder
      builder={(isHovering) => (
        <RoughNotation
          type="underline"
          show={isHovering}
          color="hsl(var(--primary))"
          animationDuration={400}
          padding={2}
        >
          <Link href={href} className={className}>
            {children}
          </Link>
        </RoughNotation>
      )}
    />
  );
}
