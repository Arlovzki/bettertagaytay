export function buildCorrectionEmail(
  recipient: string,
  title: string,
  pageUrl: string
) {
  const subject = `BetterTagaytay correction: ${title}`;
  const body = `Page: ${pageUrl}\n\nWhat needs correcting:\n\nSuggested correction:\n\nOfficial source (if available):\n`;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
