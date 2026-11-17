# Algorithms course site

Public source of the Algorithms course website of Elina Benenson Opalinsky,
served by GitHub Pages.

## What's here

**Algorithms lecture companion.** A multi-topic homepage with two available units:
Greedy Algorithms and Dynamic Programming. Based on slides by
Prof. Dana Shapira and Dr Igor Nor.

- `index.html`, `site.css` - course topic navigation and shared visual style.
- `topics/greedy.html` - the original Greedy notes and activities.
- `topics/dynamic-programming.html` - DP notes, interactive tables,
  reconstruction, knowledge checks, and practice, based on the Unit 4 slides.
- `topics/dynamic-programming-core.js` - pure algorithms used by the DP explorers.
- `src/` - historical Greedy authoring source; it does not generate the current
  multi-topic site. Edit the static HTML/CSS/JS files directly.

No build or server is required for the student-facing files. Serve the repository
root with a static server or open `index.html` in a browser.

## Dynamic Programming

Fibonacci (bottom-up and memoization), binomial coefficients, Kadane's maximum
subarray, 0/1 knapsack, matrix-chain multiplication, and longest common subsequence.
Includes table walkthroughs, knapsack and LCS reconstruction, acceptance of
alternative optimal LCS answers, a staircase exercise with progressive hints,
and the lecture's bilingual glossary. Page language and layout remain English/LTR.
Progress is saved in browser-local storage when available.

Run algorithm checks with `node --test tests/dynamic-programming.test.cjs`.
They compare the implementations against exhaustive small-instance solutions.

## Greedy Algorithms

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
