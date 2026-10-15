# Tasks

## 1. Project setup

- [ ] 1.1 Add `package.json` with `test` (node unit tests) and `test:e2e` (Playwright) scripts, `.gitignore`, and Playwright config; verify `npm install` succeeds
- [ ] 1.2 Add `index.html` skeleton with sections and navigation for intro, mean, median, mode, choosing, quiz, plus `css/styles.css` with light and dark tokens; verify the page opens from a local server with no console errors

## 2. Calculations

- [ ] 2.1 Implement `js/stats.js` (`mean`, `median`, `modes`, `frequencies`, `formatNumber`) per `specs/stats-calculations`; verify every scenario has a passing case in `tests/unit/stats.test.js`

## 3. Lessons

- [ ] 3.1 Write the introduction, mean, median and mode lessons with worked examples and the memory aid per `specs/concept-lessons`; verify `tests/unit/lessons.test.js` confirms each worked example matches `stats.js`
- [ ] 3.2 Write the "which average should I use?" comparison; verify it lists a strength, weakness and example for each measure

## 4. Demos

- [ ] 4.1 Build the dot-plot playground (add, drag, keyboard move, remove, random, reset, clear, 25-value limit, working shown); verify with `tests/e2e/playground.spec.js`
- [ ] 4.2 Build the median line-up (sort animation, middle highlight, new numbers); verify with `tests/e2e/lineup.spec.js`
- [ ] 4.3 Build the mode tally with categories and bar chart; verify ties and reset in `tests/e2e/tally.spec.js`
- [ ] 4.4 Build the outlier explorer slider; verify the mean/median behaviour in `tests/e2e/outlier.spec.js`
- [ ] 4.5 Build the quiz with feedback, score, locking and "Try again"; verify with `tests/e2e/quiz.spec.js`

## 5. Site-wide checks

- [ ] 5.1 Verify navigation, no horizontal scroll at 360px, dark mode, and that no request leaves the local origin, in `tests/e2e/site.spec.js`
- [ ] 5.2 Write `README.md` covering how to run locally, run tests, and publish on GitHub Pages; verify the documented commands run as written

## Workflow follow-up

- Archive the change with `openspec archive add-central-tendency-site` once the site is merged, so the specs move into `openspec/specs/`.
