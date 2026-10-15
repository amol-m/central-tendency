import { formatNumber } from '../stats.js';

/** Joins numbers as "1, 2 and 3". */
export function listWords(items) {
  const parts = items.map((v) => (typeof v === 'number' ? formatNumber(v) : String(v)));
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
}

export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

export function times(n) {
  return n === 1 ? '1 time' : `${n} times`;
}
