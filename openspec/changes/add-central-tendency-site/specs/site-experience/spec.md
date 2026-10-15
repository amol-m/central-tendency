# Spec Delta

## Purpose

Defines site-wide qualities that every page section must meet: navigation, phone support, accessibility and hosting without a build or network.

## ADDED Requirements

### Requirement: Section navigation
The site SHALL provide navigation links to every lesson and demo section.

#### Scenario: Jump to a section
- **WHEN** a student selects "Mode" in the navigation
- **THEN** the page scrolls to the mode section

### Requirement: Works on phones and tablets
The site SHALL be usable at widths from 320 pixels upward with no horizontal page scrolling, and every demo SHALL work with touch input.

#### Scenario: Narrow screen
- **WHEN** the site is viewed at 360 pixels wide
- **THEN** the content fits the screen width and the demos remain usable

### Requirement: Keyboard and screen-reader access
Every interactive control SHALL be reachable and operable with the keyboard, and the current mean, median and mode in each demo SHALL be announced to screen readers when they change.

#### Scenario: Keyboard-only playground
- **WHEN** a student focuses a dot and presses the left or right arrow key
- **THEN** the value moves by one and the measures update

#### Scenario: Live results
- **WHEN** a measure changes in a demo
- **THEN** the new value is placed in a polite live region

### Requirement: Readable in light and dark mode
The site SHALL follow the device's light or dark colour preference and keep text contrast at WCAG AA level in both.

#### Scenario: Dark mode
- **WHEN** the device prefers a dark colour scheme
- **THEN** the site uses dark backgrounds with light text

### Requirement: Static hosting with no network
The site SHALL run from static files with no build step and SHALL NOT request anything from other domains, so it works on GitHub Pages and from a local server without an internet connection.

#### Scenario: Offline load
- **WHEN** the site is served from a local folder with no internet connection
- **THEN** all lessons and demos load and work
