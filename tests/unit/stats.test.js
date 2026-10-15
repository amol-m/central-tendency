import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mean, median, modes, frequencies, formatNumber } from '../../js/stats.js';

test('mean of whole numbers reports sum and count', () => {
  assert.deepEqual(mean([2, 4, 4, 5, 10]), { value: 5, sum: 25, count: 5 });
});

test('mean that is not a whole number is shown to 2 decimal places', () => {
  const m = mean([1, 2, 2]);
  assert.equal(m.value, 5 / 3);
  assert.equal(formatNumber(m.value), '1.67');
});

test('median with an odd number of values', () => {
  const m = median([9, 1, 5]);
  assert.deepEqual(m.sorted, [1, 5, 9]);
  assert.equal(m.value, 5);
  assert.deepEqual(m.middleIndexes, [1]);
});

test('median with an even number of values averages the two middle values', () => {
  const m = median([8, 2, 4, 6]);
  assert.deepEqual(m.sorted, [2, 4, 6, 8]);
  assert.deepEqual(m.middleIndexes.map((i) => m.sorted[i]), [4, 6]);
  assert.equal(m.value, 5);
});

test('single mode', () => {
  assert.deepEqual(modes([3, 7, 7, 2]), { values: [7], frequency: 2 });
});

test('more than one mode', () => {
  assert.deepEqual(modes([1, 1, 4, 4, 6]), { values: [1, 4], frequency: 2 });
});

test('no mode when every value appears equally often', () => {
  assert.deepEqual(modes([2, 5, 8]).values, []);
  assert.deepEqual(modes([2, 2, 5, 5]).values, []);
});

test('all values equal gives that value as the mode', () => {
  assert.deepEqual(modes([6, 6, 6]), { values: [6], frequency: 3 });
});

test('mode works for words', () => {
  assert.deepEqual(modes(['apple', 'pear', 'apple']).values, ['apple']);
});

test('empty data reports every measure as unavailable', () => {
  assert.equal(mean([]), null);
  assert.equal(median([]), null);
  assert.equal(modes([]), null);
  assert.equal(formatNumber(null), '–');
});

test('input is not modified', () => {
  const values = [9, 1, 5];
  median(values);
  mean(values);
  modes(values);
  assert.deepEqual(values, [9, 1, 5]);
});

test('frequencies counts each value', () => {
  assert.deepEqual([...frequencies([4, 2, 4])], [[4, 2], [2, 1]]);
});

test('formatNumber drops trailing zeros', () => {
  assert.equal(formatNumber(5), '5');
  assert.equal(formatNumber(2.5), '2.5');
  assert.equal(formatNumber(2.004), '2');
});
