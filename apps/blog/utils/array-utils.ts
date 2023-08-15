
export function makeArray(index: number) {
  return [...Array(index)].map((_, index) => index);
}
