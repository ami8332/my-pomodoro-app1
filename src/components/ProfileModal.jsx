import { X, User, Clock, Target, Award, Calendar, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfileModal({ onClose }) {
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    totalFocusTime: 0,
    streak: 0,
    tasksCompleted: 0,
    averageSessionLength: 0,
    joinDate: new Date().toISOString()
  });
  
  const [userName, setUserName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Load user data from localStorage (only on client-side)
    const savedName = localStorage.getItem('timefocus-username') || 'Pomodoro Master';
    const savedStats = localStorage.getItem('timefocus-user-stats');
    const savedJoinDate = localStorage.getItem('timefocus-join-date');

    setUserName(savedName);
    setTempName(savedName);

    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }

    // Set join date if it doesn't exist
    if (!savedJoinDate) {
      const joinDate = new Date().toISOString();
      localStorage.setItem('timefocus-join-date', joinDate);
      setUserStats(prev => ({ ...prev, joinDate }));
    } else {
      setUserStats(prev => ({ ...prev, joinDate: savedJoinDate }));
    }
  }, [mounted]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      
      // Only save to localStorage on client-side
      if (typeof window !== 'undefined') {
        localStorage.setItem('timefocus-username', tempName.trim());
      }
      
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempName(userName);
    setIsEditing(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getLevel = (totalSessions) => {
    if (totalSessions < 10) return { level: 1, title: 'Beginner' };
    if (totalSessions < 50) return { level: 2, title: 'Focused' };
    if (totalSessions < 100) return { level: 3, title: 'Productive' };
    if (totalSessions < 250) return { level: 4, title: 'Expert' };
    return { level: 5, title: 'Master' };
  };

  const currentLevel = getLevel(userStats.totalSessions);
  const nextLevelSessions = currentLevel.level === 5 ? 250 : 
    currentLevel.level === 4 ? 250 :
    currentLevel.level === 3 ? 100 :
    currentLevel.level === 2 ? 50 : 10;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-xl font-bold text-center w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                maxLength={20}
              />
              <div className="flex justify-center space-x-2">
                <button
                  onClick={handleSaveName}
                  className="px-4 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 
                className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {userName} ✏️
              </h3>
              <p className="text-gray-500 text-sm mt-1">Click name to edit</p>
            </div>
          )}

          {/* Level Badge */}
          <div className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
            <Award size={16} />
            <span className="font-semibold">Level {currentLevel.level} - {currentLevel.title}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Clock className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="text-2xl font-bold text-blue-800">{userStats.totalSessions}</div>
            <div className="text-sm text-blue-600">Total Sessions</div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <TrendingUp className="mx-auto mb-2 text-green-600" size={24} />
            <div className="text-2xl font-bold text-green-800">{formatTime(userStats.totalFocusTime)}</div>
            <div className="text-sm text-green-600">Focus Time</div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <Target className="mx-auto mb-2 text-purple-600" size={24} />
            <div className="text-2xl font-bold text-purple-800">{userStats.tasksCompleted}</div>
            <div className="text-sm text-purple-600">Tasks Done</div>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <Award className="mx-auto mb-2 text-orange-600" size={24} />
            <div className="text-2xl font-bold text-orange-800">{userStats.streak}</div>
            <div className="text-sm text-orange-600">Day Streak</div>
          </div>
        </div>

        {/* Progress to Next Level */}
        {currentLevel.level < 5 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress to Level {currentLevel.level + 1}</span>
              <span className="text-sm text-gray-500">{userStats.totalSessions}/{nextLevelSessions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((userStats.totalSessions / nextLevelSessions) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Member since</span>
            </div>
            <span className="font-medium">{formatDate(userStats.joinDate)}</span>
          </div>
          
          {userStats.averageSessionLength > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Average session</span>
              </div>
              <span className="font-medium">{formatTime(userStats.averageSessionLength)}</span>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <p className="text-center text-blue-800 font-medium">
            {userStats.totalSessions === 0 
              ? "🚀 Ready to start your productivity journey?" 
              : userStats.totalSessions < 10
              ? "🌱 Great start! Keep building your focus habit!"
              : userStats.totalSessions < 50
              ? "🔥 You're on fire! Consistency is key!"
              : "👑 Amazing dedication! You're a true focus master!"}
          </p>
        </div>
      </div>
    </div>
  );
}