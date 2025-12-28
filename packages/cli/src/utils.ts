export const pluralize = (word: string, count: number) => {
  if (count > 1) {
    return `${word}s`;
  }
  return word;
};
