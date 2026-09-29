import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { AppView, CompilerResult, AIAnalysis, MemoryRecall } from '../types';

export interface AppState {
  currentView: AppView; // 'landing' | 'editor' | 'history' | 'history-detail' | 'insights' | 'settings'
  code: string; // current editor code
  compilerResult: CompilerResult | null;
  aiAnalysis: AIAnalysis | null;
  memoryRecall: MemoryRecall | null;
  isCompiling: boolean;
  isAnalyzing: boolean;
  compilationDone: boolean;
  memoryJustStored: boolean; // for the checkmark animation
  selectedSessionId: string | null;
  demoMode: boolean;
  demoStep: number;
  showSuccess: boolean; // show success panel after fix
}

type AppAction =
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_CODE'; payload: string }
  | { type: 'SET_COMPILER_RESULT'; payload: CompilerResult | null }
  | { type: 'SET_AI_ANALYSIS'; payload: AIAnalysis | null }
  | { type: 'SET_MEMORY_RECALL'; payload: MemoryRecall | null }
  | { type: 'SET_COMPILING'; payload: boolean }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_COMPILATION_DONE'; payload: boolean }
  | { type: 'SET_MEMORY_STORED'; payload: boolean }
  | { type: 'SET_SELECTED_SESSION'; payload: string | null }
  | { type: 'SET_DEMO_MODE'; payload: boolean }
  | { type: 'SET_DEMO_STEP'; payload: number }
  | { type: 'SET_SHOW_SUCCESS'; payload: boolean }
  | { type: 'RESET_COMPILER' };

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};

        System.out.println(numbers[5]);
    }
}`;

const initialState: AppState = {
  currentView: 'landing',
  code: DEFAULT_CODE,
  compilerResult: null,
  aiAnalysis: null,
  memoryRecall: null,
  isCompiling: false,
  isAnalyzing: false,
  compilationDone: false,
  memoryJustStored: false,
  selectedSessionId: null,
  demoMode: false,
  demoStep: 0,
  showSuccess: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_CODE':
      return { ...state, code: action.payload };
    case 'SET_COMPILER_RESULT':
      return { ...state, compilerResult: action.payload };
    case 'SET_AI_ANALYSIS':
      return { ...state, aiAnalysis: action.payload };
    case 'SET_MEMORY_RECALL':
      return { ...state, memoryRecall: action.payload };
    case 'SET_COMPILING':
      return { ...state, isCompiling: action.payload };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_COMPILATION_DONE':
      return { ...state, compilationDone: action.payload };
    case 'SET_MEMORY_STORED':
      return { ...state, memoryJustStored: action.payload };
    case 'SET_SELECTED_SESSION':
      return { ...state, selectedSessionId: action.payload };
    case 'SET_DEMO_MODE':
      return { ...state, demoMode: action.payload };
    case 'SET_DEMO_STEP':
      return { ...state, demoStep: action.payload };
    case 'SET_SHOW_SUCCESS':
      return { ...state, showSuccess: action.payload };
    case 'RESET_COMPILER':
      return {
        ...state,
        compilerResult: null,
        aiAnalysis: null,
        memoryRecall: null,
        compilationDone: false,
        memoryJustStored: false,
        showSuccess: false
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
