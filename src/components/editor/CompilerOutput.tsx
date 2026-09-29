import React from 'react';
import { Terminal, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { CompilerResult } from '../../types';

interface CompilerOutputProps {
  result: CompilerResult | null;
  isCompiling: boolean;
  showSuccess: boolean;
}

export function CompilerOutput({ result, isCompiling, showSuccess }: CompilerOutputProps) {
  if (isCompiling) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4 flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-gray-700 font-medium">Compiling Java code...</span>
      </div>
    );
  }

  if (result?.hasError) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4 border-l-4 border-l-red-500">
        <div className="flex items-center gap-2 mb-2 text-red-600 font-bold">
          <XCircle className="w-5 h-5" />
          <h3>❌ {result.errorType === 'runtime' ? 'Runtime Error' : 'Compilation Error'}</h3>
        </div>
        <div className="font-mono text-sm bg-red-50 text-red-900 p-3 rounded-lg border border-red-100 overflow-x-auto">
          {result.errorName && (
            <div className="font-bold mb-1">{result.errorName}</div>
          )}
          <div className="whitespace-pre-wrap">{result.errorMessage}</div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4 border-l-4 border-l-green-500">
        <div className="flex items-center gap-2 mb-2 text-green-700 font-bold">
          <CheckCircle2 className="w-5 h-5" />
          <h3>✓ Compilation Successful</h3>
        </div>
        <div className="font-mono text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
          Program executed successfully
          {result?.output && (
            <div className="mt-2 whitespace-pre-wrap">{result.output}</div>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4 flex items-center gap-2 text-gray-500">
      <Terminal className="w-5 h-5" />
      <span>Ready to compile</span>
    </div>
  );
}
