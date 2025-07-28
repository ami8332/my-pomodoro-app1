import { Play, Pause, SkipForward, RefreshCw, Zap } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';
import CircularProgress from '@/components/CircularProgress';

export default function TimerCard() {
  const { 
    mode, 
    timeLeft, 
    isRunning, 
    toggleTimer, 
    skipTimer,
    resetTimer,
    changeMode,
    currentSessionNumber,
    sessionCompleted
  } = useTimer();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentMessage = () => {
    if (sessionCompleted) {
      switch(mode) {
        case 'focus': return 'Session Complete! 🎉 Time for a break!';
        case 'shortBreak': return 'Break over! ⚡ Ready to focus again?';
        case 'longBreak': return 'Long break finished! 🌟 Let\'s get productive!';
        default: return 'Ready to focus! 🎯';
      }
    }
    
    switch(mode) {
      case 'focus': return isRunning ? 'Stay focused! 🎯' : 'Ready to focus! 🎯';
      case 'shortBreak': return isRunning ? 'Enjoy your break! ☕' : 'Time for a short break! ☕';
      case 'longBreak': return isRunning ? 'Relax and recharge! 🌟' : 'Long break time! 🌟';
      default: return 'Ready to focus! 🎯';
    }
  };

  const getSessionInfo = () => {
    if (mode === 'focus') {
      return `Focus Session #${currentSessionNumber}`;
    } else if (mode === 'shortBreak') {
      return 'Short Break';
    } else {
      return 'Long Break';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2">
      {/* Mode Tabs - أصغر */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-white/15 backdrop-blur-lg rounded-lg p-0.5 border border-white/20 shadow-lg">
          <button 
            onClick={() => changeMode('focus')}
            className={`px-4 py-2 rounded-md transition-all duration-300 font-medium text-xs ${
              mode === 'focus' 
                ? 'bg-white text-blue-500 shadow-md' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            🎯 Focus Time
          </button>
          <button 
            onClick={() => changeMode('shortBreak')}
            className={`px-4 py-2 rounded-md transition-all duration-300 font-medium text-xs ${
              mode === 'shortBreak' 
                ? 'bg-white text-emerald-500 shadow-md' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            ☕ Short Break
          </button>
          <button 
            onClick={() => changeMode('longBreak')}
            className={`px-4 py-2 rounded-md transition-all duration-300 font-medium text-xs ${
              mode === 'longBreak' 
                ? 'bg-white text-indigo-500 shadow-md' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            🌟 Long Break
          </button>
        </div>
      </div>

      {/* Main Timer Section - مضغوط جداً */}
      <div className="grid lg:grid-cols-2 gap-6 items-center mb-4">
        {/* Left Side - Circular Progress */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <CircularProgress size={120} strokeWidth={6} />
            
            {/* Completion celebration animation */}
            {sessionCompleted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75" />
                <div className="absolute w-6 h-6 bg-yellow-500 rounded-full animate-pulse flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Timer Display & Controls */}
        <div className="text-center lg:text-left space-y-2">
          {/* Session Info */}
          <div className="space-y-1">
            <h2 className="text-white/90 text-base font-medium">
              {getSessionInfo()}
            </h2>
            <div className={`text-2xl lg:text-3xl font-extralight text-white tracking-wider transition-all duration-300 ${
              isRunning ? 'animate-pulse' : ''
            } ${sessionCompleted ? 'text-yellow-400 animate-bounce' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {/* Status Message */}
          <div className={`text-sm font-medium transition-all duration-500 ${
            sessionCompleted ? 'text-yellow-400' : 'text-white/80'
          }`}>
            {getCurrentMessage()}
          </div>
          
          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            <button 
              onClick={toggleTimer}
              className={`bg-white text-blue-500 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-white/90 transition-all duration-300 flex items-center space-x-2 shadow-lg transform hover:scale-105 ${
                isRunning ? 'animate-pulse' : ''
              }`}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              <span>{isRunning ? 'PAUSE' : 'START'}</span>
            </button>
            
            <button 
              onClick={skipTimer}
              className="bg-white/20 backdrop-blur-sm text-white px-3 py-2.5 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 transform hover:scale-105 flex items-center space-x-1"
              title="Skip current session"
            >
              <SkipForward size={14} />
              <span className="hidden sm:inline text-xs">Skip</span>
            </button>
            
            <button 
              onClick={resetTimer}
              className="bg-white/20 backdrop-blur-sm text-white px-3 py-2.5 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 transform hover:scale-105 flex items-center space-x-1"
              title="Reset current timer"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline text-xs">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Section - مصغرة جداً */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Session Number */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{currentSessionNumber}</div>
            <div className="text-white/70 text-xs">Current Session</div>
            <div className="w-full bg-white/20 rounded-full h-1 mt-1">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  mode === 'focus' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                  mode === 'shortBreak' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                  'bg-gradient-to-r from-indigo-400 to-indigo-600'
                }`}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Total Duration */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {mode === 'focus' ? '25' : mode === 'shortBreak' ? '5' : '15'}
            </div>
            <div className="text-white/70 text-xs">Total Minutes</div>
            <div className="flex justify-center mt-1 space-x-0.5">
              {[...Array(mode === 'focus' ? 5 : mode === 'shortBreak' ? 2 : 3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
              ))}
            </div>
          </div>

          {/* Time Remaining */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {Math.ceil(timeLeft / 60)}
            </div>
            <div className="text-white/70 text-xs">Minutes Left</div>
            <div className="mt-1">
              {sessionCompleted ? (
                <div className="inline-flex items-center px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                  ✅ Complete
                </div>
              ) : isRunning ? (
                <div className="inline-flex items-center px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium animate-pulse">
                  ⏱️ Running
                </div>
              ) : (
                <div className="inline-flex items-center px-2 py-0.5 bg-gray-500/20 text-gray-300 rounded-full text-xs font-medium">
                  ⏸️ Paused
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {sessionCompleted && (
          <div className="mt-3 text-center">
            <div className="text-yellow-400 text-xs font-semibold animate-fade-in">
              🎊 Well done! Your dedication is paying off! 🎊
            </div>
          </div>
        )}
      </div>
    </div>
  );
}