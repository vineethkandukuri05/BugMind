import React from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Zap } from 'lucide-react';

export const InsightCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center">
        <div className="p-3 rounded-full bg-red-50 mr-4 flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">27</div>
          <div className="text-sm text-gray-500 mt-1">Total Errors</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center">
        <div className="p-3 rounded-full bg-green-50 mr-4 flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">25</div>
          <div className="text-sm text-gray-500 mt-1">Errors Resolved</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center">
        <div className="p-3 rounded-full bg-amber-50 mr-4 flex-shrink-0">
          <RefreshCw className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-500 mt-1">Repeated Mistakes</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center">
        <div className="p-3 rounded-full bg-blue-50 mr-4 flex-shrink-0">
          <Zap className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">25</div>
          <div className="text-sm text-gray-500 mt-1">Successful Fixes</div>
        </div>
      </div>
    </div>
  );
};
