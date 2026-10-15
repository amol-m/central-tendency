# Proposal

## Why

School students often memorise the formulas for mean, median and mode without understanding what each one tells them or when to use it. A short website where students can read a plain explanation and then move data around with their own hands makes the ideas concrete. This is the first change in an empty repository, so it sets up the site and the specs everything later builds on.

## What Changes

- Add a single-page static website aimed at students aged roughly 11 to 15 that explains central tendency.
- Add lesson sections for: what "average" means, the mean, the median, the mode, and choosing the right measure.
- Add interactive demos:
  - a dot-plot playground where students add, drag and remove values and watch the mean, median and mode move live;
  - a median line-up that sorts values step by step and points at the middle;
  - a mode tally that turns values into a frequency bar chart;
  - an outlier explorer that shows how one extreme value pulls the mean but barely moves the median;
  - a short "which average?" quiz with instant feedback.
- Add a small, tested calculation module that every demo uses for mean, median and mode.
- Make the site work without a build step or network access so it can be hosted on GitHub Pages or served from any simple local web server.

## Capabilities

### New Capabilities
- `stats-calculations`: how the site computes mean, median and mode from a list of numbers, including ties, even-sized lists and empty lists.
- `concept-lessons`: the explanatory content students read: definitions, worked examples and guidance on which measure to use.
- `interactive-demos`: the hands-on demos and quiz, and how they respond to student input.
- `site-experience`: navigation, responsiveness, accessibility and hosting constraints for the whole site.

### Modified Capabilities
- None.

## Impact

- New files: `index.html`, `css/`, `js/`, `tests/`, `package.json` (dev-only test tooling), `README.md`.
- No runtime dependencies or external services; the page loads only local files.
- Dev dependencies are used only to run tests.
