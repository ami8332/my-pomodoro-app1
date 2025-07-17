import { X, Clock, Target, TrendingUp, Calendar, Award, Zap, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StatsModal({ onClose }) {
  const [stats, setStats] = useState({
    todayFocus: 0,
    weeklyFocus: 0,
    totalSessions: 0,
    completedTasks: 0,
    totalTasks: 0,
    currentStreak: 0,
    totalFocusTime: 0,
    averageSessionLength: 0,
    bestStreak: 0,
    thisWeekSessions: 0,
    completionRate: 0
  });

  const [dailyStats, setDailyStats] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadStats();
    }
  }, [mounted]);

  const loadStats = () => {
    // Only access localStorage on client-side
    if (typeof window === 'undefined') return;
    // Get user stats from localStorage
    const savedStats = localStorage.getItem('timefocus-user-stats');
    const userStats = savedStats ? JSON.parse(savedStats) : {
      totalSessions: 0,
      totalFocusTime: 0,
      streak: 0,
      tasksCompleted: 0,
      averageSessionLength: 0,
      joinDate: new Date().toISOString()
    };

    // Get session history from localStorage
    const sessionHistory = JSON.parse(localStorage.getItem('timefocus-session-history') || '[]');
    
    // Get tasks data
    const tasks = JSON.parse(localStorage.getItem('timefocus-tasks') || '[]');
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    // Calculate today's stats
    const today = new Date().toDateString();
    const todaySessions = sessionHistory.filter(session => 
      new Date(session.date).toDateString() === today
    );
    const todayFocus = todaySessions.reduce((total, session) => total + (session.duration || 0), 0);

    // Calculate this week's stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekSessions = sessionHistory.filter(session => 
      new Date(session.date) >= oneWeekAgo
    );
    const weeklyFocus = thisWeekSessions.reduce((total, session) => total + (session.duration || 0), 0);

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate best streak (this would need more complex logic in a real app)
    const bestStreak = Math.max(userStats.streak, 0);

    // Generate daily stats for the last 7 days
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      
      const daySessions = sessionHistory.filter(session => 
        new Date(session.date).toDateString() === dayStr
      );
      const dayFocus = daySessions.reduce((total, session) => total + (session.duration || 0), 0);
      
      daily.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        focus: Math.round(dayFocus / 60), // Convert to minutes
        sessions: daySessions.length
      });
    }

    setStats({
      todayFocus: Math.round(todayFocus / 60), // Convert to minutes
      weeklyFocus: Math.round(weeklyFocus / 60),
      totalSessions: userStats.totalSessions,
      completedTasks,
      totalTasks,
      currentStreak: userStats.streak,
      totalFocusTime: Math.round(userStats.totalFocusTime / 60),
      averageSessionLength: Math.round(userStats.averageSessionLength / 60),
      bestStreak,
      thisWeekSessions: thisWeekSessions.length,
      completionRate: Math.round(completionRate)
    });

    setDailyStats(daily);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProductivityLevel = () => {
    if (stats.totalSessions < 5) return { level: "Getting Started", color: "text-gray-600", emoji: "🌱" };
    if (stats.totalSessions < 20) return { level: "Building Momentum", color: "text-blue-600", emoji: "🚀" };
    if (stats.totalSessions < 50) return { level: "Focused", color: "text-green-600", emoji: "🎯" };
    if (stats.totalSessions < 100) return { level: "Productive", color: "text-purple-600", emoji: "⚡" };
    return { level: "Master", color: "text-yellow-600", emoji: "👑" };
  };

  const productivity = getProductivityLevel();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
            <span className={`text-sm ${productivity.color} font-medium flex items-center space-x-1`}>
              <span>{productivity.emoji}</span>
              <span>{productivity.level}</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Today's Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <Calendar size={20} />
              <span>Today's Performance</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="text-blue-500" size={24} />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.todayFocus === 0 ? "0m" : formatTime(stats.todayFocus)}
                    </div>
                    <div className="text-gray-600 text-sm">Focus Time</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Target className="text-green-500" size={24} />
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {dailyStats[dailyStats.length - 1]?.sessions || 0}
                    </div>
                    <div className="text-gray-600 text-sm">Sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>This Week</span>
            </h3>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold">
                    {stats.weeklyFocus === 0 ? "0m" : formatTime(stats.weeklyFocus)}
                  </div>
                  <div className="text-blue-100">Total Focus Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.thisWeekSessions}</div>
                  <div className="text-blue-100">Sessions Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Activity Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">7-Day Activity</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-end justify-between h-32 space-x-2">
                {dailyStats.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-200 rounded-t-lg relative overflow-hidden" style={{height: '80px'}}>
                      <div 
                        className="w-full bg-blue-500 rounded-t-lg absolute bottom-0 transition-all duration-500"
                        style={{
                          height: `${Math.max((day.focus / Math.max(...dailyStats.map(d => d.focus), 1)) * 100, 5)}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      <div className="font-medium">{day.day}</div>
                      <div>{day.focus}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Stats Grid */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Overall Statistics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Award className="mx-auto mb-2 text-purple-500" size={24} />
                <div className="text-2xl font-bold text-purple-600">{stats.totalSessions}</div>
                <div className="text-gray-600 text-sm">Total Sessions</div>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Zap className="mx-auto mb-2 text-orange-500" size={24} />
                <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                <div className="text-gray-600 text-sm">Current Streak</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <CheckCircle className="mx-auto mb-2 text-green-500" size={24} />
                <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                <div className="text-gray-600 text-sm">Tasks Done</div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Clock className="mx-auto mb-2 text-blue-500" size={24} />
                <div className="text-2xl font-bold text-blue-600">
                  {stats.averageSessionLength === 0 ? "0m" : formatTime(stats.averageSessionLength)}
                </div>
                <div className="text-gray-600 text-sm">Avg Session</div>
              </div>
            </div>
          </div>

          {/* Tasks Progress */}
          {stats.totalTasks > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Tasks Progress</h3>
              <div className="bg-white border rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Completed Tasks</span>
                  <span className="font-semibold">{stats.completedTasks}/{stats.totalTasks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {stats.completionRate}% completion rate
                </div>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                {stats.totalSessions === 0 
                  ? "🚀 Ready to start your first focus session?" 
                  : stats.todayFocus === 0
                  ? "☀️ New day, new opportunities to focus!"
                  : stats.todayFocus > 60
                  ? "🔥 Fantastic focus today! Keep up the momentum!"
                  : "💪 Great start! Every minute of focus counts!"}
              </div>
              {stats.totalSessions >= 10 && (
                <div className="text-sm text-gray-600">
                  You've completed {stats.totalSessions} sessions and focused for{" "}
                  {formatTime(stats.totalFocusTime)}. That's incredible dedication!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}