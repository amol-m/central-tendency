# Spec Delta

## Purpose

Defines the hands-on demos and quiz that let students change data themselves and see how mean, median and mode respond.

## ADDED Requirements

### Requirement: Dot-plot playground
The site SHALL provide a dot plot on a number line from 0 to 20 that starts with a sample data set and shows markers for the current mean, median and mode.

#### Scenario: Initial state
- **WHEN** the playground first loads
- **THEN** it shows the sample values as dots, and the mean, median and mode values and markers match the sample

### Requirement: Editing playground data
Students SHALL be able to add a value by clicking or tapping the number line, move a value by dragging its dot, and remove a value, and the mean, median and mode SHALL update immediately after each change.

#### Scenario: Add a value
- **WHEN** a student clicks the number line at 12
- **THEN** a dot appears at 12 and all three measures update

#### Scenario: Drag a value
- **WHEN** a student drags a dot from 3 to 15
- **THEN** the dot snaps to whole numbers while moving and the measures update as it moves

#### Scenario: Remove a value
- **WHEN** a student double-clicks a dot or selects it and presses Delete
- **THEN** the dot is removed and the measures update

#### Scenario: Value limit
- **WHEN** the playground already has 25 values and the student tries to add another
- **THEN** no value is added and a message explains the limit

### Requirement: Playground controls
The playground SHALL offer buttons to load a new random data set, reset to the sample data and clear all values.

#### Scenario: Clear all values
- **WHEN** a student presses "Clear"
- **THEN** no dots remain and the measures show the empty-data state

### Requirement: Showing the working
The playground SHALL show the calculation behind each measure: the sum and count for the mean, the sorted list with the middle highlighted for the median, and the frequencies for the mode.

#### Scenario: Working updates with data
- **WHEN** the values are 2, 4, 4, 5, 10
- **THEN** the working shows "25 ÷ 5 = 5", the sorted list with 4 highlighted as the middle, and that 4 appears twice

### Requirement: Median line-up
The site SHALL provide a median demo that shows an unsorted row of values, sorts them into order when the student presses a button, and then highlights the middle value or the two middle values.

#### Scenario: Line-up with even count
- **WHEN** the line-up has 6 values and the student presses "Sort"
- **THEN** the values move into order, the two middle values are highlighted and the median is shown as their mean

#### Scenario: Shuffle
- **WHEN** the student presses "New numbers"
- **THEN** a new unsorted row appears and the median result is hidden until the student sorts again

### Requirement: Mode tally
The site SHALL provide a mode demo where students add values from a fixed set of categories (including non-numeric ones such as favourite fruit) and see a live frequency bar chart with the tallest bar or bars marked as the mode.

#### Scenario: Tie for mode
- **WHEN** two categories have the same highest count
- **THEN** both bars are marked as modes

#### Scenario: Reset tally
- **WHEN** the student presses "Reset"
- **THEN** all counts return to zero and no mode is shown

### Requirement: Outlier explorer
The site SHALL provide a demo with a fixed small data set plus one adjustable value controlled by a slider from 0 to 100, showing the mean and median side by side as the slider moves.

#### Scenario: Outlier pulls the mean
- **WHEN** the student moves the adjustable value from the middle of the data to 100
- **THEN** the mean changes noticeably while the median changes by at most one step, and a short caption explains why

### Requirement: Which-average quiz
The site SHALL provide a quiz of at least 5 questions, each either a calculation or a choice of the best measure for a situation, giving immediate feedback with an explanation and a running score.

#### Scenario: Correct answer
- **WHEN** a student chooses the correct option
- **THEN** the option is marked correct, an explanation is shown and the score increases by one

#### Scenario: Wrong answer
- **WHEN** a student chooses a wrong option
- **THEN** their choice is marked wrong, the correct option is revealed, an explanation is shown and the score does not change

#### Scenario: Answer locked
- **WHEN** a student has answered a question
- **THEN** they cannot change that answer, and a "Try again" control lets them restart the quiz
