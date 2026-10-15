# Spec Delta

## Purpose

Defines how the site turns a list of numbers into its mean, median and mode, so every lesson and demo shows the same, correct answers.

## ADDED Requirements

### Requirement: Mean calculation
The system SHALL compute the mean as the sum of the values divided by how many values there are, and SHALL report the sum and count used.

#### Scenario: Mean of whole numbers
- **WHEN** the values are 2, 4, 4, 5, 10
- **THEN** the mean is 5, the sum is 25 and the count is 5

#### Scenario: Mean that is not a whole number
- **WHEN** the values are 1, 2, 2
- **THEN** the mean is 5/3 and is displayed rounded to at most 2 decimal places (1.67)

### Requirement: Median calculation
The system SHALL compute the median by sorting the values from smallest to largest and taking the middle value, or the mean of the two middle values when the count is even.

#### Scenario: Odd number of values
- **WHEN** the values are 9, 1, 5
- **THEN** the sorted list is 1, 5, 9 and the median is 5

#### Scenario: Even number of values
- **WHEN** the values are 8, 2, 4, 6
- **THEN** the sorted list is 2, 4, 6, 8, the two middle values are 4 and 6, and the median is 5

### Requirement: Mode calculation
The system SHALL report every value that appears most often, and SHALL report that there is no mode when every value appears the same number of times.

#### Scenario: Single mode
- **WHEN** the values are 3, 7, 7, 2
- **THEN** the mode is 7 with a frequency of 2

#### Scenario: More than one mode
- **WHEN** the values are 1, 1, 4, 4, 6
- **THEN** the modes are 1 and 4, each with a frequency of 2

#### Scenario: No mode
- **WHEN** the values are 2, 5, 8
- **THEN** the system reports that there is no mode

#### Scenario: All values equal
- **WHEN** the values are 6, 6, 6
- **THEN** the mode is 6

### Requirement: Empty data
The system SHALL report mean, median and mode as unavailable when there are no values, instead of showing a number or an error.

#### Scenario: No values
- **WHEN** the list of values is empty
- **THEN** mean, median and mode are each reported as unavailable and the display shows a dash with a prompt to add values

### Requirement: Input is not modified
The system SHALL compute every measure without changing the order or contents of the list it was given.

#### Scenario: Original order kept
- **WHEN** the median of 9, 1, 5 is computed
- **THEN** the original list is still 9, 1, 5 afterwards
