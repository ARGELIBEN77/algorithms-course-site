import React, { useState } from 'react';
import { Bullets, Callout, Caption, ChoiceRow, Closing, FileButton, FileCard, Group, Header, Heading, KeySentence, Paragraph, Text } from '@instinct/files';

/* ---------- shared bits ---------- */

function Pseudo({ children }: { children: React.ReactNode }) {
    return <pre className="pseudo">{children}</pre>;
}

function Feedback({ tone, text }: { tone: 'good' | 'bad' | 'info'; text: string }) {
    return <p className={`feedback feedback-${tone}`} role="status">{text}</p>;
}

/* ---------- diagrams ---------- */

const TEAL = 'var(--ds-teal, #73a89a)';
const RED = 'var(--ds-red, #ed313e)';
const INK2 = 'var(--ds-ink-2, #585254)';

function CoinDiagram() {
    const coins = [10, 10, 10, 5, 2, 1];
    return <figure className="diagram">
        <div className="coins">
            {coins.map((c, i) => <span key={i} className="coin">{c}</span>)}
        </div>
        <Caption>38 shekels = 10 + 10 + 10 + 5 + 2 + 1 - six coins, the greedy way.</Caption>
    </figure>;
}

function KnapsackCompareDiagram() {
    return <figure className="diagram">
        <div className="kbc-row">
            <span className="kbc-label">Fractional</span>
            <div className="kbc-bar">
                <span className="kbc-seg kbc-item" style={{ width: '20%' }}>item1</span>
                <span className="kbc-seg kbc-item" style={{ width: '40%' }}>item2</span>
                <span className="kbc-seg kbc-item kbc-part" style={{ width: '40%' }}>2/3 item3</span>
            </div>
            <span className="kbc-value kbc-good">NIS 240</span>
        </div>
        <div className="kbc-row">
            <span className="kbc-label">Whole items</span>
            <div className="kbc-bar">
                <span className="kbc-seg kbc-item" style={{ width: '20%' }}>item1</span>
                <span className="kbc-seg kbc-item" style={{ width: '40%' }}>item2</span>
                <span className="kbc-seg kbc-empty" style={{ width: '40%' }}>unused</span>
            </div>
            <span className="kbc-value">NIS 160</span>
        </div>
        <Caption>The highest-ratio rule fills all 50 kg when goods can be cut (NIS 240). With whole items it takes item1 + item2 and leaves 20 kg unused (NIS 160) - and item2 + item3 would give NIS 220.</Caption>
    </figure>;
}

function ActivityStaticDiagram() {
    const chosen = ['a1', 'a4', 'a8', 'a11'];
    return <figure className="diagram">
        <div className="tl">
            {ACTS.map(a => <div key={a.id} className={`tl-row tl-static${chosen.includes(a.id) ? ' tl-sel' : ''}`}>
                <span className="tl-label">{a.id}</span>
                <span className="tl-track">
                    <span className="tl-bar" style={{ left: `${(a.s / TMAX) * 100}%`, width: `${((a.f - a.s) / TMAX) * 100}%` }} />
                </span>
                <span className="tl-times">{a.s} → {a.f}</span>
            </div>)}
            <div className="tl-axis"><span className="tl-label" /><span className="tl-track tl-axis-track">
                {[0, 2, 4, 6, 8, 10, 12, 14].map(t => <span key={t} className="tl-tick" style={{ left: `${(t / TMAX) * 100}%` }}>{t}</span>)}
            </span><span className="tl-times" /></div>
        </div>
        <Caption>The example activities sorted by increasing finish time. Greedy selects a1, a4, a8, a11. Example adapted from slides by Igor Nor.</Caption>
    </figure>;
}

function HeaviestPathDiagram() {
    const node = (x: number, y: number, label: string) => <g>
        <circle cx={x} cy={y} r={17} fill="#fff" stroke={INK2} strokeWidth={1.5} />
        <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--ds-ink, #251f21)">{label}</text>
    </g>;
    const edge = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) =>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />;
    return <figure className="diagram">
        <svg viewBox="0 0 300 190" className="diagram-svg" role="img" aria-label="Tree: root 20, children 2 and 3; node 2 leads to 7 and 10, node 3 leads to 1">
            {edge(160, 32, 95, 88, TEAL, 3.5)}
            {edge(95, 112, 60, 158, 'var(--ds-ink-4, #c0bebf)', 1.5)}
            {edge(95, 112, 130, 158, TEAL, 3.5)}
            {edge(160, 32, 225, 88, RED, 3.5)}
            {edge(225, 112, 225, 158, RED, 3.5)}
            {node(160, 25, '20')}
            {node(95, 100, '2')}
            {node(225, 100, '3')}
            {node(60, 172, '7')}
            {node(130, 172, '10')}
            {node(225, 172, '1')}
        </svg>
        <Caption>Greedy takes the heavier child each time: 20 → 3 → 1 = 24. The optimum is 20 → 2 → 10 = 32. Example adapted from slides by Igor Nor.</Caption>
    </figure>;
}

function TrainPlatformsDiagram() {
    const events: { t: string; d: number }[] = [
        { t: '2.00', d: 1 }, { t: '2.10', d: 1 }, { t: '2.30', d: -1 }, { t: '3.00', d: 1 },
        { t: '3.20', d: -1 }, { t: '3.20', d: 1 }, { t: '3.50', d: 1 }, { t: '3.55', d: -1 },
        { t: '4.00', d: -1 }, { t: '4.30', d: -1 }, { t: '5.00', d: 1 }, { t: '5.20', d: -1 },
    ];
    const W = 340, H = 150, left = 26, top = 16, bottom = 42;
    const stepX = (W - left - 8) / events.length;
    const yFor = (v: number) => top + (3 - v) * ((H - top - bottom) / 3);
    let curr = 0;
    const pts: string[] = [`${left},${yFor(0)}`];
    const marks: { x: number; y: number; v: number; d: number; t: string }[] = [];
    events.forEach((e, i) => {
        const x = left + stepX * (i + 1);
        pts.push(`${x},${yFor(curr)}`);
        curr += e.d;
        pts.push(`${x},${yFor(curr)}`);
        marks.push({ x, y: yFor(curr), v: curr, d: e.d, t: e.t });
    });
    return <figure className="diagram">
        <svg viewBox={`0 0 ${W} ${H}`} className="diagram-svg diagram-wide" role="img" aria-label="Sweep of the train-station day: platforms in use peak at 3">
            {[0, 1, 2, 3].map(v => <g key={v}>
                <line x1={left} y1={yFor(v)} x2={W - 8} y2={yFor(v)} stroke="var(--ds-hairline, #eae9ea)" strokeWidth={1} />
                <text x={left - 6} y={yFor(v) + 4} textAnchor="end" fontSize={10} fill={INK2}>{v}</text>
            </g>)}
            <polyline points={pts.join(' ')} fill="none" stroke={TEAL} strokeWidth={2.5} strokeLinejoin="round" />
            {marks.map((m, i) => <g key={i}>
                <circle cx={m.x} cy={m.y} r={3} fill={m.d > 0 ? TEAL : INK2} />
                <text x={m.x} y={H - 26} textAnchor="end" fontSize={9} fill={INK2} transform={`rotate(-40 ${m.x} ${H - 26})`}>{m.t}</text>
            </g>)}
            <text x={W - 10} y={yFor(3) - 6} textAnchor="end" fontSize={11} fontWeight={600} fill={TEAL}>peak: 3 platforms</text>
        </svg>
        <Caption>Walking the day with two indices: arrivals (teal dots) raise the count, departures (gray dots) lower it. The peak, 3, is the minimum number of platforms.</Caption>
    </figure>;
}

/* ---------- Game 1: same knapsack, two modes ---------- */

type Item = { id: string; w: number; v: number };
const ITEMS: Item[] = [
    { id: 'item1', w: 10, v: 60 },
    { id: 'item2', w: 20, v: 100 },
    { id: 'item3', w: 30, v: 120 },
];
const CAP = 50;
const WHOLE_OPTIMUM = 220;

function ratio(item: Item) { return item.v / item.w; }

function KnapsackGame() {
    const [mode, setMode] = useState<'fractional' | 'whole'>('fractional');
    const [taken, setTaken] = useState<Record<string, number>>({});
    const [msg, setMsg] = useState<{ tone: 'good' | 'bad' | 'info'; text: string } | null>(null);

    const used = ITEMS.reduce((sum, it) => sum + (taken[it.id] ?? 0), 0);
    const totalValue = ITEMS.reduce((sum, it) => sum + (taken[it.id] ?? 0) * ratio(it), 0);
    const remaining = CAP - used;
    const fractionalDone = mode === 'fractional' && remaining <= 0;
    const wholeDone = mode === 'whole' && ITEMS.every(it => (taken[it.id] ?? 0) > 0 || it.w > remaining);
    const done = fractionalDone || wholeDone;

    function reset(nextMode?: 'fractional' | 'whole') {
        setTaken({});
        setMsg(null);
        if (nextMode) setMode(nextMode);
    }

    function take(item: Item) {
        if (done) return;
        const already = taken[item.id] ?? 0;
        const candidates = ITEMS.filter(it => (taken[it.id] ?? 0) < it.w && (mode === 'fractional' || it.w <= remaining));
        const best = candidates.reduce((a, b) => (ratio(a) >= ratio(b) ? a : b));
        if (mode === 'fractional') {
            const amount = Math.min(item.w - already, remaining);
            if (amount <= 0) return;
            const next = { ...taken, [item.id]: already + amount };
            setTaken(next);
            if (item.id === best.id) {
                const part = amount === item.w ? `all ${amount} kg of ${item.id}` : `${amount} kg of ${item.id} (all that still fits)`;
                setMsg({ tone: 'good', text: `${item.id} has the highest remaining value per kg (${ratio(item)} NIS/kg). Taking ${part}.` });
            } else {
                setMsg({ tone: 'bad', text: `Greedy would take ${best.id} first - it has the highest remaining value per kg (${ratio(best)} NIS/kg). You took ${amount} kg of ${item.id} anyway.` });
            }
        } else {
            if (item.w > remaining) {
                setMsg({ tone: 'bad', text: `${item.id} weighs ${item.w} kg and only ${remaining} kg is free - it does not fit whole.` });
                return;
            }
            setTaken({ ...taken, [item.id]: item.w });
            if (item.id === best.id) {
                setMsg({ tone: 'good', text: `${item.id} has the highest remaining value per kg (${ratio(item)} NIS/kg) - the greedy pick.` });
            } else {
                setMsg({ tone: 'info', text: `You skipped ${best.id} (${ratio(best)} NIS/kg, the greedy pick) and took ${item.id} whole.` });
            }
        }
    }

    function verdict() {
        if (fractionalDone) {
            return Math.round(totalValue) === 240
                ? { tone: 'good' as const, text: `Knapsack full. Total value NIS ${Math.round(totalValue)} - the optimum. The highest-ratio rule always solves the fractional problem.` }
                : { tone: 'info' as const, text: `Knapsack full. Total value NIS ${Math.round(totalValue)}. Following the highest-ratio rule from the start gives NIS 240, the fractional optimum.` };
        }
        if (wholeDone) {
            return Math.round(totalValue) === WHOLE_OPTIMUM
                ? { tone: 'good' as const, text: `No more whole item fits. Total value NIS ${Math.round(totalValue)} - item2 + item3 is the optimum. Greedy by ratio would stop at NIS 160.` }
                : { tone: 'bad' as const, text: `No more whole item fits. Total value NIS ${Math.round(totalValue)}. The best whole-item packing is item2 + item3 = NIS 220: the ratio rule that was optimal for the fractional problem fails here.` };
        }
        return null;
    }

    const v = verdict();

    return <div className="game">
        <ChoiceRow
            label="Mode"
            options={[{ value: 'fractional', label: 'Fractional (can cut goods)' }, { value: 'whole', label: 'Whole items only' }]}
            value={mode}
            onChange={value => reset(value as 'fractional' | 'whole')}
        />
        <Paragraph>{mode === 'fractional'
            ? 'Click an item to put in as much of it as fits. Try to fill the knapsack following the greedy rule: highest value per kg first.'
            : 'Click an item to put it in whole. The knapsack holds 50 kg. Try to get the most value you can.'}</Paragraph>
        <div className="kb-items">
            {ITEMS.map(it => {
                const t = taken[it.id] ?? 0;
                const full = t >= it.w;
                const blocked = done || full || (mode === 'whole' && it.w > remaining);
                return <div className="kb-row" key={it.id}>
                    <FileButton
                        variant={full ? 'primary' : 'secondary'}
                        compact
                        selected={full}
                        disabled={blocked && !full}
                        onClick={() => take(it)}
                    >{full ? `${it.id} - in` : it.id}</FileButton>
                    <span className="kb-facts">{it.w} kg, NIS {it.v} ({ratio(it)} NIS/kg){t > 0 && !full ? ` - ${t} kg in` : ''}</span>
                </div>;
            })}
        </div>
        <div className="kb-bar" aria-label={`Knapsack load ${used} of ${CAP} kg`}>
            <div className="kb-fill" style={{ width: `${(used / CAP) * 100}%` }} />
        </div>
        <Caption>Knapsack: {used} / {CAP} kg, value so far NIS {Math.round(totalValue)}</Caption>
        {msg && !v && <Feedback tone={msg.tone} text={msg.text} />}
        {v && <Feedback tone={v.tone} text={v.text} />}
        <FileButton variant="ghost" compact onClick={() => reset()}>Restart the knapsack</FileButton>
    </div>;
}

/* ---------- Game 2: activity selection - guided, free play, walkthrough ---------- */

type Act = { id: string; s: number; f: number };
const ACTS: Act[] = [
    { id: 'a1', s: 1, f: 4 }, { id: 'a2', s: 3, f: 5 }, { id: 'a3', s: 0, f: 6 },
    { id: 'a4', s: 5, f: 7 }, { id: 'a5', s: 3, f: 8 }, { id: 'a6', s: 5, f: 9 },
    { id: 'a7', s: 6, f: 10 }, { id: 'a8', s: 8, f: 11 }, { id: 'a9', s: 8, f: 12 },
    { id: 'a10', s: 2, f: 13 }, { id: 'a11', s: 12, f: 14 },
];
const TMAX = 14;

type ActMode = 'guided' | 'free' | 'steps';

type Step = { line: number; desc: string; A: number[]; j: number; i: number | null; final?: boolean };

/* Simulate Greedy-Activity-Selector on ACTS, one display step per pseudocode line. */
function buildSteps(): Step[] {
    const steps: Step[] = [];
    const n = ACTS.length;
    steps.push({ line: 1, desc: `n = ${n}. The activities are already sorted by increasing finish time: f1 ≤ f2 ≤ ... ≤ f${n}.`, A: [], j: 0, i: null });
    steps.push({ line: 2, desc: 'A = {1}: take a1, the activity that finishes earliest.', A: [1], j: 0, i: null });
    steps.push({ line: 3, desc: 'j = 1: a1 is the last selected activity; it finishes at f1 = 4.', A: [1], j: 1, i: null });
    let A = [1];
    let j = 1;
    for (let i = 2; i <= n; i++) {
        const ai = ACTS[i - 1];
        const aj = ACTS[j - 1];
        steps.push({ line: 4, desc: `i = ${i}: consider a${i} (starts ${ai.s}, finishes ${ai.f}).`, A: [...A], j, i });
        if (ai.s >= aj.f) {
            steps.push({ line: 5, desc: `Is s${i} ≥ f${j}? ${ai.s} ≥ ${aj.f} - yes, a${i} is compatible with the last selected activity.`, A: [...A], j, i });
            A = [...A, i];
            steps.push({ line: 6, desc: `A = A ∪ {${i}}: select a${i}.`, A: [...A], j, i });
            j = i;
            steps.push({ line: 7, desc: `j = ${i}: the last selected activity is now a${i}, finishing at ${ai.f}.`, A: [...A], j, i });
        } else {
            steps.push({ line: 5, desc: `Is s${i} ≥ f${j}? ${ai.s} ≥ ${aj.f} - no, a${i} overlaps a${j}, so it stays out.`, A: [...A], j, i });
        }
    }
    steps.push({ line: 8, desc: `return A = {${A.map(x => 'a' + x).join(', ')}} - ${A.length} activities, the optimum.`, A: [...A], j, i: null, final: true });
    return steps;
}
const STEPS = buildSteps();
const GREEDY_SET = STEPS[STEPS.length - 1].A;
const OPT_SIZE = GREEDY_SET.length;

const PC_LINES: { num: number | null; text: string }[] = [
    { num: null, text: 'Greedy-Activity-Selector(s, f)' },
    { num: 1, text: '1. n <- length(s)' },
    { num: 2, text: '2. A <- {1}      // selected activities' },
    { num: 3, text: '3. j <- 1        // last selected' },
    { num: 4, text: '4. for i = 2 to n' },
    { num: 5, text: '5.     if si >= fj' },
    { num: 6, text: '6.         then A <- A ∪ {i}' },
    { num: 7, text: '7.              j <- i' },
    { num: 8, text: '8. return A' },
];

function ActivityGame() {
    const [mode, setMode] = useState<ActMode>('guided');

    /* guided mode state */
    const [gSel, setGSel] = useState<Act[]>([]);
    const [gMsg, setGMsg] = useState<{ tone: 'good' | 'bad' | 'info'; text: string } | null>(null);

    /* free-play mode state */
    const [fSel, setFSel] = useState<Act[]>([]);
    const [fMsg, setFMsg] = useState<{ tone: 'good' | 'bad' | 'info'; text: string } | null>(null);

    /* walkthrough mode state */
    const [stepIdx, setStepIdx] = useState(0);
    const step = STEPS[stepIdx];

    /* ---------- guided ---------- */
    const gLast = gSel.length === 0 ? 0 : gSel[gSel.length - 1].f;
    const gCompatible = ACTS.filter(a => a.s >= gLast && !gSel.some(x => x.id === a.id));
    const gDone = gCompatible.length === 0;

    function gPick(a: Act) {
        if (gDone || gSel.some(x => x.id === a.id)) return;
        if (a.s < gLast) {
            setGMsg({ tone: 'bad', text: `${a.id} starts at ${a.s}, before the last selected activity finishes at ${gLast} - it clashes.` });
            return;
        }
        const expected = gCompatible.reduce((m, x) => (x.f < m.f ? x : m));
        if (a.id === expected.id) {
            const next = [...gSel, a];
            setGSel(next);
            const rest = ACTS.filter(x => x.s >= a.f && !next.some(y => y.id === x.id));
            if (rest.length === 0) {
                setGMsg({ tone: 'good', text: `${a.id} starts at ${a.s} ≥ ${gLast}: selected. Answer: {a1, a4, a8, a11} - the optimum, built step by step.` });
            } else {
                setGMsg({ tone: 'good', text: `${a.id} starts at ${a.s} ≥ ${gLast}: selected. The line moves to f = ${a.f}.` });
            }
        } else {
            setGMsg({ tone: 'info', text: `${a.id} is compatible, but greedy takes the compatible activity that finishes earliest: ${expected.id} finishes at ${expected.f}.` });
        }
    }

    /* ---------- free play ---------- */
    const fLast = fSel.length === 0 ? 0 : Math.max(...fSel.map(x => x.f));

    function fToggle(a: Act) {
        if (fSel.some(x => x.id === a.id)) {
            const next = fSel.filter(x => x.id !== a.id);
            setFSel(next);
            setFMsg({ tone: 'info', text: `${a.id} removed. ${next.length === 0 ? 'No activities selected.' : `${next.length} still selected.`}` });
            return;
        }
        const clash = fSel.find(x => a.s < x.f && x.s < a.f);
        if (clash) {
            setFMsg({ tone: 'bad', text: `${a.id} (${a.s} → ${a.f}) overlaps ${clash.id} (${clash.s} → ${clash.f}) - compatible activities only.` });
            return;
        }
        const next = [...fSel, a];
        setFSel(next);
        setFMsg({ tone: 'info', text: `${a.id} added - ${next.length} selected. Press "Check my schedule" when you are done.` });
    }

    function fCheck() {
        const mine = [...fSel].sort((x, y) => x.f - y.f).map(x => x.id);
        if (mine.length === 0) {
            setFMsg({ tone: 'info', text: 'Select some activities first, then check.' });
            return;
        }
        if (mine.length === OPT_SIZE) {
            const same = mine.join(',') === GREEDY_SET.map(x => 'a' + x).join(',');
            setFMsg({ tone: 'good', text: same
                ? `{${mine.join(', ')}} - ${OPT_SIZE} compatible activities, the optimum. Exactly the schedule the greedy rule builds.`
                : `{${mine.join(', ')}} - ${OPT_SIZE} compatible activities, the optimum. Different from the greedy answer {a1, a4, a8, a11} - and just as good.` });
        } else {
            setFMsg({ tone: 'info', text: `${mine.length} compatible ${mine.length === 1 ? 'activity' : 'activities'} - but ${OPT_SIZE} fit in this example. Can you squeeze in one more?` });
        }
    }

    /* ---------- shared timeline view ---------- */
    const selIds = mode === 'guided' ? gSel.map(x => x.id) : mode === 'free' ? fSel.map(x => x.id) : step.A.map(x => 'a' + x);
    const curId = mode === 'steps' && step.i !== null ? `a${step.i}` : null;
    const skipIds = mode === 'steps'
        ? ACTS.filter(a => { const idx = Number(a.id.slice(1)); return idx >= 2 && idx < (step.i ?? ACTS.length + 1) && !step.A.includes(idx); }).map(a => a.id)
        : [];
    const lineAt = mode === 'guided' ? gLast : mode === 'free' ? fLast : (step.j >= 1 ? ACTS[step.j - 1].f : 0);

    const intro = mode === 'guided'
        ? 'Eleven activities, sorted by increasing finish time. Click the activity the greedy algorithm takes next. The dotted line marks when the last selected activity finishes.'
        : mode === 'free'
            ? 'Same eleven activities, your rules. Click an activity to add it, click it again to remove it, and build any compatible schedule you like. Then check whether yours is optimal.'
            : 'Walk through Greedy-Activity-Selector one line at a time. Watch the variables A, j and i, and see each decision on the timeline.';

    return <div className="game">
        <ChoiceRow
            label="Mode"
            options={[
                { value: 'guided', label: 'Guided (earliest finish first)' },
                { value: 'free', label: 'Free play' },
                { value: 'steps', label: 'Pseudocode steps' },
            ]}
            value={mode}
            onChange={value => setMode(value as ActMode)}
        />
        <Paragraph>{intro}</Paragraph>
        {mode === 'steps' && <>
            <div className="pseudo pc">
                {PC_LINES.map(l => <span key={l.text} className={`pc-line${l.num !== null && l.num === step.line ? ' pc-on' : ''}`}>{l.text}</span>)}
            </div>
            <Caption>{`A = {${step.A.map(x => 'a' + x).join(', ')}} · j = ${step.j >= 1 ? step.j : '-'} · i = ${step.i ?? '-'}`}</Caption>
        </>}
        <div className="tl">
            {ACTS.map(a => {
                const isSel = selIds.includes(a.id);
                const isCur = curId === a.id && !isSel;
                const isSkip = skipIds.includes(a.id);
                return <button
                    key={a.id}
                    type="button"
                    className={`tl-row${isSel ? ' tl-sel' : ''}${isCur ? ' tl-cur' : ''}${isSkip ? ' tl-skip' : ''}${mode === 'steps' ? ' tl-static' : ''}`}
                    onClick={() => { if (mode === 'guided') gPick(a); else if (mode === 'free') fToggle(a); }}
                    aria-label={`${a.id}, starts ${a.s}, finishes ${a.f}${isSel ? ', selected' : ''}${isCur ? ', being considered' : ''}`}
                >
                    <span className="tl-label">{a.id}</span>
                    <span className="tl-track">
                        <span className="tl-bar" style={{ left: `${(a.s / TMAX) * 100}%`, width: `${((a.f - a.s) / TMAX) * 100}%` }} />
                        <span className="tl-line" style={{ left: `${(lineAt / TMAX) * 100}%` }} />
                    </span>
                    <span className="tl-times">{a.s} → {a.f}</span>
                </button>;
            })}
            <div className="tl-axis"><span className="tl-label" /><span className="tl-track tl-axis-track">
                {[0, 2, 4, 6, 8, 10, 12, 14].map(t => <span key={t} className="tl-tick" style={{ left: `${(t / TMAX) * 100}%` }}>{t}</span>)}
            </span><span className="tl-times" /></div>
        </div>
        {mode === 'guided' && gMsg && <Feedback tone={gMsg.tone} text={gMsg.text} />}
        {mode === 'guided' && <FileButton variant="ghost" compact onClick={() => { setGSel([]); setGMsg(null); }}>Restart the schedule</FileButton>}
        {mode === 'free' && fMsg && <Feedback tone={fMsg.tone} text={fMsg.text} />}
        {mode === 'free' && <div className="pc-controls">
            <FileButton variant="primary" compact onClick={fCheck}>Check my schedule</FileButton>
            <FileButton variant="ghost" compact onClick={() => { setFSel([]); setFMsg(null); }}>Restart</FileButton>
        </div>}
        {mode === 'steps' && <Feedback tone={step.final ? 'good' : 'info'} text={step.desc} />}
        {mode === 'steps' && <div className="pc-controls">
            <FileButton variant="primary" compact disabled={stepIdx >= STEPS.length - 1} onClick={() => setStepIdx(stepIdx + 1)}>Next step</FileButton>
            <FileButton variant="ghost" compact onClick={() => setStepIdx(0)}>Restart the walkthrough</FileButton>
        </div>}
    </div>;
}

/* ---------- page ---------- */

export function App() {
    return <FileCard>
        <Header
            title="Greedy Algorithms"
            intro="Lecture notes and four interactive exercises."
        />

        <Group label="Opening" heading="What is a greedy algorithm?">
            <Text>
                <Paragraph>A greedy algorithm solves an optimization problem.</Paragraph>
                <Bullets items={[
                    'Optimal substructure: an optimal solution contains in it optimal solutions to subproblems.',
                    'Greedy strategy: at each decision point, do what looks best "locally". A top-down structure: with each step, reduce the problem to a smaller problem.',
                    'Greedy choice property: "locally best" = globally best.',
                ]} />
            </Text>
        </Group>

        <Group label="First example" heading="Coin change">
            <Text>
                <Paragraph>Problem: give change for n Shekels using the minimum number of coins. Coins: 1, 2, 5 and 10 shekels. Example: n = 38 shekels.</Paragraph>
            </Text>
            <Pseudo>{`S <- set of all coins
A <- 0              // number of used coins
while n > 0 {
    C <- maximum coin in S
    A <- A + floor(n / C)
    n <- n - floor(n / C) * C
    S <- S - {C}
}`}</Pseudo>
            <CoinDiagram />
            <Callout title="Think about it" tone="note">Can you think of an example where greedy is not optimal?</Callout>
        </Group>

        <Group label="Second example" heading="The fractional knapsack problem">
            <Text>
                <Paragraph>A knapsack can contain a certain weight C of goods. Under this capacity constraint, maximize the total value of the goods you put in.</Paragraph>
                <Paragraph>Example: candy NIS 50 for 10 kilos, chocolate NIS 40 for 5 kilos, ice cream NIS 30 for 5 kilos. If C = 14 kilos, what would you do?</Paragraph>
                <Paragraph>Formally: given G1, G2, ..., Gn, each Gi with weight wi and value vi, let fi (0 ≤ fi ≤ 1) be the fraction of Gi taken. Maximize the total value subject to the total weight not exceeding C. A choice of fractions that respects the capacity is a feasible solution; one of maximum value is an optimal solution.</Paragraph>
            </Text>
            <Pseudo>{`S <- set of all vi / wi
while C > 0 {
    i <- index of maximum value in S
    S <- S - {vi / wi}
    if (wi < C) {
        take wi kilos of item i
        C <- C - wi
    } else {
        take C kilos of item i
        C <- 0
    }
}`}</Pseudo>
        </Group>

        <Group label="Same story, whole items" heading="The integer knapsack problem">
            <Text>
                <Paragraph>Same input, but this time fi ∈ {'{'}0, 1{'}'} - you cannot cut goods in the middle.</Paragraph>
                <Paragraph>Example: item1 is 10 kg worth NIS 60, item2 is 20 kg worth NIS 100, item3 is 30 kg worth NIS 120, and the knapsack holds 50 kg.</Paragraph>
            </Text>
            <KnapsackCompareDiagram />
            <Callout title="Think about it" tone="note">Can you think of an example where greedy is not optimal?</Callout>
        </Group>

        <Group label="Try it" heading="Game: same knapsack, two games">
            <Text><KeySentence>Fill the knapsack twice: once cutting goods freely, once taking whole items. Watch where the greedy rule works and where it fails.</KeySentence></Text>
            <KnapsackGame />
            <Caption>Fractional: the highest value/weight rule works, NIS 240. Whole items: the same rule may fail.</Caption>
        </Group>

        <Group label="Third example" heading="Activity selection">
            <Text>
                <Paragraph>Problem: given S = {'{'}1, 2, ..., n{'}'} of n activities, each activity i with start time si and finish time fi (si &lt; fi). Activities i and j are compatible if they do not overlap. Objective: select a maximum-sized set of mutually compatible activities.</Paragraph>
                <Paragraph>Solution: order the activities by increasing finishing time, f1 ≤ f2 ≤ ... ≤ fn.</Paragraph>
            </Text>
            <Pseudo>{`Greedy-Activity-Selector(s, f)
1. n <- length(s)
2. A <- {1}      // selected activities
3. j <- 1        // last selected
4. for i = 2 to n
5.     if si >= fj
6.         then A <- A ∪ {i}
7.              j <- i
8. return A`}</Pseudo>
            <ActivityStaticDiagram />
        </Group>

        <Group label="Try it" heading="Game: build the greedy schedule">
            <ActivityGame />
            <Caption>Example adapted from slides by Igor Nor.</Caption>
        </Group>

        <Group label="Why it works" heading="Optimality of activity selection">
            <Text>
                <KeySentence>Theorem: Greedy-Activity-Selector is optimal.</KeySentence>
                <Paragraph>Loop invariant: before iteration i we hold a feasible solution for activities 1, ..., i-1 with (1) |A| maximal and (2) j minimal for this |A|. The invariant is proven by induction on i; the base case i = 2, |A| = 1, j = 1 is trivial.</Paragraph>
                <Paragraph>Maximality: assume a set Bi with |Bi| &gt; |Ai|. If ai ∉ Bi, then Bi is an optimal solution for {'{'}1...i-1{'}'}, contradicting (1). Otherwise ai ∈ Bi and ai ∉ Ai; but if greedy did not select ai, it is because ai overlapped the last activity in {'{'}1...i-1{'}'}, contradicting (2).</Paragraph>
                <Paragraph>Minimal j (earliest finish time): assume a set Bi with |Bi| = |Ai| whose last activity finishes earlier. ai ∈ Bi is impossible (then j would be maximal, contradicting (2)); otherwise Bi is optimal for {'{'}1...i-1{'}'}, where Ai-1 is already optimal with minimal j - a contradiction.</Paragraph>
            </Text>
        </Group>

        <Group label="Knowing the limits" heading="Where greedy fails">
            <Text>
                <Heading sub="Same goal, new constraint">Weighted activity selection</Heading>
                <Paragraph>Now each activity also has a weight wi, and we want to maximize the sum of weights. With all weights equal, earliest finish first works. With different weights it may fail: greedy takes three light activities, the best possible count, but if one heavy activity outweighs all three together, the weighted optimum is that activity alone.</Paragraph>
                <Heading sub="Heaviest path">A small tree example</Heading>
                <Paragraph>Task: find the heaviest path from the root to a leaf. Greedy rule: at each node, take the heavier child. Greedy gets 20 → 3 → 1 = 24, while the optimum is 20 → 2 → 10 = 32. Local best is not always global best - we must know when greedy works.</Paragraph>
                <HeaviestPathDiagram />
                <Heading sub="Exercise">Tasks with deadlines</Heading>
                <Paragraph>All tasks are available at time 0; each task i has a duration di and a deadline ti, and tasks are performed one at a time. The delay of a task is how long after its deadline it finishes (0 if on time). Proposed rule: at each step, perform the shortest remaining task. Does it guarantee the smallest possible maximum delay?</Paragraph>
                <Paragraph>Counterexample: task A has duration 1 and deadline 100; task B has duration 10 and deadline 1. Shortest first (A then B): B finishes at 11, maximum delay 10. Better order (B then A): B finishes at 10 with delay 9, A finishes at 11 with delay 0 - maximum delay 9. The correct greedy rule: earliest deadline first.</Paragraph>
            </Text>
        </Group>

        <Group label="Practice" heading="Four greedy exercises">
            <Text>
                <Heading>The refueling scheduling problem</Heading>
                <details className="practice-reveal"><summary>Hint</summary><p>Sort, then refuel</p></details>
                <Paragraph>N cars wait to refuel; car i takes Timei. Choose the refueling order so the total waiting time of all cars is minimal. Solution: sort by non-decreasing refueling time and refuel in that order, in Θ(n log n). Correctness by exchange: swapping two consecutive cars with times a &gt; b leaves the other cars unchanged and decreases the pair's combined waiting time by a - b, so repeating brings the sorted order without increasing the total.</Paragraph>
                <Heading>The polynomial coefficients problem</Heading>
                <details className="practice-reveal"><summary>Hint</summary><p>Small coefficients first</p></details>
                <Paragraph>Given an array A of n natural numbers A0..An-1 and X &gt; 1, order the elements so the polynomial A0 + A1X + ... + An-1X^(n-1) is maximal. Solution: sort the array in ascending order, in Θ(n log n). Greedy choice: in an optimal solution A0 is the lowest value - swapping it with a smaller Amin at index i increases the value, since X &gt; 1. Optimal substructure: the rest of an optimal ordering is optimal for the polynomial starting from X.</Paragraph>
                <Heading>Sale at Reuben's kiosk</Heading>
                <details className="practice-reveal"><summary>Hint</summary><p>Pair the expensive ones</p></details>
                <Paragraph>A sale gives the cheaper product of every pair for free. After choosing 2n products, pair them so the total paid is minimal. Solution: sort the prices x1 ≥ x2 ≥ ... ≥ x2n and pair adjacent products, in Θ(n log n). Exchange argument: replacing the pairs of x1 and x2 with (x1, x2) and their partners never costs more, so some optimal pairing contains (x1, x2); remove it and repeat.</Paragraph>
                <Heading>Minimum number of open platforms at a train station</Heading>
                <details className="practice-reveal"><summary>Hint</summary><p>Two sorted lists</p></details>
                <Paragraph>Given arrays A of arrival times and D of departure times, find the minimum number of platforms needed so no train waits. Sort A and D, then walk the day with two indices: when the next arrival is earlier than the next departure, a train enters (curr grows); otherwise a train leaves (curr shrinks). The peak of curr is the answer.</Paragraph>
            </Text>
            <Pseudo>{`MinPlatforms(A[0..n-1], D[0..n-1]):
    sort(A); sort(D)          // ascending
    i <- 0; j <- 0
    curr <- 0                 // trains at the station now
    ans <- 0                  // max of curr so far
    while i < n and j < n:
        if A[i] < D[j]:       // next arrival first
            curr <- curr + 1
            ans <- max(ans, curr)
            i <- i + 1
        else:                 // train departs, frees a platform
            curr <- curr - 1
            j <- j + 1
    return ans`}</Pseudo>
            <TrainPlatformsDiagram />
            <Caption>Example: A = [2.00, 2.10, 3.00, 3.20, 3.50, 5.00], D = [2.30, 3.20, 3.55, 4.00, 4.30, 5.20] after sorting. The peak is 3 platforms.</Caption>
        </Group>


<div className="group" id="additional-practice">
<div className="glabel">More practice</div>
<h2>Try it yourself</h2>
<p>Try each problem before opening the hints. The worked solution is available when you want to compare your reasoning.</p>
<article className="practice-exercise" aria-labelledby="extra-title-1">
<h3 id="extra-title-1">Find a counterexample</h3>
<p>You have unlimited coins worth 1, 3 and 4. Make 6 using the fewest coins.</p>
<ol><li>What does "take the largest coin that fits" produce?</li><li>Can you do better?</li><li>What does this show about the rule?</li></ol>
<details className="practice-reveal"><summary>Hint 1</summary><p>After taking 4, how much remains?</p></details><details className="practice-reveal"><summary>Hint 2</summary><p>Try a solution that does not use 4.</p></details><details className="practice-reveal"><summary>Worked solution</summary><p>Greedy chooses 4 + 1 + 1: three coins. Choosing 3 + 3 uses two coins. Two is optimal because no single available coin is worth 6.</p><p>This counterexample proves that largest-first does not always minimize the number of coins for denominations 1, 3 and 4. It does not mean that every greedy algorithm fails.</p></details>
</article>
<article className="practice-exercise" aria-labelledby="extra-title-2">
<h3 id="extra-title-2">Choose an order and justify it</h3>
<p>Three cars are waiting at time 0. Refueling takes 8, 2 and 5 minutes, and only one car can refuel at a time.</p>
<ol><li>Choose an order that minimizes total waiting time before refueling starts.</li><li>Calculate that total.</li><li>Explain why swapping two neighbouring cars supports your rule.</li></ol>
<details className="practice-reveal"><summary>Hint 1</summary><p>Write the three waiting times for your order.</p></details><details className="practice-reveal"><summary>Hint 2</summary><p>Compare two neighbouring cars taking a and b minutes. What happens if the longer one goes second?</p></details><details className="practice-reveal"><summary>Worked solution</summary><p>Order: 2, 5, 8. Waiting times: 0, 2, 7. Total waiting time: 9 minutes.</p><p>For adjacent cars with a &gt; b and common starting time T, their combined waiting time changes from T + (T + a) to T + (T + b): a decrease of a - b. Later cars start at the same time because a + b is unchanged. Removing every such inversion gives non-decreasing refueling times without increasing total waiting time. Sorting takes O(n log n) time.</p></details>
</article>
<article className="practice-exercise" aria-labelledby="extra-title-3">
<h3 id="extra-title-3">Compare two greedy rules</h3>
<p>Activities: A=[0,6), B=[1,3), C=[3,5), D=[5,7). An activity may start exactly when another ends.</p>
<ol><li>Select activities using earliest start first.</li><li>Repeat using earliest finish first.</li><li>Which result is optimal here? Explain.</li><li>Does this example alone prove a rule always works?</li></ol>
<details className="practice-reveal"><summary>Hint 1</summary><p>After choosing A, which other activities still fit?</p></details><details className="practice-reveal"><summary>Hint 2</summary><p>Try omitting A.</p></details><details className="practice-reveal"><summary>Worked solution</summary><p>Earliest start first chooses only A. Earliest finish first chooses B, C, D: three activities.</p><p>Three is optimal for this input: the only fourth activity is A, which overlaps all three. This is a counterexample to earliest start first. It is not, by itself, a proof that earliest finish first always works. Successful examples do not cover every input; one counterexample is enough to refute an always claim.</p></details>
</article>
</div>

        <Closing>Elina Benenson Opalinsky. Based on slides by Prof. Dana Shapira and Dr Igor Nor.</Closing>
    </FileCard>;
}
