import { modes } from '../stats.js';
import { listWords, randomInt } from './util.js';

const FRUITS = [
  { name: 'Apple', icon: '🍎' },
  { name: 'Banana', icon: '🍌' },
  { name: 'Grapes', icon: '🍇' },
  { name: 'Orange', icon: '🍊' },
  { name: 'Strawberry', icon: '🍓' },
];

export function initTally(root) {
  const buttons = root.querySelector('.tally-buttons');
  const chart = root.querySelector('.tally-chart');
  const result = root.querySelector('.tally-result');
  let votes = [];

  for (const fruit of FRUITS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn tally-add';
    button.dataset.fruit = fruit.name;
    button.textContent = `${fruit.icon} ${fruit.name}`;
    button.setAttribute('aria-label', `Add a vote for ${fruit.name}`);
    button.addEventListener('click', () => { votes.push(fruit.name); render(); });
    buttons.append(button);
  }

  root.querySelector('.tally-reset').addEventListener('click', () => { votes = []; render(); });
  root.querySelector('.tally-survey').addEventListener('click', () => {
    // Weighted so a survey usually has a clear winner, but ties can happen.
    const weights = FRUITS.map(() => randomInt(1, 6));
    const total = weights.reduce((a, b) => a + b, 0);
    votes = Array.from({ length: 20 }, () => {
      let r = Math.random() * total;
      return FRUITS[weights.findIndex((w) => (r -= w) < 0)].name;
    });
    render();
  });

  function render() {
    const counts = new Map(FRUITS.map((f) => [f.name, 0]));
    for (const v of votes) counts.set(v, counts.get(v) + 1);
    const highest = Math.max(1, ...counts.values());
    const mo = modes(votes);
    const modeSet = new Set(mo?.values ?? []);

    chart.replaceChildren();
    for (const fruit of FRUITS) {
      const count = counts.get(fruit.name);
      const row = document.createElement('div');
      row.className = `tally-row${modeSet.has(fruit.name) ? ' is-mode' : ''}`;
      row.dataset.fruit = fruit.name;
      row.innerHTML = `
        <span class="tally-name">${fruit.icon} ${fruit.name}</span>
        <span class="tally-bar-wrap"><span class="tally-bar" style="display:block;width:${(count / highest) * 100}%"></span></span>
        <span class="tally-count">${count}</span>`;
      chart.append(row);
    }
    chart.setAttribute('aria-label', `Votes: ${FRUITS.map((f) => `${f.name} ${counts.get(f.name)}`).join(', ')}`);

    if (!mo) {
      result.textContent = 'No votes yet, so there is no mode.';
    } else if (mo.values.length === 0) {
      result.textContent = 'Every fruit that got votes has the same number, so there is no mode yet.';
    } else if (mo.values.length === 1) {
      result.textContent = `Mode: ${mo.values[0]} (${mo.frequency} ${mo.frequency === 1 ? 'vote' : 'votes'}).`;
    } else {
      result.textContent = `It's a tie! The modes are ${listWords(mo.values)} (${mo.frequency} votes each).`;
    }
  }

  render();
}
