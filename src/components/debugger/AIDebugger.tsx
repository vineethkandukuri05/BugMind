import React from 'react';
import { Brain } from 'lucide-react';
import type { AIAnalysis, CompilerResult } from '../../types';

interface AIDebuggerProps {
  analysis: AIAnalysis | null;
  isAnalyzing: boolean;
  compilerResult: CompilerResult | null;
}

export const AIDebugger: React.FC<AIDebuggerProps> = ({
  analysis,
  isAnalyzing,
  compilerResult,
}) => {
  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-center h-48">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <span className="text-gray-600 font-medium animate-pulse">Analyzing error...</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-gray-900 font-semibold text-lg">AI Debugger</h2>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">What happened?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{analysis.whatHappened}</p>
        </div>

        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Why did it happen?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{analysis.whyHappened}</p>
        </div>

        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Suggested fix</h3>
          <pre className="bg-gray-50 rounded-lg p-3 font-mono text-sm border border-gray-200 overflow-x-auto text-gray-800">
            {analysis.suggestedFix}
          </pre>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          Error Type: {analysis.errorType}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          Language: Java
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            analysis.severity === 'High'
              ? 'bg-red-100 text-red-700'
              : analysis.severity === 'Medium'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          Severity: {analysis.severity}
        </span>
      </div>
    </div>
  );
};
