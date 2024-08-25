export const rolledHeight = 180;

export function getUnrolledHeight(screenWidth: number): number {
  return screenWidth < 768 ? 1230 : 930;
}
