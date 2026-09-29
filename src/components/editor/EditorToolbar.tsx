import React from 'react';
import { Play, RefreshCw, Save, Loader2 } from 'lucide-react';

interface EditorToolbarProps {
  onRun: () => void;
  onReset: () => void;
  onSave: () => void;
  isCompiling: boolean;
}

export function EditorToolbar({
  onRun,
  onReset,
  onSave,
  isCompiling
}: EditorToolbarProps) {
  return (
    <div className="flex flex-row justify-between items-center mb-4">
      <h2 className="font-bold text-gray-900 text-lg">Java Editor</h2>
      <div className="flex gap-2">
        <button
          onClick={onReset}
          disabled={isCompiling}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        <button
          onClick={onSave}
          disabled={isCompiling}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button
          onClick={onRun}
          disabled={isCompiling}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isCompiling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>Run Code</span>
        </button>
      </div>
    </div>
  );
}
