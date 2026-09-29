import React from 'react';
import { Database, BookmarkPlus, AlertTriangle, CheckCircle } from 'lucide-react';
import type { MemoryRecall, CompilerResult } from '../../types';

interface HindsightMemoryProps {
  memoryRecall: MemoryRecall | null;
  memoryJustStored: boolean;
  onRemember: () => void;
  isSearching: boolean;
  compilerResult: CompilerResult | null;
}

export const HindsightMemory: React.FC<HindsightMemoryProps> = ({
  memoryRecall,
  memoryJustStored,
  onRemember,
  isSearching,
  compilerResult,
}) => {
  if (isSearching) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
        <Database className="w-5 h-5 text-gray-400 animate-pulse" />
        <span className="text-sm text-gray-500 animate-pulse">Analyzing your debugging history...</span>
      </div>
    );
  }

  if (!memoryRecall) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-gray-700" />
        <h2 className="text-gray-900 font-semibold text-lg">Hindsight Memory</h2>
      </div>

      {memoryRecall.found && memoryRecall.memory ? (
        <div className="space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-600 p-3 rounded-r flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-amber-800 font-semibold text-sm">⚠ Similar Mistake Detected</h3>
              <p className="text-amber-700 text-sm mt-1">You've encountered a similar error before.</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Previous occurrence</span>
              <p className="text-sm text-gray-800 font-medium">{memoryRecall.memory.errorType}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Previous cause</span>
              <p className="text-sm text-gray-700">{memoryRecall.memory.cause}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Previous successful fix</span>
              <pre className="mt-1 bg-white border border-gray-200 rounded p-2 text-sm font-mono text-gray-800">
                {memoryRecall.memory.userFix}
              </pre>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                Seen {memoryRecall.memory?.occurrenceCount || 1} times previously
              </span>
            </div>
          </div>

          <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View Previous Debugging Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              NEW ERROR
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">No similar debugging experience found.</p>
            <p className="text-sm text-gray-500 mt-1">This error will be remembered for future sessions.</p>
          </div>
          
          {memoryJustStored ? (
            <div className="flex items-center gap-2 text-green-600 animate-in fade-in duration-300">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">✓ Memory stored</span>
            </div>
          ) : (
            <button
              onClick={onRemember}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <BookmarkPlus className="w-4 h-4" />
              Remember This Error
            </button>
          )}
        </div>
      )}
    </div>
  );
};
