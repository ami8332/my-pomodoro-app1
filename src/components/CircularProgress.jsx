import { useTimer } from '@/context/TimerContext';
import { useState, useEffect } from 'react';

export default function CircularProgress({ size = 120, strokeWidth = 8 }) {
  const { mode, timeLeft, isRunning, settings } = useTimer();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const getTimerDuration = (currentMode) => {
    // Use settings from TimerContext instead of localStorage directly
    switch(currentMode) {
      case 'focus': return settings.focusTime * 60;
      case 'shortBreak': return settings.shortBreakTime * 60;
      case 'longBreak': return settings.longBreakTime * 60;
      default: return 25 * 60;
    }
  };

  // Don't render on server-side
  if (!mounted) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalDuration = getTimerDuration(mode);
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColors = () => {
    switch(mode) {
      case 'focus': 
        return {
          primary: '#3B82F6', // Blue
          secondary: '#DBEAFE', // Light blue
          gradient: 'from-blue-500 to-indigo-600'
        };
      case 'shortBreak': 
        return {
          primary: '#10B981', // Green
          secondary: '#D1FAE5', // Light green
          gradient: 'from-emerald-500 to-green-600'
        };
      case 'longBreak': 
        return {
          primary: '#8B5CF6', // Purple
          secondary: '#EDE9FE', // Light purple
          gradient: 'from-indigo-500 to-purple-600'
        };
      default: 
        return {
          primary: '#3B82F6',
          secondary: '#DBEAFE',
          gradient: 'from-blue-500 to-indigo-600'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="relative flex items-center justify-center">
      {/* Background circle */}
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.secondary}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-30"
        />
        
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={`gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mode === 'focus' ? '#3B82F6' : mode === 'shortBreak' ? '#10B981' : '#8B5CF6'} />
            <stop offset="100%" stopColor={mode === 'focus' ? '#6366F1' : mode === 'shortBreak' ? '#059669' : '#7C3AED'} />
          </linearGradient>
        </defs>
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${mode})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${isRunning ? 'animate-pulse' : ''}`}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))'
          }}
        />
      </svg>

      {/* Pulsing center dot when running */}
      {isRunning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient} animate-ping opacity-75`} />
          <div className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${colors.gradient}`} />
        </div>
      )}

      {/* Progress percentage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </div>
        </div>
      </div>

      {/* Animated sparks around the circle when running */}
      {isRunning && (
        <>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${colors.gradient} animate-bounce`} />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
            <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${colors.gradient} animate-bounce delay-150`} />
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
            <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${colors.gradient} animate-bounce delay-300`} />
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
            <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${colors.gradient} animate-bounce delay-500`} />
          </div>
        </>
      )}
    </div>
  );
}