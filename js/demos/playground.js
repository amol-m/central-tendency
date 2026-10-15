import { mean, median, modes, formatNumber } from '../stats.js';
import { listWords, randomInt, times } from './util.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const MIN = 0;
const MAX = 20;
const MAX_VALUES = 25;
const SAMPLE = [2, 4, 4, 5, 10];

// Plot geometry, in viewBox units. The viewBox width follows the element's
// width (between 340 and 640) so dots and labels stay a usable size on phones.
const HEIGHT = 250;
const X0 = 30;
let width = 640;
let X1 = width - 30;
const AXIS_Y = 165;
const STACK_HEIGHT = 140;
const DOUBLE_TAP_MS = 350;

const xFor = (v) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);
const clamp = (v) => Math.min(MAX, Math.max(MIN, v));

function svg(tag, attrs = {}, text) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

export function initPlayground(root) {
  const plot = root.querySelector('.dotplot');
  const out = {
    mean: root.querySelector('.pg-mean'),
    median: root.querySelector('.pg-median'),
    mode: root.querySelector('.pg-mode'),
    workMean: root.querySelector('.pg-work-mean'),
    workMedian: root.querySelector('.pg-work-median'),
    workMode: root.querySelector('.pg-work-mode'),
    message: root.querySelector('.pg-message'),
    live: root.querySelector('.pg-live'),
    remove: root.querySelector('.pg-remove'),
  };

  let nextId = 1;
  let points = [];
  let selectedId = null;
  let drag = null; // { id, pointerId }
  let lastTap = { id: null, time: 0 };
  let liveTimer;

  const values = () => points.map((p) => p.value);
  const setData = (list) => {
    points = list.map((value) => ({ id: nextId++, value }));
    selectedId = null;
    say('');
    render();
  };
  const say = (text) => { out.message.textContent = text; };

  function addValue(value) {
    if (points.length >= MAX_VALUES) {
      say(`That's the limit of ${MAX_VALUES} values. Remove one to add another.`);
      return;
    }
    say('');
    const point = { id: nextId++, value: clamp(value) };
    points.push(point);
    selectedId = point.id;
    render();
  }

  function removePoint(id, { keepFocus = false } = {}) {
    const ordered = sortedPoints();
    const index = ordered.findIndex((p) => p.id === id);
    if (index === -1) return;
    points = points.filter((p) => p.id !== id);
    const neighbour = ordered[index + 1] ?? ordered[index - 1];
    selectedId = keepFocus && neighbour && neighbour.id !== id ? neighbour.id : null;
    say('');
    render({ focusId: keepFocus ? selectedId : null });
    if (keepFocus && selectedId === null) plot.focus();
  }

  function movePoint(id, value) {
    const point = points.find((p) => p.id === id);
    if (!point || point.value === clamp(value)) return;
    point.value = clamp(value);
    render({ focusId: document.activeElement?.dataset?.id ? id : null });
  }

  const sortedPoints = () => [...points].sort((a, b) => a.value - b.value || a.id - b.id);

  function valueAtClientX(clientX) {
    const matrix = plot.getScreenCTM();
    if (!matrix) return MIN;
    const p = new DOMPoint(clientX, 0).matrixTransform(matrix.inverse());
    return clamp(Math.round(MIN + ((p.x - X0) / (X1 - X0)) * (MAX - MIN)));
  }

  // ── Pointer input: one code path for mouse, pen and touch ──
  plot.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const group = event.target.closest('.dot-group');
    if (!group) {
      addValue(valueAtClientX(event.clientX));
      return;
    }
    const id = Number(group.dataset.id);
    const now = performance.now();
    if (lastTap.id === id && now - lastTap.time < DOUBLE_TAP_MS) {
      lastTap = { id: null, time: 0 };
      removePoint(id);
      return;
    }
    lastTap = { id, time: now };
    selectedId = id;
    drag = { id, pointerId: event.pointerId };
    plot.setPointerCapture(event.pointerId);
    render({ focusId: id });
  });

  plot.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const value = valueAtClientX(event.clientX);
    const point = points.find((p) => p.id === drag.id);
    if (point && point.value !== value) {
      lastTap = { id: null, time: 0 };
      point.value = value;
      render({ focusId: drag.id });
    }
  });

  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag = null;
    render({ focusId: selectedId });
  };
  plot.addEventListener('pointerup', endDrag);
  plot.addEventListener('pointercancel', endDrag);

  // ── Keyboard input on a focused dot ──
  plot.addEventListener('keydown', (event) => {
    const group = event.target.closest?.('.dot-group');
    if (!group) return;
    const id = Number(group.dataset.id);
    const point = points.find((p) => p.id === id);
    const keys = {
      ArrowLeft: point.value - 1, ArrowDown: point.value - 1,
      ArrowRight: point.value + 1, ArrowUp: point.value + 1,
      Home: MIN, End: MAX,
    };
    if (event.key in keys) {
      event.preventDefault();
      selectedId = id;
      movePoint(id, keys[event.key]);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      removePoint(id, { keepFocus: true });
    }
  });
  plot.addEventListener('focusin', (event) => {
    const group = event.target.closest('.dot-group');
    if (group && Number(group.dataset.id) !== selectedId) {
      selectedId = Number(group.dataset.id);
      updateSelection();
    }
  });

  root.querySelector('.pg-random').addEventListener('click', () => setData(randomData()));
  root.querySelector('.pg-reset').addEventListener('click', () => setData(SAMPLE));
  root.querySelector('.pg-clear').addEventListener('click', () => setData([]));
  out.remove.addEventListener('click', () => {
    if (selectedId !== null) removePoint(selectedId);
  });

  function updateSelection() {
    for (const g of plot.querySelectorAll('.dot-group')) {
      g.classList.toggle('selected', Number(g.dataset.id) === selectedId);
    }
    out.remove.disabled = selectedId === null;
  }

  // ── Drawing ──
  function render({ focusId = null } = {}) {
    const vals = values();
    const m = mean(vals);
    const med = median(vals);
    const mo = modes(vals);
    const modeSet = new Set(mo?.values ?? []);

    width = Math.round(Math.min(640, Math.max(340, plot.clientWidth || 640)));
    X1 = width - 30;
    plot.setAttribute('viewBox', `0 0 ${width} ${HEIGHT}`);
    plot.replaceChildren();
    plot.append(svg('rect', { x: 0, y: 0, width, height: HEIGHT, fill: 'transparent' }));
    const unit = (X1 - X0) / (MAX - MIN);
    const labelEvery = unit >= 24 ? 1 : unit >= 14 ? 2 : 5;

    // Number line
    plot.append(svg('line', { class: 'axis', x1: X0 - 10, y1: AXIS_Y, x2: X1 + 10, y2: AXIS_Y }));
    for (let v = MIN; v <= MAX; v++) {
      const x = xFor(v);
      plot.append(svg('line', { class: 'tick', x1: x, y1: AXIS_Y, x2: x, y2: AXIS_Y + (v % 5 === 0 ? 9 : 5) }));
      if (v % labelEvery === 0) plot.append(svg('text', { class: 'tick-label', x, y: AXIS_Y + 24 }, String(v)));
    }

    if (vals.length === 0) {
      plot.append(svg('text', { class: 'empty-hint', x: width / 2, y: 90 }, 'Tap the number line to add values'));
    }

    // Mean and median marker lines sit behind the dots.
    const markers = [];
    if (m) markers.push({ kind: 'mean', value: m.value, label: `mean ${formatNumber(m.value)}` });
    if (med) markers.push({ kind: 'median', value: med.value, label: `median ${formatNumber(med.value)}` });
    markers.forEach((mk, i) => {
      const x = xFor(mk.value);
      const pillY = AXIS_Y + 34 + i * 26;
      plot.append(svg('line', { class: `marker-line ${mk.kind}`, x1: x, y1: 14, x2: x, y2: pillY }));
      const pillWidth = mk.label.length * 7.4 + 16;
      const px = Math.min(width - pillWidth - 2, Math.max(2, x - pillWidth / 2));
      plot.append(svg('rect', { class: `marker-pill ${mk.kind}`, x: px, y: pillY, width: pillWidth, height: 22, rx: 11 }));
      plot.append(svg('text', { class: 'marker-text', x: px + pillWidth / 2, y: pillY + 15.5 }, mk.label));
    });

    // Dots, stacked so repeated values pile up.
    const ordered = sortedPoints();
    const stackSize = new Map();
    for (const p of ordered) stackSize.set(p.value, (stackSize.get(p.value) ?? 0) + 1);
    const tallest = Math.max(1, ...stackSize.values());
    const step = Math.min(24, STACK_HEIGHT / tallest);
    const radius = Math.min(10, step / 2 - 1);
    const level = new Map();
    for (const p of ordered) {
      const k = level.get(p.value) ?? 0;
      level.set(p.value, k + 1);
      const cx = xFor(p.value);
      const cy = AXIS_Y - 4 - step / 2 - k * step;
      const group = svg('g', {
        class: `dot-group${p.id === selectedId ? ' selected' : ''}${drag?.id === p.id ? ' dragging' : ''}`,
        tabindex: '0',
        role: 'slider',
        'aria-label': 'Data value',
        'aria-valuemin': MIN,
        'aria-valuemax': MAX,
        'aria-valuenow': p.value,
        'data-id': p.id,
        'data-value': p.value,
      });
      group.append(svg('circle', { class: 'hit', cx, cy, r: Math.max(radius + 6, 14) }));
      group.append(svg('circle', { class: `dot${modeSet.has(p.value) ? ' is-mode' : ''}`, cx, cy, r: radius }));
      plot.append(group);
    }
    for (const v of modeSet) {
      const top = AXIS_Y - 4 - stackSize.get(v) * step;
      plot.append(svg('text', { class: 'mode-label', x: xFor(v), y: Math.max(12, top - 6) }, 'mode'));
    }

    if (focusId !== null) plot.querySelector(`.dot-group[data-id="${focusId}"]`)?.focus({ preventScroll: true });
    updateSelection();
    showResults(m, med, mo);
  }

  function showResults(m, med, mo) {
    const modeText = !mo ? '–' : mo.values.length === 0 ? 'None' : listWords(mo.values);
    out.mean.textContent = m ? formatNumber(m.value) : '–';
    out.median.textContent = med ? formatNumber(med.value) : '–';
    out.mode.textContent = modeText;

    if (!m) {
      const hint = '<p>Add some values to see the working.</p>';
      out.workMean.innerHTML = hint;
      out.workMedian.innerHTML = hint;
      out.workMode.innerHTML = hint;
    } else {
      const sorted = med.sorted;
      const rounded = formatNumber(m.value) !== String(m.value);
      out.workMean.innerHTML = '';
      out.workMean.append(
        para(`${values().join(' + ')} = ${m.sum}`),
        para(`${m.sum} ÷ ${m.count} = ${formatNumber(m.value)}${rounded ? ' (rounded)' : ''}`),
      );

      const chips = document.createElement('div');
      chips.className = 'chips';
      sorted.forEach((v, i) => {
        const chip = document.createElement('span');
        chip.className = `chip${med.middleIndexes.includes(i) ? ' middle' : ''}`;
        chip.textContent = v;
        chips.append(chip);
      });
      const [a, b] = med.middleIndexes.map((i) => sorted[i]);
      out.workMedian.replaceChildren(
        chips,
        para(b === undefined
          ? `The middle value is ${a}.`
          : `Two middle values, ${a} and ${b}, so (${a} + ${b}) ÷ 2 = ${formatNumber(med.value)}.`),
      );

      out.workMode.replaceChildren(para(
        mo.values.length === 0
          ? `No mode: every value appears ${times(mo.frequency)}.`
          : mo.values.length === 1
            ? `${mo.values[0]} appears ${times(mo.frequency)}, more than any other value.`
            : `${listWords(mo.values)} each appear ${times(mo.frequency)}, so there are ${mo.values.length} modes.`,
      ));
    }

    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => {
      out.live.textContent = m
        ? `Mean ${formatNumber(m.value)}, median ${formatNumber(med.value)}, mode ${modeText === 'None' ? 'none' : modeText}.`
        : 'No values. Mean, median and mode are not available.';
    }, 400);
  }

  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => render());
  });

  setData(SAMPLE);
}

function para(text) {
  const p = document.createElement('p');
  p.textContent = text;
  return p;
}

function randomData() {
  const centre = randomInt(5, 15);
  const count = randomInt(7, 12);
  return Array.from({ length: count }, () => {
    const wobble = (Math.random() + Math.random() + Math.random() - 1.5) * 6;
    return clamp(Math.round(centre + wobble));
  });
}
