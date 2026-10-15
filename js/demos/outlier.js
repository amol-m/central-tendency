import { mean, median, formatNumber } from '../stats.js';

const FRIENDS = [4, 5, 5, 6, 7];
const MAX = 100;

export function initOutlier(root) {
  const slider = root.querySelector('.ol-slider');
  const valueOut = root.querySelector('.ol-value');
  const dots = root.querySelector('.ol-dots');
  const meanMarker = root.querySelector('.ol-marker.mean');
  const medianMarker = root.querySelector('.ol-marker.median');
  const meanOut = root.querySelector('.ol-mean');
  const medianOut = root.querySelector('.ol-median');
  const caption = root.querySelector('.ol-caption');
  const pct = (v) => `${(v / MAX) * 100}%`;

  function render() {
    const extra = Number(slider.value);
    const values = [...FRIENDS, extra];
    const m = mean(values).value;
    const med = median(values).value;

    valueOut.textContent = extra;
    dots.replaceChildren();
    for (const v of values) {
      const dot = document.createElement('span');
      dot.className = 'ol-dot';
      dot.style.left = pct(v);
      dots.append(dot);
    }
    dots.lastChild.classList.add('new');
    meanMarker.style.left = pct(m);
    medianMarker.style.left = pct(med);
    meanOut.textContent = `£${formatNumber(m)}`;
    medianOut.textContent = `£${formatNumber(med)}`;

    const gap = Math.abs(m - med);
    if (gap < 1) {
      caption.textContent = 'The new value fits in with the others, so the mean and median are close together.';
    } else if (gap < 5) {
      caption.textContent = 'The mean is starting to drift towards the new value, but the median stays put.';
    } else {
      caption.textContent = `The new value is an outlier. It drags the mean up to £${formatNumber(m)}, even though five of the six friends get £7 or less. The median only looks at the middle, so it barely moves.`;
    }
  }

  slider.addEventListener('input', render);
  render();
}
