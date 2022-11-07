export function createPriorityMap<T>(arr: Array<T>) {
  return new Map(arr.map((key, i) => [key, arr.length - i]));
}
