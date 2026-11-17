/* Pure algorithms shared by the explorers and their correctness checks. */
(function (root) {
  'use strict';
  function fibonacci(n) {
    const values = [0], calls = [1];
    if (n > 0) { values.push(1); calls.push(1); }
    for (let i = 2; i <= n; i++) {
      values[i] = values[i - 1] + values[i - 2];
      calls[i] = 1 + calls[i - 1] + calls[i - 2];
    }
    return { values, naiveCalls: calls[n] };
  }
  function binomial(n, k) {
    const table = Array.from({ length: n + 1 }, () => Array(k + 1).fill(null));
    const steps = [];
    for (let i = 0; i <= n; i++) for (let j = 0; j <= Math.min(i, k); j++) {
      table[i][j] = j === 0 || j === i ? 1 : table[i - 1][j - 1] + table[i - 1][j];
      steps.push({ i, j, value: table[i][j], deps: j === 0 || j === i ? [] : [[i - 1, j - 1], [i - 1, j]] });
    }
    return { table, steps, answer: table[n][k] };
  }
  function kadane(a) {
    let current = a[0], best = a[0], start = 0, end = 0, currentStart = 0;
    const steps = [{ i: 0, current, best, start, end, currentStart, restart: true }];
    for (let i = 1; i < a.length; i++) {
      const restart = current < 0;
      if (restart) { current = a[i]; currentStart = i; } else current += a[i];
      if (current > best) { best = current; start = currentStart; end = i; }
      steps.push({ i, current, best, start, end, currentStart, restart });
    }
    return { steps, best, start, end };
  }
  const lectureItems = [
    { id: 'G1', w: 9, v: 4 }, { id: 'G2', w: 6, v: 8 },
    { id: 'G3', w: 3, v: 7 }, { id: 'G4', w: 4, v: 1 },
    { id: 'G5', w: 5, v: 2 }, { id: 'G6', w: 2, v: 10 }
  ];
  function knapsack(items, capacity) {
    const table = Array.from({ length: items.length + 1 }, () => Array(capacity + 1).fill(0));
    const steps = [];
    for (let i = 1; i <= items.length; i++) for (let b = 1; b <= capacity; b++) {
      const item = items[i - 1], skip = table[i - 1][b];
      const take = item.w <= b ? item.v + table[i - 1][b - item.w] : null;
      table[i][b] = take === null ? skip : Math.max(skip, take);
      steps.push({ i, j: b, skip, take, value: table[i][b], deps: [[i - 1, b], ...(take === null ? [] : [[i - 1, b - item.w]])] });
    }
    let b = capacity;
    const trace = [], selected = [];
    for (let i = items.length; i > 0; i--) {
      const take = table[i][b] !== table[i - 1][b];
      const nextB = take ? b - items[i - 1].w : b;
      trace.push({ i, j: b, take, nextB, value: table[i][b], previous: table[i - 1][b] });
      if (take) selected.push(items[i - 1].id);
      b = nextB;
    }
    return { table, steps, trace, selected: selected.reverse(), answer: table[items.length][capacity] };
  }
  function matrixChain(d) {
    const n = d.length - 1;
    const table = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 0 : null));
    const split = Array.from({ length: n }, () => Array(n).fill(null));
    const steps = [];
    for (let len = 2; len <= n; len++) for (let i = 0; i + len <= n; i++) {
      const j = i + len - 1, candidates = [];
      let best = Infinity, bestK = i;
      for (let k = i; k < j; k++) {
        const multiply = d[i] * d[k + 1] * d[j + 1];
        const cost = table[i][k] + table[k + 1][j] + multiply;
        candidates.push({ k, left: table[i][k], right: table[k + 1][j], multiply, cost });
        if (cost < best) { best = cost; bestK = k; }
      }
      table[i][j] = best; split[i][j] = bestK + 1;
      steps.push({ i, j, value: best, k: bestK, candidates, deps: [[i, bestK], [bestK + 1, j]] });
    }
    function parentheses(i, j) {
      if (i === j) return 'M' + (i + 1);
      const k = split[i][j] - 1;
      return '(' + parentheses(i, k) + ' × ' + parentheses(k + 1, j) + ')';
    }
    return { table, split, steps, answer: table[0][n - 1], parenthesization: parentheses(0, n - 1) };
  }
  function lcs(x, y) {
    const table = Array.from({ length: x.length + 1 }, () => Array(y.length + 1).fill(0));
    const steps = [];
    for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) {
      const match = x[i - 1] === y[j - 1];
      table[i][j] = match ? 1 + table[i - 1][j - 1] : Math.max(table[i - 1][j], table[i][j - 1]);
      steps.push({ i, j, match, value: table[i][j], deps: match ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1]] });
    }
    let i = x.length, j = y.length;
    const trace = [], chars = [];
    while (i > 0 && j > 0) {
      const match = x[i - 1] === y[j - 1];
      const step = { i, j, match, char: match ? x[i - 1] : '', direction: '' };
      if (match) { chars.push(x[i - 1]); i--; j--; step.direction = 'diagonal'; }
      else if (table[i - 1][j] >= table[i][j - 1]) { i--; step.direction = 'up'; }
      else { j--; step.direction = 'left'; }
      trace.push({ ...step, nextI: i, nextJ: j, suffix: chars.slice().reverse().join('') });
    }
    return { table, steps, trace, answer: table[x.length][y.length], sequence: chars.reverse().join('') };
  }
  function isSubsequence(candidate, source) {
    let i = 0;
    for (const char of source) if (i < candidate.length && candidate[i] === char) i++;
    return i === candidate.length;
  }
  function staircase(costs) {
    const values = [0], previous = [null];
    if (costs.length) { values.push(costs[0]); previous.push(0); }
    for (let i = 2; i <= costs.length; i++) {
      previous[i] = values[i - 1] <= values[i - 2] ? i - 1 : i - 2;
      values[i] = costs[i - 1] + values[previous[i]];
    }
    const path = [];
    for (let i = costs.length; i !== null; i = previous[i]) path.push(i);
    return { values, answer: values[costs.length], path: path.reverse() };
  }
  const api = { fibonacci, binomial, kadane, lectureItems, knapsack, matrixChain, lcs, isSubsequence, staircase };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DPCore = api;
})(typeof window === 'undefined' ? globalThis : window);
