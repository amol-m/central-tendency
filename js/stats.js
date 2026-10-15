// Pure calculation helpers shared by the lessons, demos and tests.
// None of these functions modify the array they are given.

/** Returns { value, sum, count }, or null when there are no values. */
export function mean(values) {
  if (values.length === 0) return null;
  const sum = values.reduce((total, v) => total + v, 0);
  return { value: sum / values.length, sum, count: values.length };
}

/** Returns { value, sorted, middleIndexes }, or null when there are no values. */
export function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  if (n % 2 === 1) {
    return { value: sorted[mid], sorted, middleIndexes: [mid] };
  }
  return {
    value: (sorted[mid - 1] + sorted[mid]) / 2,
    sorted,
    middleIndexes: [mid - 1, mid],
  };
}

/** Counts how often each value appears, in order of first appearance. */
export function frequencies(values) {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return counts;
}

/**
 * Returns { values, frequency } listing every most-frequent value (sorted),
 * { values: [], frequency } when every value appears equally often (no mode),
 * or null when there are no values. A list where every value is the same has
 * that value as its mode.
 */
export function modes(values) {
  if (values.length === 0) return null;
  const counts = frequencies(values);
  const highest = Math.max(...counts.values());
  const top = [...counts.keys()].filter((k) => counts.get(k) === highest);
  if (counts.size > 1 && top.length === counts.size) {
    return { values: [], frequency: highest };
  }
  const sortedTop = top.every((k) => typeof k === 'number')
    ? top.sort((a, b) => a - b)
    : top;
  return { values: sortedTop, frequency: highest };
}

/** Rounds to at most 2 decimal places and drops trailing zeros. */
export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '–';
  const rounded = Math.round(n * 100) / 100;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}
