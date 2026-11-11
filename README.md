# Algorithms course site

Public source of the Algorithms course website of Elina Benenson Opalinsky,
served by GitHub Pages.

## What's here

**Greedy Algorithms.** Lecture notes and interactive exercises. Based on slides by
Prof. Dana Shapira and Dr Igor Nor.

- `index.html` - the working page. Self-contained (no build, no server):
  open it in any browser and everything runs, including the exercises.
- `src/` - the editable authoring source.

## The page

Notes: what a greedy algorithm is, coin change, fractional knapsack,
integer knapsack, activity selection with the optimality proof, where
greedy fails (weighted activity selection, heaviest path, deadlines),
and four practice exercises (refueling, polynomial coefficients,
Reuben's kiosk, train platforms).

Interactive exercises (all checks run in the browser, no server, no AI):

1. **Same knapsack, two games** - fill the knapsack fractionally and with
   whole items on the same example; the feedback shows where the
   highest-ratio rule works and where it fails.
2. **Build the greedy schedule**, in three modes:
   - Guided - click the activity the greedy algorithm takes next.
   - Free play - build any compatible schedule, then check whether it is
     optimal (different valid optima are accepted).
   - Pseudocode steps - walk through Greedy-Activity-Selector one line at
     a time, with A, j and i shown on the timeline.

## Status

Live at https://argeliben77.github.io/algorithms-course-site/ - public site,
served by GitHub Pages from this repository (branch `main`, root).
