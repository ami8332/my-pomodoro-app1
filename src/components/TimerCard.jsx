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
    sessionCompleted,
    settings
  } = useTimer();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentMessage = () => {
    if (sessionCompleted) {
      switch(mode) {
        case 'focus': 
          const isNextLongBreak = currentSessionNumber % settings.longBreakInterval === 0;
          return isNextLongBreak 
            ? 'Session Complete! 🎉 Time for a LONG break!' 
            : 'Session Complete! 🎉 Time for a break!';
        case 'shortBreak': return 'Break over! ⚡ Ready to focus again?';
        case 'longBreak': return 'Long break finished! 🌟 Ready for productive work!';
        default: return 'Ready to focus! 🎯';
      }
    }
    
    switch(mode) {
      case 'focus': return isRunning ? 'Stay focused! 🎯' : 'Ready to focus! 🎯';
      case 'shortBreak': return isRunning ? 'Enjoy your break! ☕' : 'Time for a short break! ☕';
      case 'longBreak': return isRunning ? 'Relax and recharge! 🌟' : 'Time for a LONG break! 🌟';
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

  const getCurrentDuration = () => {
    switch(mode) {
      case 'focus': return settings.focusTime;
      case 'shortBreak': return settings.shortBreakTime;
      case 'longBreak': return settings.longBreakTime;
      default: return 25;
    }
  };

  const getTabStyle = (tabMode) => {
    const isActive = mode === tabMode;
    const baseStyle = `px-4 py-2 rounded-md transition-all duration-300 font-medium text-xs`;
    
    if (tabMode === 'longBreak') {
      return `${baseStyle} ${
        isActive 
          ? 'bg-white text-indigo-600 shadow-md ring-2 ring-indigo-300' 
          : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/30'
      }`;
    }
    
    if (tabMode === 'focus') {
      return `${baseStyle} ${
        isActive 
          ? 'bg-white text-blue-500 shadow-md' 
          : 'text-white/80 hover:text-white hover:bg-white/10'
      }`;
    }
    
    return `${baseStyle} ${
      isActive 
        ? 'bg-white text-emerald-600 shadow-md' 
        : 'text-white/80 hover:text-white hover:bg-white/10'
    }`;
  };

  return (
    <div className="max-w-lg mx-auto px-6">
      {/* Mode Selection Tabs */}
      <div className="flex justify-center space-x-2 mb-8">
        <button 
          onClick={() => changeMode('focus')}
          className={getTabStyle('focus')}
        >
          Focus
        </button>
        <button 
          onClick={() => changeMode('shortBreak')}
          className={getTabStyle('shortBreak')}
        >
          Short Break
        </button>
        <button 
          onClick={() => changeMode('longBreak')}
          className={getTabStyle('longBreak')}
        >
          Long Break
        </button>
      </div>

      {/* Main Timer Card */}
      <div className={`backdrop-blur-lg rounded-3xl p-8 border shadow-xl ${
        mode === 'longBreak' 
          ? 'bg-purple-500/10 border-purple-300/20' 
          : 'bg-white/10 border-white/20'
      }`}>
        
        {/* Session Completed Banner */}
        {sessionCompleted && (
          <div className="mb-6">
            <div className={`text-center py-3 px-6 rounded-xl text-white font-bold text-sm ${
              mode === 'focus' 
                ? (currentSessionNumber % settings.longBreakInterval === 0 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 animate-bounce' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-600 animate-bounce')
                : 'bg-gradient-to-r from-green-500 to-emerald-600 animate-bounce'
            }`}>
              {mode === 'focus' 
                ? (currentSessionNumber % settings.longBreakInterval === 0 
                    ? '🎉 Time for your LONG BREAK! You earned it!' 
                    : '🎉 Great work! Time for a short break!')
                : '⚡ Break complete! Ready to get back to work?'
              }
            </div>
          </div>
        )}

        {/* Main Timer Section */}
        <div className="grid lg:grid-cols-2 gap-6 items-center mb-4">
          {/* Left Side - Circular Progress */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <CircularProgress size={120} strokeWidth={6} />
              
              {/* Completion celebration animation */}
              {sessionCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-full animate-ping opacity-75 ${
                    mode === 'longBreak' ? 'bg-purple-400' : 'bg-yellow-400'
                  }`} />
                  <div className={`absolute w-6 h-6 rounded-full animate-pulse flex items-center justify-center ${
                    mode === 'longBreak' ? 'bg-purple-500' : 'bg-yellow-500'
                  }`}>
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
              <h2 className={`text-base font-medium ${
                mode === 'longBreak' ? 'text-purple-200' : 'text-white/90'
              }`}>
                {getSessionInfo()}
              </h2>
              <div className={`text-2xl lg:text-3xl font-extralight tracking-wider transition-all duration-300 ${
                isRunning ? 'animate-pulse' : ''
              } ${sessionCompleted ? 
                (mode === 'longBreak' ? 'text-purple-300 animate-bounce' : 'text-yellow-400 animate-bounce') 
                : (mode === 'longBreak' ? 'text-purple-100' : 'text-white')
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            
            {/* Status Message */}
            <div className={`text-sm font-medium transition-all duration-500 ${
              sessionCompleted ? 
                (mode === 'longBreak' ? 'text-purple-300' : 'text-yellow-400') 
                : (mode === 'longBreak' ? 'text-purple-200' : 'text-white/80')
            }`}>
              {getCurrentMessage()}
            </div>
            
            {/* Control Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              <button 
                onClick={toggleTimer}
                className={`text-blue-500 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-white/90 transition-all duration-300 flex items-center space-x-2 shadow-lg transform hover:scale-105 ${
                  isRunning ? 'animate-pulse' : ''
                } ${
                  mode === 'longBreak' 
                    ? 'bg-purple-100 hover:bg-purple-200' 
                    : 'bg-white'
                }`}
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
                <span>{isRunning ? 'PAUSE' : 'START'}</span>
              </button>
              
              <button 
                onClick={skipTimer}
                className={`backdrop-blur-sm text-white px-3 py-2.5 rounded-lg hover:bg-white/30 transition-all duration-300 border transform hover:scale-105 flex items-center space-x-1 ${
                  mode === 'longBreak' 
                    ? 'bg-purple-500/20 border-purple-300/30' 
                    : 'bg-white/20 border-white/30'
                }`}
                title="Skip current session"
              >
                <SkipForward size={14} />
                <span className="hidden sm:inline text-xs">Skip</span>
              </button>
              
              <button 
                onClick={resetTimer}
                className={`backdrop-blur-sm text-white px-3 py-2.5 rounded-lg hover:bg-white/30 transition-all duration-300 border transform hover:scale-105 flex items-center space-x-1 ${
                  mode === 'longBreak' 
                    ? 'bg-purple-500/20 border-purple-300/30' 
                    : 'bg-white/20 border-white/30'
                }`}
                title="Reset current timer"
              >
                <RefreshCw size={14} />
                <span className="hidden sm:inline text-xs">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className={`backdrop-blur-lg rounded-xl p-4 border shadow-lg ${
          mode === 'longBreak' 
            ? 'bg-purple-500/20 border-purple-300/30' 
            : 'bg-white/20 border-white/30'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Session Number */}
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{currentSessionNumber}</div>
              <div className={`text-xs ${mode === 'longBreak' ? 'text-purple-200' : 'text-white/70'}`}>
                Current Session
              </div>
              <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    mode === 'focus' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    mode === 'shortBreak' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                    'bg-gradient-to-r from-purple-400 to-purple-600'
                  }`}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Total Duration */}
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {getCurrentDuration()}
              </div>
              <div className={`text-xs ${mode === 'longBreak' ? 'text-purple-200' : 'text-white/70'}`}>
                Total Minutes
              </div>
              <div className="flex justify-center mt-1 space-x-0.5">
                {[...Array(mode === 'focus' ? 5 : mode === 'shortBreak' ? 2 : 4)].map((_, i) => (
                  <div key={i} className={`w-1 h-1 rounded-full ${
                    mode === 'longBreak' ? 'bg-purple-300/60' : 'bg-white/60'
                  }`} />
                ))}
              </div>
            </div>

            {/* Time Left */}
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.floor(timeLeft / 60)}m
              </div>
              <div className={`text-xs ${mode === 'longBreak' ? 'text-purple-200' : 'text-white/70'}`}>
                Time Left
              </div>
              <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    mode === 'focus' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    mode === 'shortBreak' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                    'bg-gradient-to-r from-purple-400 to-purple-600'
                  }`}
                  style={{ 
                    width: `${((timeLeft / (getCurrentDuration() * 60)) * 100).toFixed(1)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Long Break Info */}
        {mode === 'longBreak' && (
          <div className="mt-4 text-center">
            <div className="text-purple-200 text-sm">
              🌟 Extended break after {settings.longBreakInterval} focus sessions 🌟
            </div>
          </div>
        )}
      </div>
    </div>
  );
}