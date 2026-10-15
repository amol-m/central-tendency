import { median, formatNumber } from '../stats.js';
import { randomInt } from './util.js';

const GAP = 8;

export function initLineup(root) {
  const track = root.querySelector('.lineup-track');
  const countSelect = root.querySelector('.lineup-count');
  const sortButton = root.querySelector('.lineup-sort');
  const result = root.querySelector('.lineup-result');

  let cards = []; // { value, el }

  function newNumbers() {
    const count = Number(countSelect.value);
    track.replaceChildren();
    cards = Array.from({ length: count }, () => {
      const value = randomInt(1, 30);
      const card = document.createElement('div');
      card.className = 'lineup-card';
      card.setAttribute('role', 'listitem');
      card.dataset.value = value;
      card.textContent = value;
      track.append(card);
      return { value, el: card };
    });
    sortButton.disabled = false;
    result.textContent = 'Not sorted yet. Can you guess the median?';
    layout(cards);
  }

  function layout(order) {
    const n = order.length;
    const width = track.clientWidth || 600;
    const size = Math.min(72, (width - GAP * (n - 1)) / n);
    order.forEach((card, i) => {
      card.el.style.width = `${size}px`;
      card.el.style.transform = `translateX(${i * (size + GAP)}px)`;
    });
  }

  function sort() {
    const values = cards.map((c) => c.value);
    const med = median(values);
    // Stable sort keeps equal values in their original left-to-right order.
    const order = cards.map((c, i) => ({ ...c, i })).sort((a, b) => a.value - b.value || a.i - b.i);
    layout(order);
    order.forEach((c, i) => c.el.classList.toggle('middle', med.middleIndexes.includes(i)));
    // Re-order the DOM too, so screen readers hear the sorted list.
    order.forEach((c) => track.append(c.el));
    cards = order.map(({ value, el }) => ({ value, el }));
    sortButton.disabled = true;

    const [a, b] = med.middleIndexes.map((i) => med.sorted[i]);
    result.textContent = b === undefined
      ? `${values.length} cards, so the middle is card ${med.middleIndexes[0] + 1}. The median is ${a}.`
      : `${values.length} cards, so there are two middle cards: ${a} and ${b}. The median is (${a} + ${b}) ÷ 2 = ${formatNumber(med.value)}.`;
  }

  root.querySelector('.lineup-new').addEventListener('click', newNumbers);
  countSelect.addEventListener('change', newNumbers);
  sortButton.addEventListener('click', sort);
  window.addEventListener('resize', () => layout(cards));

  newNumbers();
}
