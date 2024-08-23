"use client";

import PaperHeader from "@/components/paper-header";
import useIsSSR from "@/hooks/useIsSSR";

export default function AboutMe() {
  const isSSR = useIsSSR();
  return isSSR ? <PaperHeader isRolledUp={false} /> : <></>;
}
