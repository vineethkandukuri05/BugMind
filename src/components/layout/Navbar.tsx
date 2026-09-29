import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Code, History, Lightbulb, Play } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [hindsightStatus, setHindsightStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHindsightStatus(data.hindsight === 'connected' ? 'connected' : 'disconnected'))
      .catch(() => setHindsightStatus('disconnected'));
  }, []);

  const handleDemoMode = () => {
    dispatch({ type: 'SET_DEMO_MODE', payload: !state.demoMode });
  };

  const navItems = [
    { name: 'Editor', path: '/editor', icon: Code },
    { name: 'History', path: '/history', icon: History },
    { name: 'Insights', path: '/insights', icon: Lightbulb },
  ];

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">BugMind</span>
            <span className="text-xs text-gray-500 leading-tight">AI Debugging Assistant</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-1 ml-6 border-l border-gray-200 pl-6">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleDemoMode}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
            state.demoMode 
              ? 'border-blue-600 text-blue-600 bg-blue-50' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Play className="w-4 h-4" />
          Demo Mode
        </button>

        <div className="h-6 w-px bg-gray-200"></div>
        
        <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700">
          Java
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className={`w-2 h-2 rounded-full ${
            hindsightStatus === 'connected' ? 'bg-green-500' :
            hindsightStatus === 'disconnected' ? 'bg-red-400' :
            'bg-yellow-400 animate-pulse'
          }`}></span>
          {hindsightStatus === 'connected' ? 'Hindsight Connected' :
           hindsightStatus === 'disconnected' ? 'Hindsight Offline' :
           'Checking...'}
        </div>
        
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
          VP
        </div>
      </div>
    </nav>
  );
}
