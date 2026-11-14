# Algorithms 8500016 — lecture companion

This is a **multi-topic website**, not a single-page Greedy Algorithms site. The site follows the syllabus file **אלגוריתמים.pdf (תשפ"ז, סמסטר א)** supplied by the lecturer.

## Course-level navigation

The root `index.html` is the Algorithms homepage. It displays **four official syllabus subject areas**:

1. **Algorithmic paradigms**: Greedy Algorithms, Divide and Conquer, Dynamic Programming.
2. **Graph algorithms**: Graph representations and BFS/DFS; topological sorting; strongly connected components; minimum spanning trees; shortest paths (single-source and all-pairs).
3. **String matching**: KMP, Rabin–Karp, indexing methods.
4. **Network flows**: Network flow, minimum cuts, matching, reductions to the flow problem.

The homepage groups these 15 items into topical cards as a **website design choice**; the syllabus does not prescribe one separate page per item or the exact breakdown of the cards.

**Only Greedy Algorithms is live within this draft.** The other cards are plain, unlinked placeholders marked "Coming later"; they must not imply completed content.

## Files

- `index.html`, `site.css`: multi-topic course homepage.
- `topics/greedy.html`: interactive Greedy Algorithms unit with the existing games and exercises.
- `learning.js`, `learning.css`: **Greedy-specific** guided units and progress; do not attach to unrelated pages without first generalizing.
- `topic-shell.css`: shared breadcrumb style.
- `topics/_template.html`: template for future subject pages.

## Adding another topic page

1. Confirm the precise subtopic, outline, examples, and algorithms with the lecturer's lecture materials.
2. Copy `topics/_template.html` to `topics/<slug>.html` and author a full page.
3. Include definitions, examples, correctness reasoning, complexity, interactive activity when useful, practice and progressive hints.
4. Replace the matching homepage placeholder `<article>` with a valid `<a href="topics/<slug>.html">` card, and update availability labels and counts.
5. Check keyboard navigation, phone layout, accessible content, internal links and calculations before publishing.

## Teaching intent

- A **lecture companion**, not a replacement for the lecturer or a full LMS.
- Encourage prediction, experimentation, justification and transfer to new problems.
- Show assumptions and complexity clearly. Distinguish working examples from formal proofs.
- Keep public site updates behind review. Do not publish unreviewed syllabus changes.
