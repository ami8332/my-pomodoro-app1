import { useState, useEffect } from 'react';
import { useTimer } from '@/context/TimerContext';
import { 
  Zap, Star, Target, Flame, Rocket, Heart, Coffee, CheckCircle, 
  Trophy, Sparkles, Brain, Clock, Gift, Sun, Moon, Battery, Smile
} from 'lucide-react';

const FOCUS_COMPLETION_QUOTES = [
  { text: "🎉 Excellent! You've completed an amazing focus session!", icon: <CheckCircle className="text-green-500" size={24} />, bg: "from-green-400 to-emerald-500" },
  { text: "💪 Outstanding work! Your productivity is on fire!", icon: <Flame className="text-orange-500" size={24} />, bg: "from-orange-400 to-red-500" },
  { text: "⭐ Well done! You're building incredible focus habits!", icon: <Star className="text-yellow-500" size={24} />, bg: "from-yellow-400 to-orange-500" },
  { text: "🚀 Fantastic! One step closer to your goals!", icon: <Rocket className="text-purple-500" size={24} />, bg: "from-purple-400 to-indigo-500" },
  { text: "🏆 Perfect session! You're becoming a focus master!", icon: <Trophy className="text-blue-500" size={24} />, bg: "from-blue-400 to-cyan-500" },
  { text: "✨ Brilliant! Every focused minute counts!", icon: <Sparkles className="text-indigo-500" size={24} />, bg: "from-indigo-400 to-purple-500" },
  { text: "🌟 Amazing! Building momentum with each session!", icon: <Heart className="text-pink-500" size={24} />, bg: "from-pink-400 to-rose-500" },
  { text: "🎯 Great focus! Developing superhuman concentration!", icon: <Target className="text-cyan-500" size={24} />, bg: "from-cyan-400 to-blue-500" },
  { text: "🧠 Sharp mind! Exceptional performance today!", icon: <Brain className="text-violet-500" size={24} />, bg: "from-violet-400 to-purple-500" },
  { text: "⏱️ Time well invested! Keep it up!", icon: <Clock className="text-teal-500" size={24} />, bg: "from-teal-400 to-green-500" }
];

const SHORT_BREAK_COMPLETION_QUOTES = [
  { text: "☕ Short break complete! Ready to focus again?", icon: <Coffee className="text-amber-500" size={24} />, bg: "from-amber-400 to-orange-500" },
  { text: "🌱 Refreshed and ready! Time to tackle your next goal!", icon: <Star className="text-green-500" size={24} />, bg: "from-green-400 to-emerald-500" },
  { text: "⚡ Break time over! Let's get back to productive work!", icon: <Zap className="text-blue-500" size={24} />, bg: "from-blue-400 to-indigo-500" },
  { text: "🔄 Recharged! Your mind is fresh for the next session!", icon: <Rocket className="text-purple-500" size={24} />, bg: "from-purple-400 to-pink-500" },
  { text: "💫 Rest complete! Time to shine in your next focus session!", icon: <Heart className="text-rose-500" size={24} />, bg: "from-rose-400 to-pink-500" },
  { text: "🎊 Break finished! Let's make the next session amazing!", icon: <Target className="text-indigo-500" size={24} />, bg: "from-indigo-400 to-purple-500" },
  { text: "🌸 Quick refresh! Your mind is ready for creativity!", icon: <Sparkles className="text-pink-500" size={24} />, bg: "from-pink-400 to-rose-500" },
  { text: "🎈 Energy renewed! Get ready to blast off!", icon: <Gift className="text-cyan-500" size={24} />, bg: "from-cyan-400 to-blue-500" }
];

const LONG_BREAK_COMPLETION_QUOTES = [
  { text: "🏖️ Great long break! You're ready for big challenges!", icon: <Sun className="text-yellow-500" size={24} />, bg: "from-yellow-400 to-orange-500" },
  { text: "🌙 Full recharge complete! Your mind is at its peak!", icon: <Moon className="text-indigo-500" size={24} />, bg: "from-indigo-400 to-purple-500" },
  { text: "🎯 Strategic rest! Ready for the next cycle!", icon: <Target className="text-green-500" size={24} />, bg: "from-green-400 to-teal-500" },
  { text: "🔋 Battery at 100%! Time for peak performance!", icon: <Battery className="text-cyan-500" size={24} />, bg: "from-cyan-400 to-blue-500" },
  { text: "🧘 Perfect balance! Mind and body ready!", icon: <Heart className="text-pink-500" size={24} />, bg: "from-pink-400 to-rose-500" },
  { text: "🌟 Deep rest achieved! Ready to conquer!", icon: <Sparkles className="text-purple-500" size={24} />, bg: "from-purple-400 to-indigo-500" },
  { text: "🎪 Full recovery! Let's create something amazing!", icon: <Smile className="text-orange-500" size={24} />, bg: "from-orange-400 to-red-500" },
  { text: "🌺 Completely refreshed! Your best work awaits!", icon: <Trophy className="text-emerald-500" size={24} />, bg: "from-emerald-400 to-green-500" }
];

export default function FloatingMotivation() {
  const { mode, sessionCompleted, isRunning } = useTimer();
  const [currentQuote, setCurrentQuote] = useState(null);
  const [show, setShow] = useState(false);
  const [motivationEnabled, setMotivationEnabled] = useState(true);
  const [lastSessionCompleted, setLastSessionCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  // Show motivation when session just completed
  useEffect(() => {
    if (!motivationEnabled) return;

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

        // Hide after 6 seconds
        setTimeout(() => {
          setShow(false);
          setTimeout(() => {
            setCurrentQuote(null);
          }, 500); // Wait for animation to complete
        }, 6000);
      }
    }

    setLastSessionCompleted(sessionCompleted);
  }, [sessionCompleted, isRunning, mode, motivationEnabled, lastSessionCompleted]);

  if (!currentQuote || !motivationEnabled) return null;

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ${
      show ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-95'
    }`}>
      <div className={`bg-gradient-to-r ${currentQuote.bg} rounded-2xl shadow-2xl border border-white/30 p-6 max-w-md backdrop-blur-lg`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1 bg-white/20 rounded-full p-2">
            {currentQuote.icon}
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg leading-relaxed mb-2">
              {currentQuote.text}
            </div>
            {mode === 'focus' && (
              <div className="text-white/90 text-sm">
                🎯 Session completed! Time for a well-deserved break.
              </div>
            )}
            {(mode === 'shortBreak' || mode === 'longBreak') && (
              <div className="text-white/90 text-sm">
                💪 Ready for your next productive session?
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              setShow(false);
              setTimeout(() => setCurrentQuote(null), 500);
            }}
            className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Animated progress bar */}
        <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className={`h-full bg-white/60 rounded-full transition-all duration-[6000ms] ease-linear ${
            show ? 'w-full' : 'w-0'
          }`} />
        </div>
        
        {/* Floating animation */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/30 rounded-full animate-ping" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white/20 rounded-full animate-pulse" />
      </div>
    </div>
  );
}