export function formatMentions(text: string): Array<{ type: string; value: string }> {
  const regex = /@([a-zA-Z0-9_]+)/g;
  const parts = text.split(regex);

  const formatted: Array<{ type: string; value: string }> = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      formatted.push({ type: "mention", value: parts[i] });
    } else {
      formatted.push({ type: "text", value: parts[i] });
    }
  }

  return formatted;
}
