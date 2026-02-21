const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'have',
  'your',
  'about',
  'into',
  'just',
  'what',
  'when',
  'where',
  'which',
  'while',
  'they',
  'them',
  'been',
  'were',
  'will',
  'would',
  'could',
  'should',
  'there',
  'their',
  'than',
  'then',
  'also',
  'because',
  'very',
  'some',
  'more',
  'most',
]);

const toTag = (word: string) => `#${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;

export const generateHashtags = (input: string, limit = 6): string[] => {
  const words = input.toLowerCase().match(/[a-z][a-z0-9]{2,}/g) ?? [];
  const frequency = new Map<string, number>();

  words.forEach((word) => {
    if (STOP_WORDS.has(word)) {
      return;
    }
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  });

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => toTag(word));
};
