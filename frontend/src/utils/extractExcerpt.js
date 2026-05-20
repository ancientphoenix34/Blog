export function extractExcerpt(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const headings = Array.from(doc.querySelectorAll('h1, h2, h3'))
    .map(el => el.textContent.trim())
    .filter(Boolean)
    .join(' ');

  const bodyText = doc.body.textContent || '';
  const words = bodyText.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const bodyExcerpt = words.slice(0, 200).join(' ');

  const combined = [headings, bodyExcerpt].filter(Boolean).join(' ');
  return combined.split(' ').filter(Boolean).slice(0, 250).join(' ');
}

export function countWords(htmlContent) {
  if (!htmlContent) return 0;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const text = doc.body.textContent || '';
  return text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}
