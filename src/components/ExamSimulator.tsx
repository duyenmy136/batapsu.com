'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, geminiModel } from '@/lib/firebase';
import { useAuth } from './AuthProvider';

/* ── types ── */
export interface ExamQuestion {
    id: number;
    ka: string;
    question: string;
    options: string[];
    correct: number; // 0-based index
    explanation: string;
}

export interface ExamConfig {
    title: string;
    certName: string;
    totalTimeMinutes: number;
    passingScore: number; // percentage
    questionsPerExam: number; // how many to pick from pool
    kaLabels: Record<string, string>;
    kaDistribution: Record<string, number>; // how many per KA
    questionPool: ExamQuestion[];
}

type Phase = 'intro' | 'exam' | 'result';

/* ── helpers ── */
function fmt(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface KaDetail { ka: string; label: string; total: number; correct: number; pct: number; }
interface WrongQ { id: number; ka: string; question: string; correctAnswer: string; userAnswer: string; }

function buildAiPrompt(certName: string, pct: number, kaDetail: KaDetail[], wrongQuestions: WrongQ[]) {
    const kaLines = kaDetail.map(k => `- ${k.label}: ${k.correct}/${k.total} (${k.pct}%)`).join('\n');
    const wrongLines = wrongQuestions.slice(0, 15).map(q =>
        `- [${q.ka}] "${q.question}" — User chose: "${q.userAnswer}" — Correct: "${q.correctAnswer}"`
    ).join('\n');

    return `You are a BABOK v3 exam preparation coach. A student just completed a ${certName} practice exam.

Score: ${pct}%

Knowledge Area breakdown:
${kaLines}

Sample wrong answers (up to 15):
${wrongLines}

Based on this result, provide a personalized analysis in Vietnamese (HTML format only, NO markdown, use <h4>, <ul>, <li>, <strong>, <p> tags, do NOT wrap in code blocks):
1. Tổng quan đánh giá (2-3 câu)
2. Điểm mạnh (KA nào tốt)
3. Điểm yếu cần cải thiện (KA nào thấp, vì sao dựa trên wrong answers)
4. Lộ trình ôn tập cụ thể — liệt kê chapters BABOK để đọc lại, techniques cần nắm
5. Tips chiến lược làm bài

Keep it concise, actionable, and encouraging. Return ONLY the HTML content, no markdown fences.`;
}

/* ── shuffle helper ── */
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickQuestions(pool: ExamQuestion[], distribution: Record<string, number>): ExamQuestion[] {
    const picked: ExamQuestion[] = [];
    for (const [ka, count] of Object.entries(distribution)) {
        const kaPool = shuffle(pool.filter(q => q.ka === ka));
        picked.push(...kaPool.slice(0, count));
    }
    return shuffle(picked);
}

/* ── component ── */
export default function ExamSimulator({ config }: { config: ExamConfig }) {
    const { title, certName, totalTimeMinutes, passingScore, kaLabels, questionPool, kaDistribution, questionsPerExam } = config;

    const [phase, setPhase] = useState<Phase>('intro');
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [flagged, setFlagged] = useState<Set<number>>(() => new Set());
    const [timeLeft, setTimeLeft] = useState(totalTimeMinutes * 60);
    const [showNav, setShowNav] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const answersRef = useRef(answers);
    answersRef.current = answers;
    const { user } = useAuth();

    const startExam = useCallback(() => {
        const picked = pickQuestions(questionPool, kaDistribution);
        setQuestions(picked);
        setAnswers(picked.map(() => null));
        setFlagged(new Set());
        setCurrent(0);
        setTimeLeft(totalTimeMinutes * 60);
        setPhase('exam');
    }, [questionPool, kaDistribution, totalTimeMinutes]);

    /* timer */
    useEffect(() => {
        if (phase !== 'exam') return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    setPhase('result');
                    // save on timeout — use ref for latest answers
                    saveResultToFirestore(answersRef.current, 0);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [phase]);

    const pick = useCallback((idx: number) => {
        setAnswers((prev) => { const next = [...prev]; next[current] = idx; return next; });
    }, [current]);

    const toggleFlag = useCallback(() => {
        setFlagged((prev) => { const next = new Set(prev); next.has(current) ? next.delete(current) : next.add(current); return next; });
    }, [current]);

    const saveResultToFirestore = useCallback(async (finalAnswers: (number | null)[], remainingTime: number) => {
        if (!user) return;
        setSaving(true);
        try {
            const sc = finalAnswers.reduce<number>((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0);
            const pc = Math.round((sc / questions.length) * 100);
            const kaDetail = Object.entries(kaLabels).map(([key, label]) => {
                const qs = questions.filter((q) => q.ka === key);
                const correct = qs.filter((q) => finalAnswers[questions.indexOf(q)] === q.correct).length;
                return { ka: key, label, total: qs.length, correct, pct: qs.length ? Math.round((correct / qs.length) * 100) : 0 };
            }).filter(k => k.total > 0);

            const wrongQuestions = questions
                .map((q, i) => ({ ...q, userAnswer: finalAnswers[i] }))
                .filter((q) => q.userAnswer !== q.correct)
                .map((q) => ({ id: q.id, ka: q.ka, question: q.question, correctAnswer: q.options[q.correct], userAnswer: q.userAnswer !== null ? q.options[q.userAnswer] : 'Skipped' }));

            const resultDoc = {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName,
                certName,
                title,
                score: sc,
                total: questions.length,
                percentage: pc,
                passed: pc >= passingScore,
                timeUsed: totalTimeMinutes * 60 - remainingTime,
                kaBreakdown: kaDetail,
                wrongQuestions,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'examResults'), resultDoc);

            // AI evaluation via Firebase Gemini (client-side, free tier)
            setAiLoading(true);
            try {
                const aiPrompt = buildAiPrompt(certName, pc, kaDetail, wrongQuestions);
                const result = await geminiModel.generateContent(aiPrompt);
                let text = result.response.text();
                if (text) {
                    // Strip markdown code fences if Gemini wraps the HTML
                    text = text.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
                    setAiAnalysis(text);
                }
            } catch { /* AI eval is best-effort */ }
            setAiLoading(false);
        } catch (e) {
            console.error('Failed to save result:', e);
        }
        setSaving(false);
    }, [user, questions, kaLabels, certName, title, passingScore, totalTimeMinutes]);

    const submit = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('result');
        saveResultToFirestore(answers, timeLeft);
    }, [answers, timeLeft, saveResultToFirestore]);

    const restart = useCallback(() => {
        const picked = pickQuestions(questionPool, kaDistribution);
        setQuestions(picked);
        setAnswers(picked.map(() => null));
        setPhase('intro');
        setCurrent(0);
        setFlagged(new Set());
        setTimeLeft(totalTimeMinutes * 60);
        setShowExplanation(false);
        setAiAnalysis(null);
        setAiLoading(false);
    }, [questionPool, kaDistribution, totalTimeMinutes]);

    /* score calc */
    const score = questions.length > 0 ? answers.reduce<number>((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0) : 0;
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const passed = pct >= passingScore;
    const answered = answers.filter((a) => a !== null).length;

    /* per-KA breakdown */
    const kaBreakdown = Object.entries(kaLabels).map(([key, label]) => {
        const qs = questions.filter((q) => q.ka === key);
        const correct = qs.filter((q) => answers[questions.indexOf(q)] === q.correct).length;
        return { key, label, total: qs.length, correct, pct: qs.length ? Math.round((correct / qs.length) * 100) : 0 };
    }).filter((k) => k.total > 0);

    const q = questions.length > 0 ? questions[current] : null;

    /* ── INTRO ── */
    if (phase === 'intro') {
        return (
            <div className="exam-sim">
                <div className="exam-sim__intro">
                    <div className="exam-sim__intro-icon">📝</div>
                    <h2 className="exam-sim__intro-title">{title}</h2>
                    <div className="exam-sim__intro-info">
                        <div className="exam-sim__info-card">
                            <span className="exam-sim__info-label">Questions</span>
                            <span className="exam-sim__info-value">{questionsPerExam}</span>
                        </div>
                        <div className="exam-sim__info-card">
                            <span className="exam-sim__info-label">Time Limit</span>
                            <span className="exam-sim__info-value">{totalTimeMinutes} min</span>
                        </div>
                        <div className="exam-sim__info-card">
                            <span className="exam-sim__info-label">Passing Score</span>
                            <span className="exam-sim__info-value">≥ {passingScore}%</span>
                        </div>
                        <div className="exam-sim__info-card">
                            <span className="exam-sim__info-label">Certification</span>
                            <span className="exam-sim__info-value">{certName}</span>
                        </div>
                    </div>

                    <div className="exam-sim__intro-rules">
                        <h3>📋 Exam Rules</h3>
                        <ul>
                            <li>Select the <strong>BEST answer</strong> for each question</li>
                            <li>Use 🚩 to flag questions for review</li>
                            <li>Click <strong>Submit</strong> when done — auto-submits when time expires</li>
                            <li>Questions are <strong>randomly selected</strong> from a pool of {questionPool.length} — every attempt is different</li>
                        </ul>
                    </div>

                    <button className="exam-sim__btn exam-sim__btn--start" onClick={startExam}>
                        🚀 Start Exam
                    </button>
                </div>
            </div>
        );
    }

    /* ── RESULT ── */
    if (phase === 'result') {
        return (
            <div className="exam-sim">
                <div className="exam-sim__result">
                    <div className={`exam-sim__result-header ${passed ? 'exam-sim__result-header--pass' : 'exam-sim__result-header--fail'}`}>
                        <div className="exam-sim__result-icon">{passed ? '🎉' : '📚'}</div>
                        <h2>{passed ? 'CONGRATULATIONS — YOU PASSED!' : 'NOT YET — KEEP STUDYING!'}</h2>
                        <div className="exam-sim__result-score">
                            <span className="exam-sim__result-score-num">{score}/{questions.length}</span>
                            <span className="exam-sim__result-score-pct">{pct}%</span>
                        </div>
                        <div className="exam-sim__result-time">
                            Time remaining: {fmt(timeLeft)} / {totalTimeMinutes}:00
                        </div>
                    </div>

                    {/* KA breakdown */}
                    <div className="exam-sim__result-breakdown">
                        <h3>📊 Results by Knowledge Area</h3>
                        <div className="exam-sim__ka-list">
                            {kaBreakdown.map((ka) => (
                                <div key={ka.key} className="exam-sim__ka-item">
                                    <div className="exam-sim__ka-header">
                                        <span className="exam-sim__ka-name">{ka.label}</span>
                                        <span className={`exam-sim__ka-score ${ka.pct >= passingScore ? 'exam-sim__ka-score--pass' : 'exam-sim__ka-score--fail'}`}>
                                            {ka.correct}/{ka.total} ({ka.pct}%)
                                        </span>
                                    </div>
                                    <div className="exam-sim__ka-bar">
                                        <div
                                            className={`exam-sim__ka-bar-fill ${ka.pct >= passingScore ? 'exam-sim__ka-bar-fill--pass' : 'exam-sim__ka-bar-fill--fail'}`}
                                            style={{ width: `${ka.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* review toggle */}
                    <button className="exam-sim__btn exam-sim__btn--review" onClick={() => setShowExplanation((v) => !v)}>
                        {showExplanation ? '🔼 Hide Explanations' : '🔽 View Detailed Explanations'}
                    </button>

                    {showExplanation && (
                        <div className="exam-sim__explanations">
                            {questions.map((qq, i) => {
                                const userAns = answers[i];
                                const isCorrect = userAns === qq.correct;
                                return (
                                    <div key={qq.id} className={`exam-sim__exp-card ${isCorrect ? 'exam-sim__exp-card--correct' : 'exam-sim__exp-card--wrong'}`}>
                                        <div className="exam-sim__exp-header">
                                            <span className="exam-sim__exp-num">Q{i + 1}</span>
                                            <span className={`exam-sim__exp-badge ${isCorrect ? 'exam-sim__exp-badge--correct' : 'exam-sim__exp-badge--wrong'}`}>
                                                {isCorrect ? '✅ Correct' : '❌ Wrong'}
                                            </span>
                                            <span className="exam-sim__exp-ka">{kaLabels[qq.ka] || qq.ka}</span>
                                        </div>
                                        <p className="exam-sim__exp-question">{qq.question}</p>
                                        <div className="exam-sim__exp-options">
                                            {qq.options.map((opt, oi) => (
                                                <div
                                                    key={oi}
                                                    className={`exam-sim__exp-opt
                            ${oi === qq.correct ? 'exam-sim__exp-opt--correct' : ''}
                            ${oi === userAns && oi !== qq.correct ? 'exam-sim__exp-opt--wrong' : ''}
                          `}
                                                >
                                                    {String.fromCharCode(65 + oi)}. {opt}
                                                    {oi === qq.correct && ' ✅'}
                                                    {oi === userAns && oi !== qq.correct && ' ❌'}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="exam-sim__exp-text">
                                            <strong>Explanation:</strong> {qq.explanation}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* AI Evaluation */}
                    <div className="exam-sim__ai-section">
                        <h3>🤖 AI Analysis & Study Plan</h3>
                        {saving && <p className="exam-sim__ai-saving">💾 Saving results...</p>}
                        {aiLoading && <p className="exam-sim__ai-loading">🧠 AI is analyzing your results...</p>}
                        {aiAnalysis && (
                            <div className="exam-sim__ai-result" dangerouslySetInnerHTML={{ __html: aiAnalysis }} />
                        )}
                        {!aiLoading && !aiAnalysis && !saving && (
                            <p className="exam-sim__ai-fallback">Results saved. AI evaluation will appear when configured.</p>
                        )}
                    </div>

                    <button className="exam-sim__btn exam-sim__btn--restart" onClick={restart}>
                        🔄 Retake Exam
                    </button>
                </div>
            </div>
        );
    }

    /* ── EXAM ── */
    if (!q) return null;
    return (
        <div className="exam-sim">
            {/* top bar */}
            <div className="exam-sim__topbar">
                <div className="exam-sim__topbar-left">
                    <span className="exam-sim__cert-badge">{certName}</span>
                    <span className="exam-sim__progress">Q {current + 1}/{questions.length}</span>
                </div>
                <div className={`exam-sim__timer ${timeLeft < 300 ? 'exam-sim__timer--danger' : timeLeft < 600 ? 'exam-sim__timer--warn' : ''}`}>
                    ⏱ {fmt(timeLeft)}
                </div>
                <div className="exam-sim__topbar-right">
                    <span className="exam-sim__answered">{answered}/{questions.length} answered</span>
                    <button className="exam-sim__nav-toggle" onClick={() => setShowNav((v) => !v)} title="Question list">
                        📋
                    </button>
                </div>
            </div>

            <div className="exam-sim__body">
                {/* question nav sidebar */}
                {showNav && (
                    <div className="exam-sim__sidebar">
                        <div className="exam-sim__sidebar-header">
                            <h3>Question Navigator</h3>
                            <button className="exam-sim__sidebar-close" onClick={() => setShowNav(false)}>✕</button>
                        </div>
                        <div className="exam-sim__sidebar-legend">
                            <span><span className="exam-sim__dot exam-sim__dot--answered" /> Answered</span>
                            <span><span className="exam-sim__dot exam-sim__dot--flagged" /> Flagged</span>
                            <span><span className="exam-sim__dot exam-sim__dot--current" /> Current</span>
                        </div>
                        <div className="exam-sim__qgrid">
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    className={`exam-sim__qbtn
                    ${i === current ? 'exam-sim__qbtn--current' : ''}
                    ${answers[i] !== null ? 'exam-sim__qbtn--answered' : ''}
                    ${flagged.has(i) ? 'exam-sim__qbtn--flagged' : ''}
                  `}
                                    onClick={() => { setCurrent(i); setShowNav(false); }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* main question area */}
                <div className="exam-sim__main">
                    <div className="exam-sim__question-card">
                        <div className="exam-sim__question-header">
                            <span className="exam-sim__question-num">Question {current + 1}</span>
                            <span className="exam-sim__question-ka">{kaLabels[q.ka] || q.ka}</span>
                            <button
                                className={`exam-sim__flag-btn ${flagged.has(current) ? 'exam-sim__flag-btn--active' : ''}`}
                                onClick={toggleFlag}
                                title={flagged.has(current) ? 'Unflag' : 'Flag for review'}
                            >
                                {flagged.has(current) ? '🚩' : '⚐'}
                            </button>
                        </div>
                        <p className="exam-sim__question-text">{q.question}</p>
                        <div className="exam-sim__options">
                            {q.options.map((opt, oi) => (
                                <label
                                    key={oi}
                                    className={`exam-sim__option ${answers[current] === oi ? 'exam-sim__option--selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`q-${current}`}
                                        checked={answers[current] === oi}
                                        onChange={() => pick(oi)}
                                        className="exam-sim__radio"
                                    />
                                    <span className="exam-sim__option-letter">{String.fromCharCode(65 + oi)}</span>
                                    <span className="exam-sim__option-text">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* navigation */}
                    <div className="exam-sim__nav-bar">
                        <button
                            className="exam-sim__btn exam-sim__btn--nav"
                            disabled={current === 0}
                            onClick={() => setCurrent((c) => c - 1)}
                        >
                            ← Previous
                        </button>
                        <button
                            className="exam-sim__btn exam-sim__btn--nav"
                            disabled={current === questions.length - 1}
                            onClick={() => setCurrent((c) => c + 1)}
                        >
                            Next →
                        </button>
                        <button className="exam-sim__btn exam-sim__btn--submit" onClick={submit}>
                            📤 Submit ({answered}/{questions.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
