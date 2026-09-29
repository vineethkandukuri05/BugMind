export interface MemoryEntry {
  id: string;
  language: string;
  errorType: string;
  errorMessage: string;
  codeContext: string;
  cause: string;
  aiExplanation: string;
  suggestedSolution: string;
  userFix: string;
  outcome: 'fixed' | 'unresolved';
  timestamp: string;
  occurrenceCount: number;
}

export interface CompilerResult {
  success: boolean;
  output: string;
  errorType?: string;
  errorMessage?: string;
  line?: number;
}

export interface AIAnalysis {
  whatHappened: string;
  whyHappened: string;
  suggestedFix: string;
  errorType: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface MemoryRecall {
  found: boolean;
  memory?: MemoryEntry;
  similarity?: number;
}

export interface DebugSession {
  id: string;
  errorType: string;
  language: string;
  date: string;
  occurrences: number;
  status: 'Resolved' | 'Unresolved';
  code: string;
  cause: string;
  solution: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  date: string;
  event: string;
  detail: string;
}

export interface InsightData {
  totalErrors: number;
  errorsResolved: number;
  repeatedMistakes: number;
  successfulFixes: number;
  recurringMistakes: { name: string; count: number }[];
}

export type AppView = 'landing' | 'editor' | 'history' | 'history-detail' | 'insights' | 'settings';

export interface DemoStep {
  step: number;
  title: string;
  description: string;
  code?: string;
  action?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
