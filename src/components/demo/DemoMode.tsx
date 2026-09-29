import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X, ChevronRight, ChevronLeft, Brain } from 'lucide-react';
import { demoSteps } from '../../data/demoScenario';

interface DemoModeProps {
  onSetCode: (code: string) => void;
  onRunCode: () => void;
  onClose: () => void;
  currentStep: number;
  onSetStep: (step: number) => void;
}

export function DemoMode({
  onSetCode,
  onRunCode,
  onClose,
  currentStep,
  onSetStep,
}: DemoModeProps) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const step = demoSteps[currentStep];

  useEffect(() => {
    if (currentStep === 0 && step?.code) {
      onSetCode(step.code);
    }
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const nextStep = currentStep + 1;
      if (nextStep >= demoSteps.length) {
        onClose();
        return;
      }

      onSetStep(nextStep);
      const next = demoSteps[nextStep];

      if (next.code) {
        onSetCode(next.code);
      }

      if (next.action === 'run') {
        setTimeout(() => onRunCode(), 500);
      }

      if (next.action === 'navigate-insights') {
        navigate('/insights');
      }

      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onSetStep(currentStep - 1);
      const prev = demoSteps[currentStep - 1];
      if (prev.code) {
        onSetCode(prev.code);
      }
    }
  };

  if (!step) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
      <div
        className={`bg-white rounded-xl border border-gray-200 shadow-lg p-5 transition-opacity duration-300 ${
          isTransitioning ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600">Demo Mode</p>
              <p className="text-xs text-gray-500">
                Step {currentStep + 1} of {demoSteps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-4">
          {demoSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          {step.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{step.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {step.action === 'run' && (
              <button
                onClick={() => {
                  if (step.code) onSetCode(step.code);
                  setTimeout(() => onRunCode(), 300);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Run Code
              </button>
            )}
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              {currentStep === demoSteps.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
