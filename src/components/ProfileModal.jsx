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
      
      // Show success message
      showSuccessToast('Name updated successfully! 👤');
    }
  };

  const handleCancel = () => {
    setTempName(userName);
    setIsEditing(false);
  };

  // Success toast function
  const showSuccessToast = (message) => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: system-ui, -apple-system, sans-serif;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
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
    if (totalSessions < 10) return { level: 1, title: 'Beginner', color: 'from-gray-400 to-gray-500' };
    if (totalSessions < 50) return { level: 2, title: 'Focused', color: 'from-green-400 to-green-500' };
    if (totalSessions < 100) return { level: 3, title: 'Productive', color: 'from-blue-400 to-blue-500' };
    if (totalSessions < 250) return { level: 4, title: 'Expert', color: 'from-purple-400 to-purple-500' };
    return { level: 5, title: 'Master', color: 'from-yellow-400 to-orange-500' };
  };

  const currentLevel = getLevel(userStats.totalSessions);
  const nextLevelSessions = currentLevel.level === 5 ? 250 : 
    currentLevel.level === 4 ? 250 :
    currentLevel.level === 3 ? 100 :
    currentLevel.level === 2 ? 50 : 10;

  const progressToNext = currentLevel.level < 5 ? 
    Math.min((userStats.totalSessions / nextLevelSessions) * 100, 100) : 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto relative">
        
        {/* FIXED: PROMINENT CLOSE BUTTON AT TOP RIGHT */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            title="Close Profile"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-between items-center mb-6 pr-12">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        </div>

        {/* User Info Section */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 bg-gradient-to-r ${currentLevel.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
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
          <div className={`mt-4 inline-flex items-center space-x-2 bg-gradient-to-r ${currentLevel.color} text-white px-4 py-2 rounded-full shadow-lg`}>
            <Award size={16} />
            <span className="font-semibold">Level {currentLevel.level} - {currentLevel.title}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <Clock className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="text-2xl font-bold text-blue-800">{userStats.totalSessions}</div>
            <div className="text-sm text-blue-600">Total Sessions</div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
            <TrendingUp className="mx-auto mb-2 text-green-600" size={24} />
            <div className="text-2xl font-bold text-green-800">{formatTime(userStats.totalFocusTime)}</div>
            <div className="text-sm text-green-600">Focus Time</div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
            <Target className="mx-auto mb-2 text-purple-600" size={24} />
            <div className="text-2xl font-bold text-purple-800">{userStats.tasksCompleted}</div>
            <div className="text-sm text-purple-600">Tasks Done</div>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
            <Award className="mx-auto mb-2 text-orange-600" size={24} />
            <div className="text-2xl font-bold text-orange-800">{userStats.streak}</div>
            <div className="text-sm text-orange-600">Day Streak</div>
          </div>
        </div>

        {/* Progress to Next Level */}
        {currentLevel.level < 5 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progress to Level {currentLevel.level + 1}</span>
              <span className="text-sm text-gray-500">{userStats.totalSessions}/{nextLevelSessions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${currentLevel.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              {nextLevelSessions - userStats.totalSessions} more sessions to level up!
            </div>
          </div>
        )}

        {/* Member Since */}
        <div className="bg-gray-50 rounded-xl p-4 text-center mb-6 border">
          <Calendar className="mx-auto mb-2 text-gray-600" size={20} />
          <div className="text-sm text-gray-600">Member since</div>
          <div className="font-semibold text-gray-800">{formatDate(userStats.joinDate)}</div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Award className="text-yellow-600" size={18} />
            <span>Achievements</span>
          </h4>
          <div className="space-y-2 text-sm">
            {userStats.totalSessions >= 1 && (
              <div className="flex items-center space-x-2 text-green-700">
                <span>🎯</span>
                <span>First Focus Session Complete</span>
              </div>
            )}
            {userStats.totalSessions >= 10 && (
              <div className="flex items-center space-x-2 text-blue-700">
                <span>🔟</span>
                <span>10 Sessions Milestone</span>
              </div>
            )}
            {userStats.totalSessions >= 50 && (
              <div className="flex items-center space-x-2 text-purple-700">
                <span>🌟</span>
                <span>Focus Warrior (50 Sessions)</span>
              </div>
            )}
            {userStats.totalSessions >= 100 && (
              <div className="flex items-center space-x-2 text-orange-700">
                <span>🏆</span>
                <span>Productivity Master (100 Sessions)</span>
              </div>
            )}
            {userStats.streak >= 7 && (
              <div className="flex items-center space-x-2 text-red-700">
                <span>🔥</span>
                <span>Week-long Streak</span>
              </div>
            )}
            {userStats.totalSessions === 0 && (
              <div className="text-gray-500 text-center py-2">
                Complete your first focus session to earn achievements!
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2 font-semibold"
          >
            <span>Start Focusing</span>
          </button>
        </div>
      </div>
    </div>
  );
}