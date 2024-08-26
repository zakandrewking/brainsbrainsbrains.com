/**
 * from https://github.com/juliencrn/usehooks-ts
 */

import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
