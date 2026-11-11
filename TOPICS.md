# Algorithms: topic-based lecture companion

The root `index.html` is the **course-level topic hub**. It must not become a single-topic page again.

## Structure
- `index.html` + `site.css`: course homepage and topic catalog.
- `topics/greedy.html`: complete Greedy Algorithms content migrated intact from the original site; it uses `learning.css`, `learning.js`, and `topic-shell.css`.
- `topics/_template.html`: starting point for each **new** topic page.
- `learning.js`: progressive learning path specific to Greedy Algorithms. Do not include it in unrelated topic pages until the logic is made configurable.

## Adding a topic
1. Copy `topics/_template.html` to `topics/<topic-slug>.html`.
2. Adapt the goals, worked examples, interactive activities, hints, and worked solutions to the actual lecture.
3. Add a normal link card to `index.html` only when the topic has finished, reviewed material.
4. If a proposed topic is not in the course syllabus, remove or rename its placeholder in `index.html`.
5. Update any topic count on the homepage after adding/removing topics.

## Editorial principles
- The site is a companion to the lecture, not a self-paced replacement course.
- Preserve technical accuracy and mathematical assumptions.
- Interactive choices should elicit predictions and reasoning, not just clicks.
- Show solutions progressively; keep counterexamples separate from proofs.
- All topic pages include an accessible link back to the hub.

The five proposed homepage slots (Divide and Conquer, Dynamic Programming,
Sorting and Searching, Graph Algorithms, Algorithm Analysis) are **unconfirmed**.
They do not indicate the official course syllabus and have no active links.
