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
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate daily stats for the chart (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = date.toDateString();
      
      const daySessions = sessionHistory.filter(session => 
        new Date(session.date).toDateString() === dateString
      );
      const dayFocus = Math.round(daySessions.reduce((total, session) => total + (session.duration || 0), 0) / 60); // Convert to minutes
      
      last7Days.push({
        day: dayName,
        focus: dayFocus
      });
    }

    setStats({
      todayFocus: Math.round(todayFocus / 60), // Convert to minutes
      weeklyFocus: Math.round(weeklyFocus / 60), // Convert to minutes
      totalSessions: userStats.totalSessions,
      completedTasks,
      totalTasks,
      currentStreak: userStats.streak,
      totalFocusTime: userStats.totalFocusTime,
      averageSessionLength: userStats.averageSessionLength,
      thisWeekSessions: thisWeekSessions.length,
      completionRate
    });

    setDailyStats(last7Days);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* FIXED: PROMINENT CLOSE BUTTON AT TOP RIGHT */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            title="Close Analytics"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-between items-center mb-6 pr-12">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span>Analytics Dashboard</span>
          </h2>
        </div>

        <div className="space-y-8">
          {/* Today's Performance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <Calendar size={20} />
              <span>Today's Performance</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <Clock className="mx-auto mb-3 text-blue-600" size={32} />
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800">{stats.todayFocus}m</div>
                  <div className="text-blue-600 font-medium">Focus Time</div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <Target className="mx-auto mb-3 text-green-600" size={32} />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800">{stats.completedTasks}</div>
                  <div className="text-green-600 font-medium">Sessions</div>
                </div>
              </div>
            </div>
          </div>

          {/* This Week */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>This Week</span>
            </h3>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">{stats.weeklyFocus}m</div>
                  <div className="text-blue-100 font-medium">Total Focus Time</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{stats.thisWeekSessions}</div>
                  <div className="text-blue-100 font-medium">Sessions Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Activity Chart */}
          {dailyStats.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">7-Day Activity</h3>
              <div className="bg-white border rounded-xl p-6">
                <div className="flex items-end justify-between space-x-2 h-40">
                  {dailyStats.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex justify-center items-end h-32">
                        <div 
                          className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                          style={{
                            height: `${Math.max((day.focus / Math.max(...dailyStats.map(d => d.focus), 1)) * 100, 5)}%`
                          }}
                          title={`${day.focus} minutes`}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2 text-center">
                        <div className="font-medium">{day.day}</div>
                        <div className="text-blue-600 font-semibold">{day.focus}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Overall Stats Grid */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Overall Statistics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
                <Award className="mx-auto mb-2 text-purple-500" size={24} />
                <div className="text-2xl font-bold text-purple-600">{stats.totalSessions}</div>
                <div className="text-gray-600 text-sm">Total Sessions</div>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                <Zap className="mx-auto mb-2 text-orange-500" size={24} />
                <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                <div className="text-gray-600 text-sm">Current Streak</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <CheckCircle className="mx-auto mb-2 text-green-500" size={24} />
                <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                <div className="text-gray-600 text-sm">Tasks Done</div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
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

        {/* Bottom Action */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2 font-semibold"
          >
            <span>Continue Focusing</span>
          </button>
        </div>
      </div>
    </div>
  );
}