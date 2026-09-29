import { Brain, Search, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Debugging Memory
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
              BugMind
            </h1>
          </div>

          <p className="text-xl text-gray-500 font-medium mb-4 italic">
            "Your compiler remembers your mistakes."
          </p>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            An AI-powered coding environment that learns from your debugging
            history and helps you avoid repeating the same mistakes.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/editor')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Start Coding
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              See How It Works
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div id="how-it-works" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="w-6 h-6 text-blue-600" />}
            title="Remember"
            description="BugMind remembers your previous debugging experiences using Hindsight, a persistent memory system that grows with every session."
            color="blue"
          />
          <FeatureCard
            icon={<Search className="w-6 h-6 text-amber-600" />}
            title="Recognize"
            description="It identifies similar mistakes when they happen again, warns you, and surfaces your previous successful solutions."
            color="amber"
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            title="Improve"
            description="It uses your debugging history to provide personalized assistance and help you grow as a programmer."
            color="green"
          />
        </div>

        {/* Architecture Preview */}
        <div className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            How BugMind Works
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm text-gray-600">
            <FlowStep label="Write Code" active />
            <FlowArrow />
            <FlowStep label="Compile" />
            <FlowArrow />
            <FlowStep label="Error Detected" error />
            <FlowArrow />
            <FlowStep label="AI Analyzes" />
            <FlowArrow />
            <FlowStep label="Memory Searched" />
            <FlowArrow />
            <FlowStep label="Fix Applied" success />
            <FlowArrow />
            <FlowStep label="Solution Remembered" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'amber' | 'green';
}) {
  const bgMap = {
    blue: 'bg-blue-50',
    amber: 'bg-amber-50',
    green: 'bg-green-50',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 ${bgMap[color]} rounded-lg flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FlowStep({
  label,
  active,
  error,
  success,
}: {
  label: string;
  active?: boolean;
  error?: boolean;
  success?: boolean;
}) {
  let classes =
    'px-3 py-2 rounded-lg border text-xs font-medium whitespace-nowrap';
  if (active) classes += ' bg-blue-50 border-blue-200 text-blue-700';
  else if (error) classes += ' bg-red-50 border-red-200 text-red-700';
  else if (success) classes += ' bg-green-50 border-green-200 text-green-700';
  else classes += ' bg-gray-50 border-gray-200 text-gray-600';

  return <div className={classes}>{label}</div>;
}

function FlowArrow() {
  return (
    <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 hidden md:block" />
  );
}
