import { X, Star } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';
import { useEffect, useState } from 'react';

export default function MotivationalAlert() {
  const { achievements, clearMotivationalMessage } = useTimer();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievements.motivationalMessage) {
      setShow(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          clearMotivationalMessage();
        }, 300);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievements.motivationalMessage]);

  if (!achievements.motivationalMessage || !show) return null;

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      clearMotivationalMessage();
    }, 300);
  };

  return (
    <div className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border-l-4 border-green-500">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <Star className="text-green-600" size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-800 mb-1">Well Done!</div>
              <div className="text-gray-600 text-sm">{achievements.motivationalMessage}</div>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}