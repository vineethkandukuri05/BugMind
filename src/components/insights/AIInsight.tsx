import React from 'react';
import { Sparkles } from 'lucide-react';

export const AIInsight: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-bold text-gray-900">AI Insight</h2>
      </div>
      
      <div className="space-y-4">
        <blockquote className="bg-blue-50/50 rounded-lg p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-700 italic">
            "You've encountered array-boundary errors more frequently than other error types."
          </p>
        </blockquote>
        
        <blockquote className="bg-blue-50/50 rounded-lg p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-700 italic">
            "Your previous successful fixes often involved checking array length before accessing an index."
          </p>
        </blockquote>
      </div>
    </div>
  );
};
