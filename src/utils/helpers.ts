export function parseFollowerCount(text: string): number {
  // Remove all non-numeric characters except K, M, B (for thousands, millions, billions)
  const cleanText = text.replace(/[^0-9KMB.,]/gi, '').toUpperCase();

  // Handle K (thousands), M (millions), B (billions)
  let multiplier = 1;
  let numberText = cleanText;

  if (cleanText.includes('B')) {
    multiplier = 1000000000;
    numberText = cleanText.replace('B', '');
  } else if (cleanText.includes('M')) {
    multiplier = 1000000;
    numberText = cleanText.replace('M', '');
  } else if (cleanText.includes('K')) {
    multiplier = 1000;
    numberText = cleanText.replace('K', '');
  }

  // Replace comma with dot for decimal parsing
  numberText = numberText.replace(',', '.');

  const number = parseFloat(numberText);
  return Math.round(number * multiplier);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateTime(date: Date): string {
  return date.toISOString();
}
