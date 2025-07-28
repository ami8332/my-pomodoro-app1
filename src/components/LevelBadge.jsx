import { Star, Zap } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';

export default function LevelBadge() {
  const { achievements } = useTimer();
  
  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  const currentLevel = calculateLevel(achievements.xp);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 mb-6">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-500/20 rounded-full p-2">
            <Star className="text-yellow-300" size={20} />
          </div>
          <div>
            <div className="font-semibold">Level {currentLevel}</div>
            <div className="text-white/70 text-sm">{achievements.xp} XP</div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="font-semibold">{achievements.completedSessions}</div>
            <div className="text-white/70">Sessions</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{achievements.currentStreak}</div>
            <div className="text-white/70">Streak</div>
          </div>
          <div className="bg-white/10 rounded-full p-2">
            <Zap className="text-blue-300" size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}