import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const ERROR_DETAILS: Record<string, any> = {
  '1': {
    title: 'ArrayIndexOutOfBoundsException',
    firstEncountered: 'September 27, 2026',
    occurrences: 3,
    code: 'int[] arr = new int[5];\nSystem.out.println(arr[5]);',
    cause: 'Attempting to access an array element at an index that is equal to or greater than the size of the array. Arrays are zero-indexed, so the valid indices for an array of size 5 are 0 to 4.',
    solution: 'Ensure the index is within the valid range (0 to arr.length - 1) before accessing the array element.',
    outcome: 'Successful',
    timeline: [
      { date: 'Sep 27', type: 'first', title: 'First occurrence', events: ['AI explanation provided', 'User fixed error', 'Memory stored'] },
      { date: 'Sep 28', type: 'recall', title: 'Similar error detected', events: ['Memory recalled', 'Warning shown to user'] },
      { date: 'Today', type: 'recall', title: 'Similar error detected', events: ['Memory recalled', 'Previous solution suggested'] },
    ]
  },
  '2': {
    title: 'NullPointerException',
    firstEncountered: 'September 26, 2026',
    occurrences: 2,
    code: 'String str = null;\nint length = str.length();',
    cause: 'Attempting to call an instance method on a null object reference.',
    solution: 'Check if the object reference is null before calling any methods on it.',
    outcome: 'Successful',
    timeline: [
      { date: 'Sep 26', type: 'first', title: 'First occurrence', events: ['AI explanation provided', 'User fixed error', 'Memory stored'] },
      { date: 'Yesterday', type: 'recall', title: 'Similar error detected', events: ['Memory recalled', 'Warning shown to user'] },
    ]
  },
  '3': {
    title: 'Incompatible Types',
    firstEncountered: 'September 25, 2026',
    occurrences: 4,
    code: 'int number = "123";',
    cause: 'Assigning a value of one type to a variable of a different, incompatible type.',
    solution: 'Convert or cast the value to the appropriate type, e.g., Integer.parseInt("123").',
    outcome: 'Successful',
    timeline: [
      { date: 'Sep 25', type: 'first', title: 'First occurrence', events: ['AI explanation provided', 'User fixed error', 'Memory stored'] },
      { date: 'Sep 26', type: 'recall', title: 'Similar error detected', events: ['Memory recalled', 'Warning shown to user'] },
      { date: 'Sep 27', type: 'recall', title: 'Similar error detected', events: ['Memory recalled', 'Previous solution suggested'] },
      { date: 'Today', type: 'recall', title: 'Similar error detected', events: ['Memory recalled', 'Previous solution suggested'] },
    ]
  }
};

export const ErrorDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const details = id && ERROR_DETAILS[id] ? ERROR_DETAILS[id] : ERROR_DETAILS['1'];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to History
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{details.title}</h1>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>First encountered: {details.firstEncountered}</span>
            <span>|</span>
            <span>Occurrences: {details.occurrences}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Previous Code Snippet</h3>
            <pre className="bg-gray-50 rounded-lg p-4 text-sm font-mono text-gray-800 overflow-x-auto border border-gray-200">
              {details.code}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Cause</h3>
            <p className="text-sm text-gray-700">{details.cause}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Previous Solution</h3>
            <p className="text-sm text-gray-700 mb-3">{details.solution}</p>
            <div className="flex items-center text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 inline-flex">
              <CheckCircle className="w-4 h-4 mr-2" />
              Outcome: {details.outcome}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Memory Timeline</h2>
        <div className="pl-4">
          {details.timeline.map((item: any, index: number) => (
            <div key={index} className="relative pb-8 last:pb-0">
              {index !== details.timeline.length - 1 && (
                <div className="absolute top-4 left-[5px] bottom-[-16px] w-[2px] bg-gray-200"></div>
              )}
              <div className="relative flex items-start">
                <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 z-10 ${
                  item.type === 'first' ? 'bg-blue-600' : 'bg-amber-500'
                }`}></div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900 text-sm">{item.date} - {item.title}</div>
                  <div className="mt-1 space-y-1">
                    {item.events.map((event: string, eventIndex: number) => (
                      <div key={eventIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2 text-gray-400">→</span>
                        {event}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
