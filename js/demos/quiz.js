import { mean, median, modes, formatNumber } from '../stats.js';

// Calculation answers come from stats.js so the quiz can never disagree with the lessons.
const QUESTIONS = [
  {
    text: 'What is the mean of 3, 5, 7 and 9?',
    options: ['5', '6', '7', '24'],
    answer: formatNumber(mean([3, 5, 7, 9]).value),
    why: '3 + 5 + 7 + 9 = 24, and 24 ÷ 4 = 6.',
  },
  {
    text: 'What is the median of 8, 3, 5, 12, 1?',
    options: ['3', '5', '8', '5.8'],
    answer: formatNumber(median([8, 3, 5, 12, 1]).value),
    why: 'In order: 1, 3, 5, 8, 12. The middle value is 5. (5.8 is the mean.)',
  },
  {
    text: 'What is the mode of 2, 3, 3, 5, 7, 7, 7?',
    options: ['3', '5', '7', 'There is no mode'],
    answer: formatNumber(modes([2, 3, 3, 5, 7, 7, 7]).values[0]),
    why: '7 appears three times, more than any other value.',
  },
  {
    text: 'What is the median of 2, 4, 6, 8?',
    options: ['4', '5', '6', 'There is no median'],
    answer: formatNumber(median([2, 4, 6, 8]).value),
    why: 'There are two middle values, 4 and 6. Halfway between them is (4 + 6) ÷ 2 = 5.',
  },
  {
    text: 'A shoe shop wants to know which size to order the most of. Which average should it use?',
    options: ['Mean', 'Median', 'Mode'],
    answer: 'Mode',
    why: 'The mode is the size people buy most often. A mean size like 6.37 isn’t a shoe you can actually stock!',
  },
  {
    text: 'Five friends get £4, £5, £5, £6 and £80 pocket money. Which average best shows what a typical friend gets?',
    options: ['Mean', 'Median', 'Mode'],
    answer: 'Median',
    why: `The £80 is an outlier that pulls the mean up to £${formatNumber(mean([4, 5, 5, 6, 80]).value)}. The median, £5, shows what most friends really get.`,
  },
  {
    text: 'A teacher wants one number that uses every student’s test score, and the scores are all fairly close together. Which average fits best?',
    options: ['Mean', 'Median', 'Mode'],
    answer: 'Mean',
    why: 'The mean uses every score, and with no outliers nothing drags it off course.',
  },
];

export function initQuiz(root) {
  const list = root.querySelector('.quiz-list');
  const scoreOut = root.querySelector('.quiz-score');
  const finalOut = root.querySelector('.quiz-final');
  let score = 0;
  let answered = 0;

  function updateScore() {
    scoreOut.textContent = `Score: ${score} / ${answered}`;
    finalOut.textContent = answered === QUESTIONS.length
      ? `You got ${score} out of ${QUESTIONS.length}. ${score === QUESTIONS.length ? 'Perfect, you’re an averages expert!' : 'Press “Try again” to have another go.'}`
      : '';
  }

  function build() {
    score = 0;
    answered = 0;
    list.replaceChildren();
    QUESTIONS.forEach((q, qi) => {
      const item = document.createElement('li');
      item.className = 'quiz-q';
      const prompt = document.createElement('p');
      prompt.id = `quiz-q${qi}`;
      prompt.textContent = q.text;
      const options = document.createElement('div');
      options.className = 'quiz-options';
      options.setAttribute('role', 'group');
      options.setAttribute('aria-labelledby', prompt.id);
      const feedback = document.createElement('p');
      feedback.className = 'quiz-feedback';
      feedback.setAttribute('aria-live', 'polite');

      for (const option of q.options) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn quiz-option';
        button.textContent = option;
        button.addEventListener('click', () => {
          const buttons = [...options.children];
          buttons.forEach((b) => { b.disabled = true; });
          const correct = option === q.answer;
          button.classList.add(correct ? 'correct' : 'wrong');
          if (!correct) buttons.find((b) => b.textContent === q.answer).classList.add('correct');
          feedback.className = `quiz-feedback ${correct ? 'correct' : 'wrong'}`;
          feedback.textContent = `${correct ? 'Correct!' : `Not quite. The answer is ${q.answer}.`} ${q.why}`;
          answered += 1;
          if (correct) score += 1;
          updateScore();
        });
        options.append(button);
      }
      item.append(prompt, options, feedback);
      list.append(item);
    });
    updateScore();
  }

  root.querySelector('.quiz-retry').addEventListener('click', () => {
    build();
    list.querySelector('.quiz-option')?.focus();
  });
  build();
}
