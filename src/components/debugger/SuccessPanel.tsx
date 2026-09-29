import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessPanelProps {
  visible: boolean;
  errorType: string;
  cause: string;
  fix: string;
}

export const SuccessPanel: React.FC<SuccessPanelProps> = ({
  visible,
  errorType,
  cause,
  fix,
}) => {
  if (!visible) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-green-500 p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
        <h2 className="text-green-600 font-bold text-lg">✓ Compilation Successful</h2>
      </div>
      <p className="text-gray-500 text-sm mb-4 ml-8">BugMind learned from this debugging session.</p>

      <div className="bg-gray-50/50 border border-green-100 rounded-lg p-4 ml-8 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-green-200"></div>
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase block mb-0.5">Error</span>
          <p className="text-sm text-gray-800 font-medium">{errorType}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase block mb-0.5">Cause</span>
          <p className="text-sm text-gray-700">{cause}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase block mb-0.5">Successful fix</span>
          <pre className="mt-1 bg-white border border-gray-200 rounded p-2 text-sm font-mono text-gray-800 overflow-x-auto">
            {fix}
          </pre>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <span className="text-sm font-medium text-green-600">Outcome: ✓ Fixed</span>
        </div>
      </div>
    </div>
  );
};
