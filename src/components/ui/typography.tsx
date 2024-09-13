import { ReactNode } from "react";

import { getAnchor } from "@/util/string-util";
import { cn } from "@/util/ui-util";

export function H1({
  gutterBottom = true,
  className,
  children,
}: {
  gutterBottom?: boolean;
  className?: string;
  children: ReactNode;
}) {
  let classes = "mt-4 scroll-m-20 text-3xl font-extrabold tracking-tight";
  if (gutterBottom) {
    classes += " mb-6";
  }
  return <h1 className={cn(classes, className)}>{children}</h1>;
}

export function H2({
  gutterBottom = true,
  className,
  children,
}: {
  gutterBottom?: boolean;
  className?: string;
  children: ReactNode;
}) {
  let classes =
    "mt-6 scroll-m-20 text-2xl font-semibold tracking-tight transition-colors";
  if (gutterBottom) {
    classes += " mb-5";
  }
  return <h2 className={cn(classes, className)}>{children}</h2>;
}

// based on https://tomekdev.com/posts/anchors-for-headings-in-mdx
export function H2Anchor({
  gutterBottom = true,
  className,
  children,
}: {
  gutterBottom?: boolean;
  className?: string;
  children: string;
}) {
  const anchor = getAnchor(children);
  const link = `#${anchor}`;
  let classes =
    "mt-6 scroll-m-20 text-2xl font-semibold tracking-tight transition-colors";
  if (gutterBottom) {
    classes += " mb-5";
  }
  return (
    <h2 className={cn(classes, className)} id={anchor}>
      <a href={link} className="anchor-link">
        {children}
      </a>
    </h2>
  );
}

export function H3({
  gutterBottom = true,
  className,
  underline = false,
  children,
}: {
  gutterBottom?: boolean;
  className?: string;
  underline?: boolean;
  children: ReactNode;
}) {
  let classes = "scroll-m-20 text-xl font-semibold tracking-tight";
  if (gutterBottom) {
    classes += " mb-4";
  }
  return (
    <h3
      className={cn(
        classes,
        className,
        underline ? "underline underline-offset-4" : ""
      )}
    >
      {children}
    </h3>
  );
}

export function H4({
  gutterBottom = true,
  className,
  children,
}: {
  gutterBottom?: boolean;
  className?: string;
  children: ReactNode;
}) {
  let classes = "scroll-m-20 text-lg font-semibold tracking-tight";
  if (gutterBottom) {
    classes += " mb-3";
  }
  return <h4 className={cn(classes, className)}>{children}</h4>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-6">{children}</p>;
}
