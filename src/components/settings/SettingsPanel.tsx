import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Code,
  Brain,
  Database,
  Trash2,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';

export function SettingsPanel() {
  const [showClearModal, setShowClearModal] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    localStorage.removeItem('bugmind_memory');
    setCleared(true);
    setShowClearModal(false);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Configure BugMind preferences</p>
        </div>
      </div>

      {cleared && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          Debugging history cleared successfully.
        </div>
      )}

      {/* Language Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Language</h2>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900">Java</p>
            <p className="text-xs text-gray-500">Primary language</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            Active
          </span>
        </div>
        <div className="pt-3">
          <p className="text-sm text-gray-500 italic">
            More languages coming soon
          </p>
        </div>
      </div>

      {/* AI Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">AI</h2>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">AI Debugger</p>
            <p className="text-xs text-gray-500">
              Automatic error analysis and explanation
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            Enabled
          </span>
        </div>
      </div>

      {/* Memory Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Memory</h2>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Hindsight Memory
            </p>
            <p className="text-xs text-gray-500">
              Long-term debugging experience storage
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Connected
          </span>
        </div>
        <div className="flex items-center gap-3 pt-4">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Database className="w-4 h-4" />
            View Memory Status
          </button>
          <button
            onClick={() => setShowClearModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Debugging History
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Clear Debugging History
                </h3>
              </div>
              <button
                onClick={() => setShowClearModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently delete all stored debugging memories,
              session history, and insights. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
