import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mean, median, modes, formatNumber } from '../../js/stats.js';

// Every worked example in index.html carries data-check/data-values/data-expect
// attributes, so the printed answers can be checked against stats.js.
const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const examples = [...html.matchAll(/data-check="(\w+)" data-values="([^"]+)" data-expect="([^"]+)"/g)]
  .map(([, kind, values, expect]) => ({ kind, values: values.split(',').map(Number), expect }));

test('the page has worked examples for every measure', () => {
  const kinds = new Set(examples.map((e) => e.kind));
  assert.deepEqual([...kinds].sort(), ['mean', 'median', 'mode']);
  assert.ok(examples.some((e) => e.kind === 'median' && e.values.length % 2 === 0), 'needs an even-count median example');
  assert.ok(examples.some((e) => e.kind === 'mode' && e.expect === 'none'), 'needs a no-mode example');
  assert.ok(examples.some((e) => e.kind === 'mode' && e.expect.includes(',')), 'needs a multi-mode example');
});

for (const { kind, values, expect } of examples) {
  test(`${kind} of ${values.join(', ')} is ${expect}`, () => {
    if (kind === 'mean') assert.equal(formatNumber(mean(values).value), expect);
    if (kind === 'median') assert.equal(formatNumber(median(values).value), expect);
    if (kind === 'mode') {
      const found = modes(values).values;
      assert.equal(found.length ? found.join(',') : 'none', expect);
    }
  });
}

test('the comparison lists a strength, weakness and example for each measure', () => {
  for (const kind of ['mean', 'median', 'mode']) {
    const card = html.match(new RegExp(`<article class="compare-card ${kind}">([\\s\\S]*?)</article>`))?.[1] ?? '';
    for (const label of ['Good at:', 'Watch out:', 'Use it for:']) assert.ok(card.includes(label), `${kind} card missing ${label}`);
  }
});
