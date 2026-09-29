import { useState, useCallback } from 'react';
import { CodeEditor } from '../components/editor/CodeEditor';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { CompilerOutput } from '../components/editor/CompilerOutput';
import { AIDebugger } from '../components/debugger/AIDebugger';
import { HindsightMemory } from '../components/debugger/HindsightMemory';
import { SuccessPanel } from '../components/debugger/SuccessPanel';
import { DemoMode } from '../components/demo/DemoMode';
import { compileJava } from '../services/compiler';
import { aiService } from '../services/ai';
import { memoryService } from '../services/memory';
import type { CompilerResult, AIAnalysis, MemoryRecall } from '../types';

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};

        System.out.println(numbers[5]);
    }
}`;

export function EditorDashboard() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [compilerResult, setCompilerResult] = useState<CompilerResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [memoryRecall, setMemoryRecall] = useState<MemoryRecall | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSearchingMemory, setIsSearchingMemory] = useState(false);
  const [memoryJustStored, setMemoryJustStored] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastErrorType, setLastErrorType] = useState('');
  const [lastCause, setLastCause] = useState('');
  const [lastFix, setLastFix] = useState('');

  // Demo mode
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const resetState = useCallback(() => {
    setCompilerResult(null);
    setAiAnalysis(null);
    setMemoryRecall(null);
    setIsCompiling(false);
    setIsAnalyzing(false);
    setIsSearchingMemory(false);
    setMemoryJustStored(false);
    setShowSuccess(false);
  }, []);

  const handleRun = useCallback(async () => {
    resetState();
    setIsCompiling(true);

    // Simulate compilation
    const result = await compileJava(code);
    setCompilerResult(result);
    setIsCompiling(false);

    if (result.success) {
      // Success path
      setShowSuccess(true);
      if (lastErrorType) {
        // Store the successful fix in memory
        await memoryService.retain({
          language: 'Java',
          errorType: lastErrorType,
          errorMessage: '',
          codeContext: code,
          cause: lastCause,
          aiExplanation: '',
          suggestedSolution: '',
          userFix: 'Changed index to a valid array position',
          outcome: 'fixed',
          timestamp: new Date().toISOString(),
          occurrenceCount: 1,
        });
      }
    } else {
      // Error path: AI analysis
      setIsAnalyzing(true);
      const analysis = await aiService.analyzeError(result, code);
      setAiAnalysis(analysis);
      setIsAnalyzing(false);

      setLastErrorType(result.errorType || '');
      setLastCause(analysis.whyHappened);
      setLastFix(analysis.suggestedFix);

      // Search memory
      setIsSearchingMemory(true);
      await new Promise((r) => setTimeout(r, 600));
      const memResult = await memoryService.recall(result.errorType || '', result.errorMessage);
      setMemoryRecall(memResult);
      setIsSearchingMemory(false);
    }
  }, [code, resetState, lastErrorType, lastCause]);

  const handleRemember = useCallback(async () => {
    if (compilerResult?.errorType && aiAnalysis) {
      await memoryService.retain({
        language: 'Java',
        errorType: compilerResult.errorType,
        errorMessage: compilerResult.errorMessage || '',
        codeContext: code,
        cause: aiAnalysis.whyHappened,
        aiExplanation: aiAnalysis.whatHappened,
        suggestedSolution: aiAnalysis.suggestedFix,
        userFix: '',
        outcome: 'unresolved',
        timestamp: new Date().toISOString(),
        occurrenceCount: 1,
      });
      setMemoryJustStored(true);
    }
  }, [compilerResult, aiAnalysis, code]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE);
    resetState();
  }, [resetState]);

  const handleSave = useCallback(() => {
    // Visual feedback for save
    const el = document.createElement('div');
    el.textContent = '✓ Saved';
    el.className =
      'fixed top-20 right-6 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg z-50 animate-fade-in';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }, []);

  const startDemo = useCallback(() => {
    resetState();
    setDemoActive(true);
    setDemoStep(0);
    setCode(DEFAULT_CODE);
  }, [resetState]);

  const showRightPanel = isAnalyzing || aiAnalysis || showSuccess;

  return (
    <div className="h-full">
      {/* Demo Mode Controls */}
      {!demoActive && (
        <div className="flex justify-end mb-4">
          <button
            onClick={startDemo}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            ▶ Start Demo
          </button>
        </div>
      )}

      <div
        className={`grid gap-6 ${
          showRightPanel
            ? 'grid-cols-1 lg:grid-cols-5'
            : 'grid-cols-1'
        }`}
      >
        {/* Left: Editor + Compiler Output */}
        <div className={showRightPanel ? 'lg:col-span-3' : ''}>
          <EditorToolbar
            onRun={handleRun}
            onReset={handleReset}
            onSave={handleSave}
            isCompiling={isCompiling}
          />
          <div className="mt-3">
            <CodeEditor code={code} onChange={setCode} />
          </div>
          <CompilerOutput
            result={compilerResult}
            isCompiling={isCompiling}
            showSuccess={showSuccess}
          />
        </div>

        {/* Right: AI Debugger + Hindsight Memory */}
        {showRightPanel && (
          <div className="lg:col-span-2 space-y-4">
            {showSuccess ? (
              <SuccessPanel
                visible={showSuccess}
                errorType={lastErrorType}
                cause={lastCause}
                fix={lastFix}
              />
            ) : (
              <>
                <AIDebugger
                  analysis={aiAnalysis}
                  isAnalyzing={isAnalyzing}
                  compilerResult={compilerResult}
                />
                {(isSearchingMemory || memoryRecall) && (
                  <HindsightMemory
                    memoryRecall={memoryRecall}
                    memoryJustStored={memoryJustStored}
                    onRemember={handleRemember}
                    isSearching={isSearchingMemory}
                    compilerResult={compilerResult}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Demo Mode Overlay */}
      {demoActive && (
        <DemoMode
          onSetCode={setCode}
          onRunCode={handleRun}
          onClose={() => setDemoActive(false)}
          currentStep={demoStep}
          onSetStep={setDemoStep}
        />
      )}
    </div>
  );
}
