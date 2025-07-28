import { Clock, RefreshCw, Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TimerRestorationModal({ 
  savedState, 
  onContinue, 
  onReset, 
  onCancel 
}) {
  const [timeAwayMessage, setTimeAwayMessage] = useState('');
  
  useEffect(() => {
    if (savedState?.lastSaveTime) {
      const timeAway = Date.now() - new Date(savedState.lastSaveTime).getTime();
      const minutesAway = Math.floor(timeAway / (1000 * 60));
      const hoursAway = Math.floor(minutesAway / 60);
      
      if (hoursAway > 0) {
        setTimeAwayMessage(`You were away for ${hoursAway}h ${minutesAway % 60}m`);
      } else if (minutesAway > 0) {
        setTimeAwayMessage(`You were away for ${minutesAway} minutes`);
      } else {
        setTimeAwayMessage('You were away for less than a minute');
      }
    }
  }, [savedState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'focus': return '🎯';
      case 'shortBreak': return '☕';
      case 'longBreak': return '🌟';
      default: return '⏱️';
    }
  };

  const getModeLabel = (mode) => {
    switch(mode) {
      case 'focus': return 'Focus Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Timer';
    }
  };

  const getStatusMessage = () => {
    if (savedState?.wasRunning) {
      return `Your timer was running when you left`;
    } else {
      return `Your timer was paused when you left`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">We found your previous timer session</p>
        </div>

        {/* Timer State Info */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl mr-3">{getModeIcon(savedState?.mode)}</span>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">
                {getModeLabel(savedState?.mode)}
              </div>
              <div className="text-3xl font-bold text-blue-600 mt-1">
                {formatTime(savedState?.timeLeft || 0)}
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center text-gray-600 text-sm">
              {savedState?.wasRunning ? (
                <><Play className="w-4 h-4 mr-1" /> {getStatusMessage()}</>
              ) : (
                <><Pause className="w-4 h-4 mr-1" /> {getStatusMessage()}</>
              )}
            </div>
            {timeAwayMessage && (
              <div className="text-gray-500 text-sm">
                {timeAwayMessage}
              </div>
            )}
          </div>
        </div>

        {/* Session Progress */}
        {savedState?.completedSessions > 0 && (
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="text-green-700 font-medium text-sm">
                Sessions completed today
              </div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {savedState.completedSessions}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Continue Where I Left Off</span>
          </button>
          
          <button
            onClick={onReset}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Start Fresh</span>
          </button>
          
          <button
            onClick={onCancel}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Decide Later
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="text-blue-800 text-sm text-center">
            <strong>💡 Tip:</strong> Your progress is automatically saved when you leave the site
          </div>
        </div>
      </div>
    </div>
  );
}