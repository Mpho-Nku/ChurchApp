// -------------------------------
// Dice Coefficient 0 - 1
// -------------------------------
export function diceCoefficient(str1: string, str2: string) {
  if (!str1 || !str2) return 0;

  const bigrams = (s: string) => {
    const pairs = [];
    for (let i = 0; i < s.length - 1; i++) {
      pairs.push(s.substring(i, i + 2));
    }
    return pairs;
  };

  const pairs1 = bigrams(str1.toLowerCase());
  const pairs2 = bigrams(str2.toLowerCase());

  let intersection = 0;

  pairs1.forEach((p1) => {
    const index = pairs2.indexOf(p1);
    if (index > -1) {
      intersection++;
      pairs2.splice(index, 1);
    }
  });

  return (2.0 * intersection) / (pairs1.length + pairs2.length);
}

// -------------------------------
// Smart Normalizer
// -------------------------------
export function normalize(str: string | null) {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ") // remove punctuation
    .replace(/\s+/g, " ")
    .trim();
}
