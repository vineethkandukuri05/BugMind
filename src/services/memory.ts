import type { MemoryEntry, MemoryRecall, DebugSession, InsightData } from '../types';

const API_BASE = '/api';
const STORAGE_KEY = 'bugmind_memory';
const SESSION_KEY = 'bugmind_sessions';

// ── Hindsight-backed memory service ─────────────────────────────────────────
// Calls the backend API which proxies to Hindsight for retain/recall/reflect.
// Falls back to localStorage if the backend is unreachable.

async function checkBackend(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return data.hindsight === 'connected';
  } catch {
    return false;
  }
}

// ── Retain ──────────────────────────────────────────────────────────────────
async function retainToHindsight(entry: Omit<MemoryEntry, 'id'>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/memory/retain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        errorType: entry.errorType,
        errorMessage: entry.errorMessage,
        code: entry.codeContext,
        cause: entry.cause,
        aiExplanation: entry.aiExplanation,
        suggestedFix: entry.suggestedSolution,
        userFix: entry.userFix,
        outcome: entry.outcome,
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// ── Recall ──────────────────────────────────────────────────────────────────
async function recallFromHindsight(errorType: string, errorMessage?: string): Promise<MemoryRecall> {
  try {
    const res = await fetch(`${API_BASE}/memory/recall`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ errorType, errorMessage }),
    });
    const data = await res.json();

    if (data.found && data.memory) {
      return {
        found: true,
        memory: {
          id: 'hindsight-' + Date.now(),
          language: 'Java',
          errorType: data.memory.errorType || errorType,
          errorMessage: data.memory.cause || '',
          codeContext: '',
          cause: data.memory.cause || '',
          aiExplanation: data.memory.aiExplanation || '',
          suggestedSolution: data.memory.suggestedFix || '',
          userFix: data.memory.userFix || data.memory.suggestedFix || '',
          outcome: (data.memory.outcome || '').toLowerCase().includes('fix') ? 'fixed' : 'unresolved',
          timestamp: new Date().toISOString(),
          occurrenceCount: data.totalMatches || 1,
        },
        similarity: data.relevance || 0.9,
      };
    }
    return { found: false };
  } catch {
    return { found: false };
  }
}

// ── Reflect ─────────────────────────────────────────────────────────────────
async function reflectFromHindsight(question: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/memory/reflect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    return data.success ? data.answer : null;
  } catch {
    return null;
  }
}

// ── Local storage helpers (fallback + session tracking) ─────────────────────

function seedData() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(SESSION_KEY)) return;

  const sampleSessions: DebugSession[] = [
    {
      id: '1',
      errorType: 'ArrayIndexOutOfBoundsException',
      language: 'Java',
      date: 'Sep 29, 2026',
      occurrences: 3,
      status: 'Resolved',
      code: 'int[] arr = {1, 2, 3};\nSystem.out.println(arr[5]);',
      cause: 'Accessed index 5 in an array of size 3',
      solution: 'Check array bounds before accessing index',
      timeline: [
        { date: 'Sep 27, 2026', event: 'Error Encountered', detail: 'Accessed index 5 on length 3 array' },
        { date: 'Sep 28, 2026', event: 'Error Encountered', detail: 'Similar error on different array' },
        { date: 'Sep 29, 2026', event: 'Resolved', detail: 'Fixed by checking bounds' },
      ],
    },
    {
      id: '2',
      errorType: 'NullPointerException',
      language: 'Java',
      date: 'Sep 29, 2026',
      occurrences: 2,
      status: 'Resolved',
      code: 'String str = null;\nSystem.out.println(str.length());',
      cause: 'Calling method on null reference',
      solution: 'Initialize variable or check for null',
      timeline: [
        { date: 'Sep 28, 2026', event: 'Error Encountered', detail: 'Null reference exception' },
        { date: 'Sep 29, 2026', event: 'Resolved', detail: 'Added null check' },
      ],
    },
    {
      id: '3',
      errorType: 'Incompatible Types',
      language: 'Java',
      date: 'Sep 27, 2026',
      occurrences: 4,
      status: 'Resolved',
      code: 'String x = 5;',
      cause: 'Assigned int to String variable',
      solution: 'Use String.valueOf() or change variable type',
      timeline: [{ date: 'Sep 27, 2026', event: 'Resolved', detail: 'Fixed type mismatch' }],
    },
  ];
  localStorage.setItem(SESSION_KEY, JSON.stringify(sampleSessions));
}

function localRetain(entry: Omit<MemoryEntry, 'id'>): MemoryEntry {
  const memories: MemoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newEntry: MemoryEntry = { ...entry, id: crypto.randomUUID() };
  memories.push(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));

  // Update sessions
  const sessions = getHistory();
  const existing = sessions.find((s) => s.errorType === entry.errorType);
  if (existing) {
    existing.occurrences += 1;
    existing.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    existing.timeline.push({ date: existing.date, event: 'Error Reoccurred', detail: 'Similar mistake made again' });
  } else {
    sessions.push({
      id: newEntry.id,
      errorType: entry.errorType,
      language: entry.language,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      occurrences: 1,
      status: entry.outcome === 'fixed' ? 'Resolved' : 'Unresolved',
      code: entry.codeContext,
      cause: entry.cause,
      solution: entry.userFix || entry.suggestedSolution,
      timeline: [
        {
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          event: 'Error Encountered',
          detail: entry.errorMessage,
        },
      ],
    });
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  return newEntry;
}

function localRecall(errorType: string): MemoryRecall {
  const memories: MemoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const sessions = getHistory();

  const matched =
    memories.find(
      (m) =>
        m.errorType.toLowerCase().includes(errorType.toLowerCase()) ||
        errorType.toLowerCase().includes(m.errorType.toLowerCase())
    ) ||
    (() => {
      const s = sessions.find(
        (s) =>
          s.errorType.toLowerCase().includes(errorType.toLowerCase()) ||
          errorType.toLowerCase().includes(s.errorType.toLowerCase())
      );
      if (!s) return undefined;
      return {
        id: s.id,
        language: s.language,
        errorType: s.errorType,
        errorMessage: s.cause,
        codeContext: s.code,
        cause: s.cause,
        aiExplanation: s.solution,
        suggestedSolution: s.solution,
        userFix: s.solution,
        outcome: s.status === 'Resolved' ? 'fixed' : 'unresolved',
        timestamp: s.date,
        occurrenceCount: s.occurrences,
      } as MemoryEntry;
    })();

  if (matched) return { found: true, memory: matched, similarity: 0.9 };
  return { found: false };
}

// ── Public API ──────────────────────────────────────────────────────────────

export const memoryService = {
  /** Store a debugging memory — sends to Hindsight, falls back to localStorage */
  retain: async (entry: Omit<MemoryEntry, 'id'>): Promise<MemoryEntry> => {
    const localEntry = localRetain(entry); // Always store locally for session tracking
    await retainToHindsight(entry); // Also send to Hindsight (fire-and-forget)
    return localEntry;
  },

  /** Search for similar past errors — uses Hindsight only */
  recall: async (errorType: string, errorMessage?: string): Promise<MemoryRecall> => {
    return await recallFromHindsight(errorType, errorMessage);
  },

  /** Ask BugMind a question — uses Hindsight reflect, falls back to local canned responses */
  reflect: async (question: string): Promise<string> => {
    const answer = await reflectFromHindsight(question);
    if (answer) return answer;
    // Fallback
    return fallbackReflect(question);
  },

  /** Check if Hindsight is connected */
  checkConnection: checkBackend,

  getHistory,
  getInsights,
  clearAll,
  getMemoryCount,
  getSessionById,
};

// ── Helper functions ────────────────────────────────────────────────────────

function getHistory(): DebugSession[] {
  seedData();
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(SESSION_KEY) || '[]');
}

function getInsights(): InsightData {
  const sessions = getHistory();
  let totalErrors = 0;
  let errorsResolved = 0;

  const recurringMistakes = sessions
    .map((s) => {
      totalErrors += s.occurrences;
      if (s.status === 'Resolved') errorsResolved += 1;
      return { name: s.errorType, count: s.occurrences };
    })
    .filter((s) => s.count > 1)
    .sort((a, b) => b.count - a.count);

  return {
    totalErrors,
    errorsResolved,
    repeatedMistakes: totalErrors - sessions.length,
    successfulFixes: errorsResolved,
    recurringMistakes,
  };
}

function clearAll(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SESSION_KEY);
}

function getMemoryCount(): number {
  if (typeof window === 'undefined') return 0;
  const memories = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || '[]');
  return memories.length + sessions.length;
}

function getSessionById(id: string): DebugSession | undefined {
  return getHistory().find((s) => s.id === id);
}

function fallbackReflect(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('most common') || q.includes('repeat most'))
    return 'Based on your history, Array Boundary Errors (ArrayIndexOutOfBoundsException) are your most common mistakes, occurring 3 times recently.';
  if (q.includes('how many times'))
    return 'You have encountered this specific error pattern 3 times across your projects.';
  if (q.includes('nullpointer'))
    return 'Previously, you fixed NullPointerException by adding a null check: `if (obj != null)` before accessing its methods.';
  if (q.includes('focus on improving'))
    return 'I recommend focusing on Array Bounds checking and Null safety, as these account for the majority of your recurring errors.';
  return 'I can answer questions about your debugging history, most common errors, and previous successful fixes. What would you like to know?';
}
