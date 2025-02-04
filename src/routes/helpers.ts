export function randNum(min: number, max: number): number {
  return (Math.floor(Math.random() * (max - min + 1)) + min);
}
export function clampNum(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
