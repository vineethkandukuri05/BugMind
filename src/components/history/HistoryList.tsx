import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', error: 'ArrayIndexOutOfBoundsException', language: 'Java', date: 'Today', occurrences: 3, status: 'Resolved' },
  { id: '2', error: 'NullPointerException', language: 'Java', date: 'Yesterday', occurrences: 2, status: 'Resolved' },
  { id: '3', error: 'Incompatible Types', language: 'Java', date: 'Sep 27', occurrences: 4, status: 'Resolved' },
  { id: '4', error: 'StringIndexOutOfBoundsException', language: 'Java', date: 'Sep 26', occurrences: 1, status: 'Resolved' },
  { id: '5', error: 'StackOverflowError', language: 'Java', date: 'Sep 25', occurrences: 2, status: 'Resolved' },
];

export const HistoryList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = MOCK_DATA.filter(item => 
    item.error.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">Debugging History</h2>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search history..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="p-4">Error</th>
              <th className="p-4">Language</th>
              <th className="p-4">Date</th>
              <th className="p-4">Occurrences</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row) => (
              <tr 
                key={row.id} 
                onClick={() => navigate(`/history/${row.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="p-4 text-sm font-medium text-gray-900">{row.error}</td>
                <td className="p-4 text-sm text-gray-600">{row.language}</td>
                <td className="p-4 text-sm text-gray-600">{row.date}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {row.occurrences}
                  </span>
                </td>
                <td className="p-4">
                  {row.status === 'Resolved' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      Resolved
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No history found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};
