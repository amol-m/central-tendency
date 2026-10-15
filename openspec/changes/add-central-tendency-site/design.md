# Design

## Context

The repository is empty apart from OpenSpec. The site must run as static files on GitHub Pages and offline (see `specs/site-experience`). The audience is school students on school laptops, tablets and phones, so the page has to load fast and work with touch.

## Goals / Non-Goals

**Goals:**
- One readable page that a student can scroll from top to bottom like a lesson, with demos placed right after the idea they illustrate.
- One shared calculation module so lessons, demos and tests cannot disagree.
- Automated tests for the calculations and for each demo's observable behaviour.

**Non-Goals:**
- Accounts, saving progress, or teacher dashboards.
- Weighted mean, grouped data, range or other measures of spread.
- Translations (English only for now).

## Decisions

**Plain HTML, CSS and ES modules, no framework or bundler.** The demos are small and self-contained; a framework would add a build step and a dependency to keep updated for no real gain. Alternatives considered: React/Vite (needs a build and a Pages workflow), a single inline HTML file (harder to test the calculation code in isolation).

**`js/stats.js` holds pure functions** (`mean`, `median`, `modes`, `formatNumber`) with no DOM access, so Node's built-in test runner can test it directly. Each demo is its own module in `js/demos/` that imports `stats.js` and owns one section of the page, found by a `data-demo` attribute.

**Dot plot drawn with SVG and Pointer Events.** SVG scales cleanly at any width and gives each dot a real element that can take keyboard focus (`tabindex="0"`, `role="slider"` with `aria-valuenow`). Pointer Events cover mouse, pen and touch with one code path; `touch-action: none` on the plot stops the page scrolling while dragging. Canvas was rejected because it has no focusable elements.

**Stacking repeated values.** Dots with the same value stack vertically so frequency (and therefore the mode) is visible at a glance.

**Median line-up animates with CSS transforms.** Cards are positioned by `transform: translateX()` from their sorted index, so sorting is a transition rather than a re-render, and `prefers-reduced-motion` turns the animation off.

**Theming with CSS custom properties** defined on `:root` and redefined under `prefers-color-scheme: dark`, using system fonts so nothing is fetched from other domains.

**Testing.** `node --test` runs unit tests for `stats.js` and checks the worked-example numbers in the lessons match `stats.js`. Playwright (dev dependency only) runs end-to-end checks of each demo against a local static server, including one run at phone width and a check that no request leaves the local origin.

## Risks / Trade-offs

- [Dragging small dots on phones is fiddly] → Dots have a larger invisible hit area than their drawn size, and tapping a dot selects it so it can be removed with a visible button.
- [Floating-point results such as 1.6666…] → All displayed numbers go through one formatter that rounds to at most 2 decimal places and drops trailing zeros.
- [Playwright browser version drift in CI] → Tests use the installed Chromium when `PLAYWRIGHT_CHROMIUM_PATH` or `/opt/pw-browsers/chromium` exists, otherwise Playwright's own download.

## Migration Plan

Not applicable: first release. Deploy by enabling GitHub Pages on the default branch root.
