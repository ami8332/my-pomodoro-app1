import { useState } from 'react';
import Navbar from '@/components/Navbar';
import TimerCard from '@/components/TimerCard';
import TasksSection from '@/components/TasksSection';
import SettingsModal from '@/components/SettingsModal';
import StatsModal from '@/components/StatsModal';
import ProfileModal from '@/components/ProfileModal';
import FloatingMotivation from '@/components/FloatingMotivation';
import CircularProgress from '@/components/CircularProgress';
import { TimerProvider, useTimer } from '@/context/TimerContext';

function HomeContent() {
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { mode } = useTimer();

  const getThemeColors = () => {
    switch(mode) {
      case 'focus': return 'bg-gradient-to-br from-blue-400 to-blue-500';
      case 'shortBreak': return 'bg-gradient-to-br from-emerald-400 to-emerald-500';
      case 'longBreak': return 'bg-gradient-to-br from-indigo-400 to-indigo-500';
      default: return 'bg-gradient-to-br from-blue-400 to-blue-500';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${getThemeColors()}`}>
      <Navbar 
        onShowSettings={() => setShowSettings(true)}
        onShowStats={() => setShowStats(true)}
        onShowProfile={() => setShowProfile(true)}
      />
      
      <div className="min-h-screen py-4">
        <TimerCard />
        <div className="max-w-lg mx-auto px-6 mt-6">
          <TasksSection />
        </div>
      </div>

      {/* Floating Motivation */}
      <FloatingMotivation />

      {/* Modals */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      {showStats && (
        <StatsModal onClose={() => setShowStats(false)} />
      )}
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <TimerProvider>
      <HomeContent />
    </TimerProvider>
  );
}