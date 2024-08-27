export const rolledHeight = 180;

export function getUnrolledHeight(screenWidth: number): number {
  return screenWidth < 768 ? 1360 : 1020;
}

type RoughSizes = {
  [key: string]: {
    [key in "sm" | "md"]: { width: number; height: number };
  };
};

export const roughSizes: RoughSizes = {
  img: {
    sm: { width: 221.33, height: 168 },
    md: { width: 221.33, height: 168 },
  },
  links: {
    sm: { width: 310, height: 124 },
    md: { width: 407, height: 68 },
  },
  bio: {
    sm: { width: 310, height: 635 },
    md: { width: 710, height: 355 },
  },
};
