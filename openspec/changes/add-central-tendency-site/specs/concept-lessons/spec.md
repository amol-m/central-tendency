# Spec Delta

## Purpose

Defines the explanatory content of the site: what students read to understand each measure of central tendency and when to use it.

## ADDED Requirements

### Requirement: Introduction to averages
The site SHALL open with an introduction that explains, in language suitable for students aged about 11 to 15, that a measure of central tendency is one number that describes the "typical" or "middle" value of a data set, and SHALL name the three measures covered.

#### Scenario: Student starts reading
- **WHEN** a student opens the site
- **THEN** the first section explains what central tendency means and names mean, median and mode

### Requirement: Lesson for each measure
The site SHALL have a lesson section for each of mean, median and mode, each containing a one-sentence definition, the steps to find it, and a worked example with real-world context.

#### Scenario: Mean lesson
- **WHEN** a student reads the mean section
- **THEN** it defines the mean, lists the steps "add them up, then divide by how many", and works through an example

#### Scenario: Median lesson covers even counts
- **WHEN** a student reads the median section
- **THEN** it includes an example with an even number of values showing how the two middle values are averaged

#### Scenario: Mode lesson covers multiple and no modes
- **WHEN** a student reads the mode section
- **THEN** it explains that a data set can have one mode, more than one mode, or no mode

### Requirement: Memory aid
The site SHALL offer a short memory aid that helps students tell the three measures apart.

#### Scenario: Memory aid shown
- **WHEN** a student reaches the end of the three lessons
- **THEN** a memory aid is shown (for example "Median is in the middle like the median strip of a road; Mode is the most")

### Requirement: Choosing the right measure
The site SHALL explain when each measure is most useful, including that the median is less affected by outliers than the mean and that the mode works for non-numeric data.

#### Scenario: Comparison shown
- **WHEN** a student reads the "which average should I use?" section
- **THEN** they see a comparison of the three measures with a strength, a weakness and an example situation for each

### Requirement: Lesson numbers match calculations
Every worked example on the site SHALL show results that match the calculations defined in the stats-calculations capability.

#### Scenario: Worked example verified
- **WHEN** the worked example values are passed to the site's calculations
- **THEN** the results equal the numbers printed in the lesson
