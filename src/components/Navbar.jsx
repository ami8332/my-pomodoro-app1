import { Clock, BarChart3, Settings, User } from 'lucide-react';

export default function Navbar({ onShowSettings, onShowStats, onShowProfile }) {
  return (
    <nav className="flex justify-between items-center p-6 text-white">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
          <Clock className="text-white" size={20} />
        </div>
        <h1 className="text-2xl font-bold tracking-wide">TimeFocus</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={onShowStats}
          className="px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-300 flex items-center space-x-2 border border-white/20"
        >
          <BarChart3 size={18} />
          <span className="font-medium">Analytics</span>
        </button>
        <button 
          onClick={onShowSettings}
          className="px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-300 flex items-center space-x-2 border border-white/20"
        >
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </button>
        <button 
          onClick={onShowProfile}
          className="px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-300 flex items-center space-x-2 border border-white/20"
        >
          <User size={18} />
          <span className="font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
}