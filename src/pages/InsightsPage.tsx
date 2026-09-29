import { InsightCards } from '../components/insights/InsightCards';
import { MistakeChart } from '../components/insights/MistakeChart';
import { AIInsight } from '../components/insights/AIInsight';
import { AskBugMind } from '../components/insights/AskBugMind';
import { BarChart3 } from 'lucide-react';

export function InsightsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Insights</h1>
          <p className="text-sm text-gray-500">
            Your coding patterns and debugging overview
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <InsightCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <MistakeChart />
        <AIInsight />
      </div>

      {/* Ask BugMind */}
      <div className="mt-6">
        <AskBugMind />
      </div>
    </div>
  );
}
