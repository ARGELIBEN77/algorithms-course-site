const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('../topics/dynamic-programming-core.js');

test('Fibonacci boundaries and recurrence-call counts', () => {
  assert.deepEqual(D.fibonacci(0), { values: [0], naiveCalls: 1 });
  assert.equal(D.fibonacci(1).values[1], 1);
  assert.equal(D.fibonacci(5).values[5], 5);
  assert.equal(D.fibonacci(5).naiveCalls, 15);
  assert.equal(D.fibonacci(25).values[25], 75025);
});
test('Binomial table agrees with independent multiplicative formula', () => {
  for (let n = 0; n <= 10; n++) for (let k = 0; k <= n; k++) {
    let choose = 1;
    for (let j = 1; j <= k; j++) choose = choose * (n - j + 1) / j;
    assert.equal(D.binomial(n, k).answer, Math.round(choose));
  }
});
function bruteSubarray(a) {
  let best = -Infinity;
  for (let i = 0; i < a.length; i++) {
    let sum = 0;
    for (let j = i; j < a.length; j++) { sum += a[j]; best = Math.max(best, sum); }
  }
  return best;
}
test('Kadane matches brute force for every small array, including all negative', () => {
  for (let n = 1; n <= 6; n++) for (let mask = 0; mask < 3 ** n; mask++) {
    let v = mask;
    const a = Array.from({ length: n }, () => { const x = (v % 3) - 1; v = Math.floor(v / 3); return x; });
    const result = D.kadane(a);
    assert.equal(result.best, bruteSubarray(a));
    assert.equal(a.slice(result.start, result.end + 1).reduce((s, x) => s + x, 0), result.best);
  }
  assert.equal(D.kadane([1, 7, 3, -13, 2, 1, 10, -2, 1, -20]).best, 13);
});
function brutePacking(items, cap) {
  let best = 0;
  for (let mask = 0; mask < 2 ** items.length; mask++) {
    let w = 0, v = 0;
    items.forEach((item, i) => { if ((mask >> i) & 1) { w += item.w; v += item.v; } });
    if (w <= cap) best = Math.max(best, v);
  }
  return best;
}
test('Knapsack table and reconstructed solution agree with exhaustive subsets', () => {
  for (let cap = 0; cap <= 20; cap++) {
    const r = D.knapsack(D.lectureItems, cap);
    assert.equal(r.answer, brutePacking(D.lectureItems, cap));
    const selected = D.lectureItems.filter(x => r.selected.includes(x.id));
    assert.ok(selected.reduce((s, x) => s + x.w, 0) <= cap);
    assert.equal(selected.reduce((s, x) => s + x.v, 0), r.answer);
  }
  assert.deepEqual(D.knapsack(D.lectureItems, 15).selected, ['G2', 'G3', 'G4', 'G6']);
  assert.equal(D.knapsack(D.lectureItems, 15).answer, 26);
});
function bruteChain(d, i = 0, j = d.length - 2) {
  if (i === j) return 0;
  return Math.min(...Array.from({ length: j - i }, (_, offset) => {
    const k = i + offset;
    return bruteChain(d, i, k) + bruteChain(d, k + 1, j) + d[i] * d[k + 1] * d[j + 1];
  }));
}
test('Matrix chains match exhaustive parenthesizations, including ties', () => {
  for (const dims of [[2, 5, 3, 4], [30, 35, 15, 5, 10, 20, 25], [2, 2, 2, 2], [5, 1, 9, 2, 4], [1, 7, 2]]) {
    assert.equal(D.matrixChain(dims).answer, bruteChain(dims));
  }
  assert.equal(D.matrixChain([2, 5, 3, 4]).answer, 54);
  assert.equal(D.matrixChain([2, 5, 3, 4]).parenthesization, '((M1 × M2) × M3)');
});
function allSubsequences(s) {
  return Array.from({ length: 2 ** s.length }, (_, mask) => [...s].filter((_, i) => (mask >> i) & 1).join(''));
}
test('LCS matches exhaustive subsequences and reconstructs a valid optimum', () => {
  const strings = ['', 'A', 'B', 'AB', 'BA', 'AAA', 'ABA', 'BABA', 'ABBAB'];
  for (const x of strings) for (const y of strings) {
    const ys = new Set(allSubsequences(y));
    const expected = Math.max(...allSubsequences(x).filter(s => ys.has(s)).map(s => s.length));
    const r = D.lcs(x, y);
    assert.equal(r.answer, expected);
    assert.equal(r.sequence.length, expected);
    assert.ok(D.isSubsequence(r.sequence, x) && D.isSubsequence(r.sequence, y));
  }
  assert.equal(D.lcs('abcabdc', 'abcbdcbad').answer, 6);
  assert.equal(D.lcs('ABCBDAB', 'BDCABA').answer, 4);
  for (const candidate of ['BCBA', 'BDAB', 'BCAB']) {
    assert.ok(D.isSubsequence(candidate, 'ABCBDAB') && D.isSubsequence(candidate, 'BDCABA'));
  }
});
test('Staircase reconstructs valid steps and includes the last entering cost', () => {
  const r = D.staircase([2, 3, 4, 1, 5]);
  assert.deepEqual(r.values, [0, 2, 3, 6, 4, 9]);
  assert.deepEqual(r.path, [0, 2, 4, 5]);
  assert.equal(r.answer, 9);
  assert.equal(D.staircase([]).answer, 0);
  assert.equal(D.staircase([5]).answer, 5);
});
