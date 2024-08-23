export const rolledHeight = "160px";

export function getUnrolledHeight(screenWidth: number) {
  return screenWidth < 768 ? "1320px" : "950px";
}
