export function isIphone(userAgent: string): boolean {
  return /iPhone/i.test(userAgent);
}
