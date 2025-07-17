import { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/bell.mp3');
    audio.volume = 0.6;
    audio.play();
  } catch (error) {
    console.log('🔔 Timer completed! (Sound not available)');
  }
};

const triggerVibration = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    // Vibration pattern: [vibrate, pause, vibrate, pause, vibrate]
    navigator.vibrate([200, 100, 200, 100, 200]);
  }
};

const showDesktopNotification = (title, body, icon = '/favicon.ico') => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon,
      badge: '/favicon.ico',
      tag: 'timefocus-notification',
      renotify: true,
      requireInteraction: false
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Focus window when notification is clicked
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

// Function to save session to history
const saveSessionToHistory = (mode, duration, startTime) => {
  if (typeof window === 'undefined') return;
  
  const sessionHistory = JSON.parse(localStorage.getItem('timefocus-session-history') || '[]');
  
  const session = {
    id: Date.now(),
    mode,
    duration, // in seconds
    startTime,
    endTime: new Date().toISOString(),
    date: new Date().toISOString()
  };
  
  sessionHistory.push(session);
  
  // Keep only last 100 sessions to avoid storage bloat
  if (sessionHistory.length > 100) {
    sessionHistory.shift();
  }
  
  localStorage.setItem('timefocus-session-history', JSON.stringify(sessionHistory));
  return session;
};

// Function to update user stats
const updateUserStats = (type, value = 1) => {
  if (typeof window === 'undefined') return;
  
  const savedStats = localStorage.getItem('timefocus-user-stats');
  let stats = savedStats ? JSON.parse(savedStats) : {
    totalSessions: 0,
    totalFocusTime: 0,
    streak: 0,
    tasksCompleted: 0,
    averageSessionLength: 0,
    joinDate: new Date().toISOString(),
    lastSessionDate: null
  };

  switch(type) {
    case 'session':
      stats.totalSessions += value;
      stats.lastSessionDate = new Date().toDateString();
      break;
    case 'focusTime':
      stats.totalFocusTime += value;
      // Update average session length
      if (stats.totalSessions > 0) {
        stats.averageSessionLength = stats.totalFocusTime / stats.totalSessions;
      }
      break;
    case 'task':
      stats.tasksCompleted += value;
      break;
    case 'streak':
      stats.streak = value;
      break;
  }

  localStorage.setItem('timefocus-user-stats', JSON.stringify(stats));
  return stats;
};

// Function to calculate and update streak
const updateStreak = () => {
  if (typeof window === 'undefined') return 0;
  
  const savedStats = localStorage.getItem('timefocus-user-stats');
  let stats = savedStats ? JSON.parse(savedStats) : {
    totalSessions: 0,
    totalFocusTime: 0,
    streak: 0,
    tasksCompleted: 0,
    averageSessionLength: 0,
    joinDate: new Date().toISOString(),
    lastSessionDate: null
  };

  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  // Check if user had a session today
  const sessionHistory = JSON.parse(localStorage.getItem('timefocus-session-history') || '[]');
  const todaySessions = sessionHistory.filter(session => 
    new Date(session.date).toDateString() === today && session.mode === 'focus'
  );

  if (todaySessions.length > 0) {
    // User completed a focus session today
    if (stats.lastSessionDate === yesterdayStr) {
      // Consecutive day - increment streak
      stats.streak += 1;
    } else if (stats.lastSessionDate !== today) {
      // First session today, start new streak
      stats.streak = 1;
    }
    // If lastSessionDate is today, streak remains the same
  }

  stats.lastSessionDate = today;
  localStorage.setItem('timefocus-user-stats', JSON.stringify(stats));
  return stats.streak;
};

export const TimerProvider = ({ children }) => {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentSessionNumber, setCurrentSessionNumber] = useState(1);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
  const [savedTimes, setSavedTimes] = useState({
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  });

  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('timefocus-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timefocus-settings', JSON.stringify(settings));
    }
  }, [settings]);

  const getTimerDuration = (currentMode) => {
    switch(currentMode) {
      case 'focus': return settings.focusTime * 60;
      case 'shortBreak': return settings.shortBreakTime * 60;
      case 'longBreak': return settings.longBreakTime * 60;
      default: return 25 * 60;
    }
  };

  useEffect(() => {
    setSavedTimes({
      focus: settings.focusTime * 60,
      shortBreak: settings.shortBreakTime * 60,
      longBreak: settings.longBreakTime * 60
    });
  }, [settings]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      // Set session start time when timer starts
      if (!sessionStartTime) {
        setSessionStartTime(new Date().toISOString());
      }
      
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          setSavedTimes(prev => ({
            ...prev,
            [mode]: newTime
          }));
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && !sessionCompleted) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, sessionCompleted, sessionStartTime]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setSessionCompleted(true);
    
    // Get notification settings
    const notificationSettings = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('timefocus-notifications') || '{"enabled": true, "sound": true, "vibration": true, "desktop": true}')
      : { enabled: true, sound: true, vibration: true, desktop: true };
    
    if (notificationSettings.enabled) {
      // Play sound if enabled
      if (settings.soundEnabled && notificationSettings.sound) {
        playNotificationSound();
      }
      
      // Trigger vibration if enabled and available
      if (notificationSettings.vibration) {
        triggerVibration();
      }
      
      // Show desktop notification if enabled
      if (notificationSettings.desktop) {
        let notificationTitle, notificationBody;
        
        if (mode === 'focus') {
          notificationTitle = '🎯 Focus Session Complete!';
          notificationBody = `Great job! You focused for ${settings.focusTime} minutes. Time for a break!`;
        } else if (mode === 'shortBreak') {
          notificationTitle = '☕ Short Break Over!';
          notificationBody = 'Break time is over. Ready to get back to work?';
        } else if (mode === 'longBreak') {
          notificationTitle = '🌟 Long Break Complete!';
          notificationBody = 'You\'re fully recharged! Time for productive work!';
        }
        
        showDesktopNotification(notificationTitle, notificationBody);
      }
    }
    
    // Calculate session duration
    const fullDuration = getTimerDuration(mode);
    const actualDuration = fullDuration; // For completed sessions
    
    // Save session to history
    if (sessionStartTime) {
      saveSessionToHistory(mode, actualDuration, sessionStartTime);
    }
    
    if (mode === 'focus') {
      setCompletedSessions(prev => prev + 1);
      setCurrentSessionNumber(prev => prev + 1);
      
      // Update user stats for completed focus session
      updateUserStats('session', 1);
      updateUserStats('focusTime', actualDuration);
      
      // Update streak
      updateStreak();
      
      const nextMode = (completedSessions + 1) % settings.longBreakInterval === 0 ?
        'longBreak' : 'shortBreak';
      
      setSavedTimes(prev => ({
        focus: getTimerDuration('focus'),
        shortBreak: getTimerDuration('shortBreak'),
        longBreak: getTimerDuration('longBreak')
      }));
      
      if (settings.autoStartBreaks) {
        setTimeout(() => {
          setMode(nextMode);
          setTimeLeft(getTimerDuration(nextMode));
          setSessionCompleted(false);
          setSessionStartTime(null);
          setIsRunning(true);
        }, 2000);
      } else {
        setTimeout(() => {
          setMode(nextMode);
          setTimeLeft(getTimerDuration(nextMode));
          setSessionCompleted(false);
          setSessionStartTime(null);
        }, 1000);
      }
    } else {
      // Break completed
      setSavedTimes(prev => ({
        ...prev,
        focus: getTimerDuration('focus')
      }));
      
      if (settings.autoStartPomodoros) {
        setTimeout(() => {
          setMode('focus');
          setTimeLeft(getTimerDuration('focus'));
          setSessionCompleted(false);
          setSessionStartTime(null);
          setIsRunning(true);
        }, 2000);
      } else {
        setTimeout(() => {
          setMode('focus');
          setTimeLeft(getTimerDuration('focus'));
          setSessionCompleted(false);
          setSessionStartTime(null);
        }, 1000);
      }
    }
  };

  const toggleTimer = () => {
    if (!isRunning && !sessionStartTime) {
      setSessionStartTime(new Date().toISOString());
    }
    setIsRunning(!isRunning);
  };

  const skipTimer = () => {
    setTimeLeft(0);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const fullDuration = getTimerDuration(mode);
    setTimeLeft(fullDuration);
    setSavedTimes(prev => ({
      ...prev,
      [mode]: fullDuration
    }));
    setSessionCompleted(false);
    setSessionStartTime(null);
  };

  const changeMode = (newMode) => {
    setSavedTimes(prev => ({
      ...prev,
      [mode]: timeLeft
    }));
    
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(savedTimes[newMode]);
    setSessionCompleted(false);
    setSessionStartTime(null);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    
    const newSavedTimes = {
      focus: newSettings.focusTime * 60,
      shortBreak: newSettings.shortBreakTime * 60,
      longBreak: newSettings.longBreakTime * 60
    };
    
    setSavedTimes(newSavedTimes);
    setTimeLeft(newSavedTimes[mode]);
  };

  // Function to update task completion stats
  const completeTask = () => {
    updateUserStats('task', 1);
  };

  const value = {
    mode,
    timeLeft,
    isRunning,
    completedSessions,
    currentSessionNumber,
    sessionCompleted,
    settings,
    toggleTimer,
    skipTimer,
    resetTimer,
    changeMode,
    updateSettings,
    completeTask,
    getTimerDuration
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};