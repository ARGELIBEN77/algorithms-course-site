/* Progressive enhancement for the Greedy Algorithms lecture companion. */
(() => {
  'use strict';

  const card = document.querySelector('.card');
  if (!card) return;
  const groups = Array.from(card.children).filter(node => node.classList.contains('group'));
  // Keep the original notes usable if the page structure changes.
  if (groups.length !== 11) return;

  const units = [
    {
      id: 'foundations', title: 'Greedy thinking', label: '1 · Foundations',
      summary: 'Formulate a local choice, then ask whether it leads to a global optimum.',
      goal: 'Explain the greedy-choice property and test a coin-changing strategy.',
      range: [0, 2],
      quiz: {
        question: 'What must be true to justify a greedy choice?',
        options: [
          'Every locally attractive choice is optimal.',
          'There is an optimal solution that includes the chosen local step.',
          'A greedy algorithm must examine every complete solution.'
        ],
        answer: 1,
        explanation: 'The greedy-choice property means we can make a particular locally optimal choice while still reaching a globally optimal solution. It must be justified for the problem.'
      }
    },
    {
      id: 'knapsack', title: 'Knapsack: when greedy works', label: '2 · Knapsack',
      summary: 'Compare the same ratio rule under two different problem constraints.',
      goal: 'Explain why value per unit weight solves fractional but not 0/1 knapsack.',
      range: [2, 5],
      quiz: {
        question: 'For which problem is selecting by highest value per kilogram guaranteed optimal?',
        options: ['Both fractional and 0/1 knapsack.', 'Fractional knapsack only.', '0/1 knapsack only.'],
        answer: 1,
        explanation: 'Taking the best value per kilogram is provably optimal when fractions are allowed. The example with whole items provides a counterexample for 0/1 knapsack.'
      }
    },
    {
      id: 'activity', title: 'Activity selection and proof', label: '3 · Scheduling',
      summary: 'Build a schedule, trace the pseudocode, and study why the rule succeeds.',
      goal: 'Apply earliest finish time and explain the central exchange argument.',
      range: [5, 8],
      quiz: {
        question: 'Why can an optimal activity schedule begin with the earliest-finishing activity?',
        options: [
          'It must have the shortest duration.',
          'It starts earlier than all other activities.',
          'Replacing the first activity in an optimal schedule with it preserves compatibility.'
        ],
        answer: 2,
        explanation: 'The earliest-finishing activity ends no later than the first activity of an optimal schedule. Replacing that first activity keeps the remaining scheduled activities compatible.'
      }
    },
    {
      id: 'limits', title: 'Find the limits', label: '4 · Counterexamples',
      summary: 'A small change in the problem can make a tempting greedy rule fail.',
      goal: 'Construct counterexamples for weighted selection, trees, and deadlines.',
      range: [8, 9],
      quiz: {
        question: 'What establishes that a proposed greedy rule is not always optimal?',
        options: [
          'One valid input where the rule gives a suboptimal answer.',
          'A long sequence of inputs where the rule works.',
          'An implementation that uses sorting.'
        ],
        answer: 0,
        explanation: 'One counterexample disproves a universal optimality claim. Examples where a rule succeeds do not by themselves prove it always succeeds.'
      }
    },
    {
      id: 'practice', title: 'Apply and explain', label: '5 · Independent practice',
      summary: 'Move from recognizing a strategy to selecting it and defending its correctness.',
      goal: 'State a greedy rule, analyze its running time, and justify it or refute it.',
      range: [9, 11],
      quiz: {
        question: 'What makes a complete answer to a greedy-algorithms problem?',
        options: [
          'Pseudocode only.',
          'A successful example and the final output.',
          'The rule, an algorithm, a correctness argument, and time complexity.'
        ],
        answer: 2,
        explanation: 'In algorithm design, the solution needs a clear choice rule, implementation or pseudocode, a justification of correctness, and complexity analysis.'
      }
    }
  ];

  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const h1 = card.querySelector('h1');
  const intro = card.querySelector('.intro');
  if (h1) h1.before(make('p', 'eyebrow', 'Algorithms · Lecture companion'));
  if (intro) {
    intro.classList.add('hero-lead');
    intro.textContent = 'Follow the lecture, experiment with greedy choices, and test your understanding. These notes supplement — rather than replace — the classroom explanation.';
    const tags = make('div', 'hero-tags');
    ['Worked examples', '4 interactive activities', 'Proof ideas', 'Independent practice']
      .forEach((label, i) => tags.append(make('span', 'hero-tag' + (i === 3 ? ' muted' : ''), label)));
    intro.after(tags);
    const outcomes = make('section', 'learning-intro');
    outcomes.innerHTML = '<div class="outcomes"><h2>By the end of this topic, you should be able to</h2><ul>' +
      '<li>identify and test a greedy-choice rule;</li>' +
      '<li>distinguish fractional from 0/1 knapsack;</li>' +
      '<li>run activity selection and justify it with an exchange argument;</li>' +
      '<li>find counterexamples and analyze new greedy problems.</li></ul></div>' +
      '<p class="study-note"><strong>Suggested use:</strong> Before class, skim the worked examples. During class, explore the activities. After class, try the checkpoints and practice problems without opening the solutions first.</p>';
    tags.after(outcomes);
  }

  units.forEach((unit, idx) => {
    const wrapper = make('section', 'learning-unit');
    wrapper.id = unit.id;
    wrapper.setAttribute('aria-labelledby', unit.id + '-title');
    const header = make('header', 'unit-header');
    header.append(make('span', 'unit-step', 'Unit ' + (idx + 1) + ' / ' + units.length));
    const heading = make('h2', '', unit.title);
    heading.id = unit.id + '-title';
    header.append(heading, make('p', '', unit.summary), make('p', 'unit-goal', 'Learning goal: ' + unit.goal));
    card.insertBefore(wrapper, groups[unit.range[0]]);
    wrapper.append(header);
    groups.slice(unit.range[0], unit.range[1]).forEach(group => wrapper.append(group));

    const check = make('section', 'quick-check');
    check.setAttribute('aria-labelledby', unit.id + '-check-title');
    const checkTitle = make('h3', '', 'Check your understanding');
    checkTitle.id = unit.id + '-check-title';
    check.append(checkTitle, make('p', 'question', unit.quiz.question));
    const options = make('div', 'check-options');
    const feedback = make('p', 'check-feedback');
    feedback.hidden = true;
    feedback.setAttribute('role', 'status');
    unit.quiz.options.forEach((answer, optionIndex) => {
      const button = make('button', '', answer);
      button.type = 'button';
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        options.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        const correct = optionIndex === unit.quiz.answer;
        feedback.hidden = false;
        feedback.dataset.tone = correct ? 'good' : 'bad';
        feedback.textContent = (correct ? 'Correct. ' : 'Not quite. ') + unit.quiz.explanation;
      });
      options.append(button);
    });
    check.append(options, feedback);
    wrapper.append(check);
    const footer = make('div', 'unit-footer');
    const done = make('button', 'btn btn-secondary complete', 'Mark section complete');
    done.type = 'button';
    done.dataset.unit = unit.id;
    done.setAttribute('aria-pressed', 'false');
    footer.append(done);
    const next = units[idx + 1];
    if (next) {
      const link = make('a', 'next-unit', 'Next: ' + next.title + ' →');
      link.href = '#' + next.id;
      footer.append(link);
    } else {
      const link = make('a', 'next-unit', 'Back to the beginning ↑');
      link.href = '#foundations';
      footer.append(link);
    }
    wrapper.append(footer);
  });

  const nav = make('nav', 'module-nav');
  nav.setAttribute('aria-label', 'Learning sections');
  units.forEach(unit => {
    const link = make('a', '', unit.label);
    link.href = '#' + unit.id;
    link.dataset.navUnit = unit.id;
    nav.append(link);
  });
  const first = document.getElementById(units[0].id);
  first.before(nav);
  const progress = make('div', 'progress-panel');
  progress.setAttribute('role', 'group');
  progress.setAttribute('aria-label', 'Learning progress');
  const count = make('span', '', '0 / 5 sections completed');
  count.setAttribute('aria-live', 'polite');
  const track = make('div', 'progress-track');
  track.setAttribute('aria-hidden', 'true');
  const fill = make('div', 'progress-fill');
  track.append(fill);
  const reset = make('button', 'btn btn-ghost', 'Reset progress');
  reset.type = 'button';
  progress.append(count, track, reset);
  nav.after(progress);

  const storageKey = 'greedy-lecture-companion-progress-v1';
  let completed = [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) completed = saved.filter(id => units.some(unit => unit.id === id));
  } catch (_) { /* Private browsing or restricted storage: progress works for this visit. */ }

  const renderProgress = () => {
    units.forEach(unit => {
      const isDone = completed.includes(unit.id);
      const button = document.querySelector('.complete[data-unit="' + unit.id + '"]');
      if (button) {
        button.dataset.done = String(isDone);
        button.setAttribute('aria-pressed', String(isDone));
        button.textContent = isDone ? '✓ Section complete (undo)' : 'Mark section complete';
      }
      const link = nav.querySelector('[data-nav-unit="' + unit.id + '"]');
      if (link) {
        const mark = link.querySelector('.nav-check');
        if (isDone && !mark) {
          const check = make('span', 'nav-check', '✓');
          check.setAttribute('aria-label', 'completed');
          link.append(check);
        } else if (!isDone && mark) {
          mark.remove();
        }
      }
    });
    count.textContent = completed.length + ' / ' + units.length + ' sections completed';
    fill.style.width = (completed.length / units.length * 100) + '%';
    try { localStorage.setItem(storageKey, JSON.stringify(completed)); } catch (_) { /* Optional. */ }
  };

  document.querySelectorAll('.complete[data-unit]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.unit;
      completed = completed.includes(id) ? completed.filter(x => x !== id) : completed.concat(id);
      renderProgress();
    });
  });
  reset.addEventListener('click', () => { completed = []; renderProgress(); });
  renderProgress();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      nav.querySelectorAll('a').forEach(link => link.removeAttribute('aria-current'));
      const active = nav.querySelector('[data-nav-unit="' + visible[0].target.id + '"]');
      if (active) active.setAttribute('aria-current', 'location');
    }, { rootMargin: '-100px 0px -55% 0px' });
    units.forEach(unit => observer.observe(document.getElementById(unit.id)));
  }
})();
