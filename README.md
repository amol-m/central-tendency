# What's typical? Mean, median and mode

An interactive website that teaches central tendency (mean, median and mode) to school students. Students read a short lesson for each measure, then try it with hands-on demos:

- **Playground**: add, drag and remove dots on a number line and watch the mean, median and mode move live, with the working shown.
- **Median line-up**: sort a row of number cards and find the middle.
- **Fruit survey**: vote for fruit and see the mode as the tallest bar.
- **Outlier explorer**: slide one value up to £100 and see the mean get dragged while the median stays put.
- **Quiz**: seven questions with instant feedback.

The site is plain HTML, CSS and JavaScript modules, with no build step and no requests to other websites.

## Run it locally

```bash
npm install
npm start
```

Then open http://localhost:8080. (Opening `index.html` straight from disk won't work, because browsers block JavaScript modules on `file://` pages. Any simple static server works.)

## Tests

```bash
npm test            # calculation and lesson-content checks (Node's test runner)
npm run test:e2e    # every demo in a real browser (Playwright)
```

If Playwright has no browser yet, run `npx playwright install chromium` once.

## Publish on GitHub Pages

In the repository on GitHub, go to **Settings → Pages**, set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, and save. The site appears at `https://<your-user>.github.io/<repo-name>/` after a minute or two.

## How this was built: OpenSpec

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) for spec-driven development: the behaviour is agreed in writing first, then built and tested against it.

- `openspec/changes/add-central-tendency-site/` holds the first change: `proposal.md` (why), `specs/` (what the site must do, as testable scenarios), `design.md` (how) and `tasks.md` (the build checklist).
- Each spec scenario has a matching test in `tests/`.
- Once this change is merged, run `openspec archive add-central-tendency-site` to move its specs into `openspec/specs/`, which then describe the site as it is.

To propose the next feature, run `openspec new change "<name>"` (or `/opsx:propose` in Claude Code), write the specs, then build against them. Check everything is well-formed with `npm run spec:validate`.

## Project layout

```
index.html            the whole site: lessons and demo markup
css/styles.css        styles, with light and dark colour themes
js/stats.js           mean, median and mode calculations (used everywhere)
js/demos/             one module per demo
tests/unit/           Node tests for stats.js and the worked examples
tests/e2e/            Playwright tests for every demo
openspec/             specs and change proposals
```
