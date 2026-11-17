/* Each explorer owns its state; the existing Greedy unit is independent. */
(() => {
  'use strict';
  const D = window.DPCore;
  const $ = id => document.getElementById(id);
  const on = (id, fn) => $(id).addEventListener('click', fn);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  function status(id, message, tone = '') {
    $(id).textContent = message; $(id).dataset.tone = tone;
  }
  function integer(id, min, max) {
    const raw = $(id).value.trim(), value = Number(raw);
    if (!raw || !Number.isInteger(value) || value < min || value > max) throw new Error(`Enter an integer from ${min} to ${max}.`);
    return value;
  }
  function numbers(id, minCount, maxCount, minValue, maxValue) {
    const parts = $(id).value.split(',').map(s => s.trim());
    if (parts.length < minCount || parts.length > maxCount || parts.some(s => !/^-?\d+$/.test(s))) throw new Error(`Enter ${minCount}–${maxCount} integers separated by commas.`);
    const values = parts.map(Number);
    if (values.some(v => !Number.isSafeInteger(v) || v < minValue || v > maxValue)) throw new Error(`Each integer must be between ${minValue} and ${maxValue}.`);
    return values;
  }
  function safely(id, fn) { try { fn(); } catch (error) { status(id, error.message, 'bad'); } }
  const coord = (i, j) => `${i}:${j}`;
  function tableHTML({ table, rows, cols, caption, visible = () => true, current, deps = [], path = [], meaningful = () => true, rowTitle = 'i / j' }) {
    const dependency = new Set(deps.map(([i, j]) => coord(i, j)));
    const traced = new Set(path.map(([i, j]) => coord(i, j)));
    return `<div class="dp-table-wrap" tabindex="0" role="region" aria-label="${esc(caption)}. Scroll horizontally if needed."><table class="dp-table"><caption>${esc(caption)}</caption><thead><tr><th scope="col">${esc(rowTitle)}</th>${cols.map(x => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map((row, i) => `<tr><th scope="row">${esc(row)}</th>${cols.map((_, j) => {
      const key = coord(i, j), active = current && i === current.i && j === current.j;
      const classes = [active ? 'current' : '', dependency.has(key) ? 'dependency' : '', traced.has(key) ? 'path' : ''].filter(Boolean).join(' ');
      const value = !meaningful(i, j) ? '—' : visible(i, j) ? (table[i][j] === null ? '—' : table[i][j]) : '·';
      const label = active ? ` aria-label="${esc(value)}, current cell"` : dependency.has(key) ? ` aria-label="${esc(value)}, dependency cell"` : ''; 
      return `<td class="${classes}"${label}>${esc(value)}</td>`;
    }).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  const labels = n => Array.from({ length: n }, (_, i) => i);
  function cellSet(steps, count) { return new Set(steps.slice(0, count).map(s => coord(s.i, s.j))); }

  // Fibonacci: counts are calculated by a recurrence; the explorer never runs
  // an exponentially large recursive computation in the student's browser.
  let fib, fibN = 5, fibCount;
  function renderFib() {
    $('fib-cells').innerHTML = fib.values.map((v, i) => `<div class="dp-cell${i === fibCount - 1 ? ' active' : ''}"><small>F(${i})</small>${i < fibCount ? v : '·'}</div>`).join('');
    $('fib-metrics').innerHTML = [['Naive recursive calls', fib.naiveCalls.toLocaleString('en')], ['DP table entries', fibN + 1], ['DP result', fibCount === fib.values.length ? fib.values[fibN] : '…']].map(([label, v]) => `<div class="dp-metric"><strong>${v}</strong>${label}</div>`).join('');
    $('fib-step').disabled = $('fib-all').disabled = fibCount >= fib.values.length;
    const i = fibCount - 1;
    status('fib-status', i < 2 ? `Base cases initialized. ${fibCount === fib.values.length ? `F(${fibN}) = ${fib.values[fibN]}.` : 'Compute the next value from its two predecessors.'}` : `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${fib.values[i - 1]} + ${fib.values[i - 2]} = ${fib.values[i]}.${i === fibN ? ' Complete: each table entry was computed once.' : ''}`);
  }
  function buildFib() { safely('fib-status', () => { fibN = integer('fib-n', 0, 25); fib = D.fibonacci(fibN); fibCount = Math.min(2, fib.values.length); renderFib(); }); }
  on('fib-build', buildFib); on('fib-step', () => { fibCount++; renderFib(); }); on('fib-all', () => { fibCount = fib.values.length; renderFib(); }); buildFib();

  let bin, binCount = 0, binN = 5, binK = 2;
  function renderBin() {
    const set = cellSet(bin.steps, binCount), s = bin.steps[binCount - 1];
    $('bin-table').innerHTML = tableHTML({ table: bin.table, rows: labels(binN + 1), cols: labels(binK + 1), caption: 'C(i,j): choose j of i items', current: s, deps: s?.deps, meaningful: (i, j) => j <= i, visible: (i, j) => set.has(coord(i, j)) });
    $('bin-step').disabled = $('bin-all').disabled = binCount === bin.steps.length;
    status('bin-status', !s ? 'Start with C(0,0). Cells outside the triangle are not needed.' : s.deps.length ? `C(${s.i},${s.j}) = ${bin.table[s.i - 1][s.j - 1]} + ${bin.table[s.i - 1][s.j]} = ${s.value}.${binCount === bin.steps.length ? ` Answer: C(${binN},${binK}) = ${bin.answer}.` : ''}` : `C(${s.i},${s.j}) = 1: choosing none or choosing all has exactly one possibility.${binCount === bin.steps.length ? ` Answer: ${bin.answer}.` : ''}`);
  }
  function buildBin() { safely('bin-status', () => { const n = integer('bin-n', 0, 10), k = integer('bin-k', 0, n); binN = n; binK = k; bin = D.binomial(n, k); binCount = 0; renderBin(); }); }
  on('bin-build', buildBin); on('bin-step', () => { binCount++; renderBin(); }); on('bin-all', () => { binCount = bin.steps.length; renderBin(); }); buildBin();

  let kad, kadArray, kadCount = 1;
  function renderKad() {
    const s = kad.steps[kadCount - 1];
    $('kad-cells').innerHTML = kadArray.map((v, i) => `<div class="dp-cell${i >= s.start && i <= s.end ? ' active' : ''}"><small>A[${i + 1}]</small>${v}</div>`).join('');
    $('kad-table').innerHTML = `<div class="dp-table-wrap" tabindex="0" role="region" aria-label="Kadane trace"><table class="dp-table"><caption>Trace so far · indices start at 1</caption><thead><tr><th scope="col">i</th><th scope="col">A[i]</th><th scope="col">Decision</th><th scope="col">H[i]</th><th scope="col">Best so far</th></tr></thead><tbody>${kad.steps.slice(0, kadCount).map(t => `<tr><th scope="row">${t.i + 1}</th><td>${kadArray[t.i]}</td><td>${t.i === 0 ? 'Initialize' : t.restart ? 'Start again' : 'Extend'}</td><td>${t.current}</td><td>${t.best}</td></tr>`).join('')}</tbody></table></div>`;
    $('kad-step').disabled = $('kad-all').disabled = kadCount === kad.steps.length;
    status('kad-status', `Position ${s.i + 1}: best sum ending here = ${s.current}. Best ${kadCount === kad.steps.length ? 'overall' : 'so far'} = ${s.best}, at indices ${s.start + 1}–${s.end + 1}. The green cells mark that best subarray.`);
  }
  function buildKad() { safely('kad-status', () => { const a = numbers('kad-input', 1, 20, -10000, 10000); kadArray = a; kad = D.kadane(a); kadCount = 1; renderKad(); }); }
  on('kad-build', buildKad); on('kad-negative', () => { $('kad-input').value = '-8, -3, -6, -2, -5'; buildKad(); });
  on('kad-step', () => { kadCount++; renderKad(); }); on('kad-all', () => { kadCount = kad.steps.length; renderKad(); }); buildKad();

  const items = D.lectureItems, capacity = 15, knap = D.knapsack(items, capacity);
  let knapCount = 0, knapTrace = 0, packing = [];
  function renderPacking(message = '') {
    const focusedItem = document.activeElement?.dataset?.item;
    $('knap-items').innerHTML = items.map(item => `<button type="button" data-item="${item.id}" aria-pressed="${packing.includes(item.id)}">${item.id}\nweight ${item.w} · value ${item.v}</button>`).join('');
    $('knap-items').querySelectorAll('button').forEach(b => b.addEventListener('click', () => { packing = packing.includes(b.dataset.item) ? packing.filter(id => id !== b.dataset.item) : [...packing, b.dataset.item]; renderPacking(); }));
    if (focusedItem) $('knap-items').querySelector(`[data-item="${focusedItem}"]`)?.focus();
    const chosen = items.filter(item => packing.includes(item.id));
    const w = chosen.reduce((sum, item) => sum + item.w, 0), v = chosen.reduce((sum, item) => sum + item.v, 0);
    status('knap-packing', `${packing.length ? packing.join(', ') : 'No items selected'}. Weight: ${w} / ${capacity}. Value: ${v}. ${message}`, w > capacity ? 'bad' : '');
    return { w, v };
  }
  on('knap-check', () => {
    const { w, v } = renderPacking();
    renderPacking(w > capacity ? 'Over capacity: remove an item before comparing values.' : v === knap.answer ? 'Optimal! This is a feasible packing with maximum value.' : `Feasible, but a value of ${knap.answer} is achievable. Try another combination, or explore the table.`);
  });
  on('knap-clear', () => { packing = []; renderPacking(); });
  function renderKnap() {
    const s = knap.steps[knapCount - 1], t = knap.trace[knapTrace - 1];
    const set = cellSet(knap.steps, knapCount);
    const path = knap.trace.slice(0, knapTrace).map(s => [s.i, s.j]);
    if (t) path.push([t.i - 1, t.nextB]);
    $('knap-table').innerHTML = tableHTML({ table: knap.table, rows: ['0', ...items.map(x => x.id)], cols: labels(capacity + 1), rowTitle: 'Items / B', caption: 'Maximum value T[i,B] · capacity B increases left to right', current: knapTrace ? null : s, deps: knapTrace ? [] : s?.deps, path, visible: (i, j) => i === 0 || j === 0 || set.has(coord(i, j)) });
    const complete = knapCount === knap.steps.length;
    for (const id of ['knap-step', 'knap-row', 'knap-all']) $(id).disabled = complete;
    $('knap-back').disabled = !complete || knapTrace === knap.trace.length;
    if (t) status('knap-status', `${t.take ? 'Take' : 'Skip'} ${items[t.i - 1].id}: T[${t.i},${t.j}] = ${t.value}, ${t.take ? 'different from' : 'equal to'} T[${t.i - 1},${t.j}] = ${t.previous}. Remaining capacity: ${t.nextB}.${knapTrace === knap.trace.length ? ` Recovered packing: ${knap.selected.join(', ')}. Total value ${knap.answer}, weight 15.` : ' Move to the previous row.'}`);
    else if (!s) status('knap-status', 'Base row and column are zero. Start with item G1 and capacity 1.');
    else status('knap-status', `T[${s.i},${s.j}]: skip → ${s.skip}; ${s.take === null ? 'take is infeasible (item too heavy)' : `take → ${items[s.i - 1].v} + ${knap.table[s.i - 1][s.j - items[s.i - 1].w]} = ${s.take}`}. Store ${s.value}.${complete ? ` Optimum = ${knap.answer}. Now trace a solution backward.` : ''}`);
  }
  on('knap-step', () => { knapCount++; renderKnap(); });
  on('knap-row', () => { const row = knap.steps[knapCount].i; while (knapCount < knap.steps.length && knap.steps[knapCount].i === row) knapCount++; renderKnap(); });
  on('knap-all', () => { knapCount = knap.steps.length; renderKnap(); });
  on('knap-back', () => { knapTrace++; renderKnap(); });
  on('knap-reset', () => { knapCount = knapTrace = 0; renderKnap(); }); renderPacking(); renderKnap();

  let matrix, matrixD, matrixCount = 0;
  function renderMatrix() {
    const n = matrixD.length - 1, set = cellSet(matrix.steps, matrixCount), s = matrix.steps[matrixCount - 1];
    const visible = (i, j) => i === j || set.has(coord(i, j));
    const common = { rows: labels(n).map(i => 'M' + (i + 1)), cols: labels(n).map(i => 'M' + (i + 1)), current: s, meaningful: (i, j) => j >= i, visible };
    $('matrix-table').innerHTML = tableHTML({ ...common, table: matrix.table, deps: s?.deps, caption: 'm[i,j] · minimum scalar multiplications' });
    $('split-table').innerHTML = tableHTML({ ...common, table: matrix.split, caption: 'S[i,j] · split after matrix k', meaningful: (i, j) => j > i });
    const complete = matrixCount === matrix.steps.length;
    $('matrix-step').disabled = $('matrix-all').disabled = complete;
    if (!s) status('matrix-status', `Matrices: ${matrixD.slice(0, -1).map((d, i) => `M${i + 1} = ${d}×${matrixD[i + 1]}`).join('; ')}. Diagonal costs are zero. Fill chains in increasing length.`);
    else status('matrix-status', `m[${s.i + 1},${s.j + 1}]: ${s.candidates.map(c => `k=${c.k + 1}: ${c.left} + ${c.right} + ${c.multiply} = ${c.cost}`).join('; ')}. Choose k=${s.k + 1}, cost ${s.value}.${complete ? ` Optimal order: ${matrix.parenthesization}. Cost = ${matrix.answer}.` : ''}`);
  }
  function buildMatrix() { safely('matrix-status', () => { const d = numbers('matrix-input', 3, 7, 1, 1000); matrixD = d; matrix = D.matrixChain(d); matrixCount = 0; renderMatrix(); }); }
  on('matrix-build', buildMatrix); on('matrix-reset', () => { matrixCount = 0; renderMatrix(); });
  on('matrix-step', () => { matrixCount++; renderMatrix(); }); on('matrix-all', () => { matrixCount = matrix.steps.length; renderMatrix(); }); buildMatrix();

  let lcs, lcsX, lcsY, lcsCount = 0, lcsTrace = 0;
  function renderLCS() {
    const set = cellSet(lcs.steps, lcsCount), s = lcs.steps[lcsCount - 1], t = lcs.trace[lcsTrace - 1];
    const path = lcs.trace.slice(0, lcsTrace).map(s => [s.i, s.j]);
    if (t) path.push([t.nextI, t.nextJ]);
    $('lcs-table').innerHTML = tableHTML({ table: lcs.table, rows: ['∅', ...lcsX.split('')], cols: ['∅', ...lcsY.split('')], caption: 'f[i,j] · LCS length for prefixes of X (rows) and Y (columns)', rowTitle: 'X / Y', current: lcsTrace ? null : s, deps: lcsTrace ? [] : s?.deps, path, visible: (i, j) => i === 0 || j === 0 || set.has(coord(i, j)) });
    const complete = lcsCount === lcs.steps.length;
    $('lcs-step').disabled = $('lcs-all').disabled = complete;
    $('lcs-back').disabled = !complete || lcsTrace === lcs.trace.length;
    if (t) status('lcs-status', `At f[${t.i},${t.j}]: ${t.match ? `matching '${t.char}', collect it and move diagonally` : `characters differ, move ${t.direction} to a cell of the same optimal value`}. Recovered suffix: '${t.suffix}'.${lcsTrace === lcs.trace.length ? ` One LCS: '${lcs.sequence}' (length ${lcs.answer}). Other optimal answers may exist.` : ''}`);
    else if (!s) status('lcs-status', complete ? 'At least one string is empty: LCS length is 0 and its sequence is empty.' : 'Empty-prefix row and column are zero. Predict the next cell, then reveal it.');
    else status('lcs-status', `f[${s.i},${s.j}]: '${lcsX[s.i - 1]}' ${s.match ? 'matches' : 'differs from'} '${lcsY[s.j - 1]}'. ${s.match ? `1 + diagonal ${lcs.table[s.i - 1][s.j - 1]}` : `max(up ${lcs.table[s.i - 1][s.j]}, left ${lcs.table[s.i][s.j - 1]})`} = ${s.value}.${complete ? ` LCS length = ${lcs.answer}. Trace a solution backward or propose your own.` : ''}`);
  }
  function buildLCS() { safely('lcs-status', () => {
    const x = $('lcs-x').value, y = $('lcs-y').value;
    if (!/^[a-zA-Z]{0,12}$/.test(x) || !/^[a-zA-Z]{0,12}$/.test(y)) throw new Error('Use up to 12 English letters per string; an empty string is allowed. Matching is case-sensitive.');
    lcsX = x; lcsY = y; lcs = D.lcs(x, y); lcsCount = lcsTrace = 0;
    $('lcs-answer').value = ''; status('lcs-verdict', ''); renderLCS();
  }); }
  on('lcs-build', buildLCS); on('lcs-example', () => { $('lcs-x').value = 'abcabdc'; $('lcs-y').value = 'abcbdcbad'; buildLCS(); });
  on('lcs-step', () => { lcsCount++; renderLCS(); }); on('lcs-all', () => { lcsCount = lcs.steps.length; renderLCS(); }); on('lcs-back', () => { lcsTrace++; renderLCS(); });
  on('lcs-check', () => {
    const answer = $('lcs-answer').value;
    const common = D.isSubsequence(answer, lcsX) && D.isSubsequence(answer, lcsY);
    status('lcs-verdict', !common ? 'This is not a subsequence of both active strings. Check the character order and letter case.' : answer.length !== lcs.answer ? `A common subsequence of length ${answer.length}, but the optimal length is ${lcs.answer}. Can you keep more characters?` : `Correct: '${answer}' is a longest common subsequence, length ${answer.length}. Every valid optimal answer is accepted.`, common && answer.length === lcs.answer ? 'good' : 'bad');
  }); buildLCS();
  on('stairs-check', () => safely('stairs-status', () => {
    const answer = integer('stairs-answer', 0, 1000000), correct = answer === D.staircase([2, 3, 4, 1, 5]).answer;
    status('stairs-status', correct ? 'Correct: minimum cost 9. Now justify the recurrence and reconstruct a path before opening the solution.' : 'Not yet. Include the cost of entering the final step. Use the hints to compare the two possible predecessors.', correct ? 'good' : 'bad');
  }));

  const quizzes = {
    idea: ['What must a DP state specify?', ['Only the final numeric answer.', 'Enough information to define one subproblem unambiguously.', 'The order in which the code was written.'], 1, 'A state needs a precise meaning and all parameters that affect that subproblem.'],
    fibonacci: ['What changes when we memoize Fibonacci?', ['The recurrence is replaced by a greedy choice.', 'Each non-base state is computed once; later calls reuse it.', 'There are no recursive calls and no stack.'], 1, 'Memoization keeps the recurrence and recursion stack, while avoiding repeated computation of the same non-base state.'],
    binomial: ['Why do the two terms in the recurrence add up?', ['They partition selections into including or excluding one item.', 'Every selection is counted in both terms.', 'Order matters in the chosen subset.'], 0, 'The two cases are disjoint and cover every size-k subset.'],
    kadane: ['For [-8, -3, -6], what is the maximum nonempty subarray sum?', ['0', '-3', '-17'], 1, 'The best nonempty subarray is [-3]. Initializing the answer to zero would incorrectly allow an empty choice.'],
    knapsack: ['Why does the take case use row i−1?', ['It ensures items are considered by ratio.', 'It allows unlimited reuse of item i.', 'It prevents taking item i more than once.'], 2, 'Both cases use only earlier items in the remaining subproblem. The current item is considered exactly once.'],
    matrix: ['Which table order respects the matrix-chain dependencies?', ['Increasing subchain length.', 'Only the last row, left to right.', 'Decreasing subchain length.'], 0, 'Every split uses two strictly shorter subchains, so increasing length computes them first.'],
    lcs: ['Two different subsequences have the optimal length. Which is correct?', ['Only the one returned by upward tie-breaking.', 'Either, if both are subsequences of both strings.', 'Neither: an LCS must be unique.'], 1, 'LCS need not be unique. Feasibility and optimal length establish a valid answer.'],
    practice: ['What is missing from a table of optimal costs alone?', ['The number of table entries.', 'A way to recover which decisions form the solution.', 'The base cases must always be missing.'], 1, 'Save predecessors or infer a valid predecessor from the completed values to reconstruct a solution.']
  };
  document.querySelectorAll('[data-quiz]').forEach(root => {
    const [question, options, answer, explanation] = quizzes[root.dataset.quiz];
    const title = document.createElement('h3'); title.textContent = 'Check your understanding';
    const prompt = document.createElement('p'); prompt.textContent = question;
    const choices = document.createElement('div'); choices.className = 'dp-options';
    const feedback = document.createElement('p'); feedback.className = 'dp-status'; feedback.setAttribute('role', 'status');
    options.forEach((option, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = option; button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        choices.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true'); feedback.dataset.tone = i === answer ? 'good' : 'bad';
        feedback.textContent = (i === answer ? 'Correct. ' : 'Not quite. ') + explanation;
      }); choices.append(button);
    }); root.append(title, prompt, choices, feedback);
  });
  const completion = [...document.querySelectorAll('[data-complete]')], key = 'algorithms-dp-progress-v1';
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(stored)) completion.forEach(c => { c.checked = stored.includes(c.dataset.complete); });
  } catch (_) { /* Progress is still usable without persistent storage. */ }
  function updateProgress() {
    const complete = completion.filter(c => c.checked).map(c => c.dataset.complete);
    $('progress-label').textContent = `${complete.length} / ${completion.length} sections completed`;
    $('progress-fill').style.width = `${100 * complete.length / completion.length}%`;
    try { localStorage.setItem(key, JSON.stringify(complete)); } catch (_) { /* Optional persistence. */ }
  }
  completion.forEach(c => c.addEventListener('change', updateProgress));
  on('reset-progress', () => { completion.forEach(c => { c.checked = false; }); updateProgress(); }); updateProgress();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!entry) return;
      document.querySelectorAll('.dp-nav a').forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    }, { rootMargin: '-10% 0px -65% 0px' });
    document.querySelectorAll('.dp-unit').forEach(s => observer.observe(s));
  }
})();
