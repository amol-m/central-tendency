import { initPlayground } from './demos/playground.js';
import { initLineup } from './demos/lineup.js';
import { initTally } from './demos/tally.js';
import { initOutlier } from './demos/outlier.js';
import { initQuiz } from './demos/quiz.js';

const demos = {
  playground: initPlayground,
  lineup: initLineup,
  tally: initTally,
  outlier: initOutlier,
  quiz: initQuiz,
};

for (const root of document.querySelectorAll('[data-demo]')) {
  demos[root.dataset.demo]?.(root);
}
