import { useState, useEffect } from 'react';
import { useTimer } from '@/context/TimerContext';
import { 
  Zap, Star, Target, Flame, Rocket, Heart, Coffee, CheckCircle, 
  Trophy, Sparkles, Brain, Clock, Gift, Sun, Moon, Battery, Smile
} from 'lucide-react';

const FOCUS_COMPLETION_QUOTES = [
  { text: "🎉 Great work!", icon: <CheckCircle size={16} />, bg: "from-green-400 to-emerald-500" },
  { text: "💪 Outstanding!", icon: <Flame size={16} />, bg: "from-orange-400 to-red-500" },
  { text: "⭐ Well done!", icon: <Star size={16} />, bg: "from-yellow-400 to-orange-500" },
  { text: "🚀 Fantastic!", icon: <Rocket size={16} />, bg: "from-purple-400 to-indigo-500" },
  { text: "🏆 Perfect session!", icon: <Trophy size={16} />, bg: "from-blue-400 to-cyan-500" },
  { text: "✨ Brilliant!", icon: <Sparkles size={16} />, bg: "from-indigo-400 to-purple-500" },
  { text: "🌟 Amazing!", icon: <Heart size={16} />, bg: "from-pink-400 to-rose-500" },
  { text: "🎯 Great focus!", icon: <Target size={16} />, bg: "from-cyan-400 to-blue-500" },
  { text: "🧠 Sharp mind!", icon: <Brain size={16} />, bg: "from-violet-400 to-purple-500" },
  { text: "⏱️ Time well spent!", icon: <Clock size={16} />, bg: "from-teal-400 to-green-500" }
];

const SHORT_BREAK_COMPLETION_QUOTES = [
  { text: "☕ Refreshed!", icon: <Coffee size={16} />, bg: "from-amber-400 to-orange-500" },
  { text: "🌱 Ready to go!", icon: <Star size={16} />, bg: "from-green-400 to-emerald-500" },
  { text: "⚡ Re-energized!", icon: <Zap size={16} />, bg: "from-blue-400 to-indigo-500" },
  { text: "🔄 Recharged!", icon: <Rocket size={16} />, bg: "from-purple-400 to-pink-500" },
  { text: "💫 Rest complete!", icon: <Heart size={16} />, bg: "from-rose-400 to-pink-500" },
  { text: "🌸 Mind ready!", icon: <Sparkles size={16} />, bg: "from-pink-400 to-rose-500" },
];

const LONG_BREAK_COMPLETION_QUOTES = [
  { text: "🏖️ Fully rested!", icon: <Sun size={16} />, bg: "from-yellow-400 to-orange-500" },
  { text: "🌙 Peak energy!", icon: <Moon size={16} />, bg: "from-indigo-400 to-purple-500" },
  { text: "🎯 Ready for more!", icon: <Target size={16} />, bg: "from-green-400 to-teal-500" },
  { text: "🔋 Battery full!", icon: <Battery size={16} />, bg: "from-cyan-400 to-blue-500" },
  { text: "🌟 Deep rest achieved!", icon: <Sparkles size={16} />, bg: "from-purple-400 to-indigo-500" },
  { text: "🌺 Completely refreshed!", icon: <Trophy size={16} />, bg: "from-emerald-400 to-green-500" }
];

export default function FloatingMotivation() {
  const { mode, sessionCompleted, isRunning } = useTimer();
  const [currentQuote, setCurrentQuote] = useState(null);
  const [show, setShow] = useState(false);
  const [motivationEnabled, setMotivationEnabled] = useState(true);
  const [lastSessionCompleted, setLastSessionCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasShownForSession, setHasShownForSession] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Load preference from localStorage (only on client-side)
    const saved = localStorage.getItem('timefocus-motivation-enabled');
    if (saved !== null) {
      setMotivationEnabled(JSON.parse(saved));
    }
  }, [mounted]);

  // Reset "has shown" flag when session starts
  useEffect(() => {
    if (isRunning && !sessionCompleted) {
      setHasShownForSession(false);
    }
  }, [isRunning, sessionCompleted]);

  // Show motivation when session just completed - ONLY ONCE
  useEffect(() => {
    if (!motivationEnabled || hasShownForSession) return;

    // Check if session just completed (changed from false to true)
    if (!lastSessionCompleted && sessionCompleted && !isRunning) {
      let quotes;
      
      if (mode === 'focus') {
        quotes = FOCUS_COMPLETION_QUOTES;
      } else if (mode === 'shortBreak') {
        quotes = SHORT_BREAK_COMPLETION_QUOTES;
      } else if (mode === 'longBreak') {
        quotes = LONG_BREAK_COMPLETION_QUOTES;
      }
      
      if (quotes) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(randomQuote);
        setShow(true);
        setHasShownForSession(true); // Mark as shown for this session

        // Hide after 4 seconds
        setTimeout(() => {
          setShow(false);
          setTimeout(() => {
            setCurrentQuote(null);
          }, 500); // Wait for animation to complete
        }, 4000);
      }
    }

    setLastSessionCompleted(sessionCompleted);
  }, [sessionCompleted, isRunning, mode, motivationEnabled, lastSessionCompleted, hasShownForSession]);

  if (!currentQuote || !motivationEnabled) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-500 ${
      show 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`bg-gradient-to-r ${currentQuote.bg} rounded-lg shadow-lg border border-white/30 p-2 max-w-48 backdrop-blur-sm`}>
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0 bg-white/20 rounded-full p-1">
            <div className="text-white">
              {currentQuote.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-xs leading-tight">
              {currentQuote.text}
            </div>
          </div>
          <button 
            onClick={() => {
              setShow(false);
              setTimeout(() => setCurrentQuote(null), 500);
            }}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-3 h-3 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Small animated progress bar */}
        <div className="mt-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className={`h-full bg-white/60 rounded-full transition-all duration-[4000ms] ease-linear ${
            show ? 'w-full' : 'w-0'
          }`} />
        </div>
        
        {/* Small floating animation */}
        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping" />
      </div>
    </div>
  );
}