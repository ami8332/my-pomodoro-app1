import { createContext, useContext, useState, useEffect, useRef } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

// Simple audio management - NO LOOPING
let currentAlarmAudio = null;
let currentTickingAudio = null;

// Brief notification sound function (4-5 seconds to ensure user hears it)
const playBriefNotificationSound = async () => {
  try {
    // Get sound settings from localStorage
    const savedSounds = localStorage.getItem('timefocus-sound-settings');
    const soundSettings = savedSounds ? JSON.parse(savedSounds) : {
      alarmSound: 'bell',
      alarmVolume: 50,
      enabled: true
    };

    if (!soundSettings.enabled || soundSettings.alarmSound === 'none') {
      console.log('🔔 Timer completed! (Sound disabled)');
      return;
    }

    // Sound file mapping
    const alarmSounds = {
      'bell': '/sounds/bell.mp3',
      'kitchen': '/sounds/kitchen.mp3',
      'burp': '/sounds/Burp.mp3',
      'winter': '/sounds/winter.mp3'
    };

    const soundFile = alarmSounds[soundSettings.alarmSound];
    if (soundFile) {
      // Stop any currently playing alarm
      if (currentAlarmAudio) {
        currentAlarmAudio.pause();
        currentAlarmAudio.currentTime = 0;
      }
      
      const encodedSoundFile = encodeURI(soundFile);
      console.log('Playing alarm sound for 5 seconds:', soundFile);
      
      currentAlarmAudio = new Audio(encodedSoundFile);
      currentAlarmAudio.volume = soundSettings.alarmVolume / 100;
      currentAlarmAudio.loop = true; // Loop to ensure it plays for full 5 seconds
      
      currentAlarmAudio.addEventListener('error', (e) => {
        console.error('Alarm audio error:', e);
      });
      
      // Play sound for 5 seconds
      await currentAlarmAudio.play();
      
      // Stop alarm after 5 seconds maximum
      setTimeout(() => {
        if (currentAlarmAudio) {
          currentAlarmAudio.pause();
          currentAlarmAudio.currentTime = 0;
          currentAlarmAudio = null;
        }
      }, 5000); // 5 seconds
      
      console.log('🔔 Alarm will play for 5 seconds!');
    } else {
      console.log('🔔 Timer completed! (Sound file not found)');
    }
  } catch (error) {
    console.log('🔔 Timer completed! (Sound not available)', error);
  }
};

// Enhanced ticking sound management
const playTickingSound = async () => {
  try {
    const savedSounds = localStorage.getItem('timefocus-sound-settings');
    const soundSettings = savedSounds ? JSON.parse(savedSounds) : {
      tickingSound: 'classic',
      tickingVolume: 30,
      enabled: true
    };

    if (!soundSettings.enabled || soundSettings.tickingSound === 'none') {
      return;
    }

    // Sound file mapping for ticking
    const tickingSounds = {
      'classic': '/sounds/Ticking Sounds/tick.mp3',
      'soft': '/sounds/Ticking Sounds/soft-tick.mp3',
      'mechanical': '/sounds/Ticking Sounds/mechanical.mp3'
    };

    const soundFile = tickingSounds[soundSettings.tickingSound];
    if (soundFile) {
      // Stop any current ticking
      stopTickingSound();
      
      const encodedSoundFile = encodeURI(soundFile);
      currentTickingAudio = new Audio(encodedSoundFile);
      currentTickingAudio.volume = soundSettings.tickingVolume / 100;
      currentTickingAudio.loop = true; // Loop ticking sound
      
      currentTickingAudio.addEventListener('error', (e) => {
        console.error('Ticking audio error:', e);
      });
      
      await currentTickingAudio.play();
      console.log('Playing ticking sound:', soundFile);
    }
  } catch (error) {
    console.log('Could not play ticking sound:', error);
  }
};

const stopTickingSound = () => {
  if (currentTickingAudio) {
    currentTickingAudio.pause();
    currentTickingAudio.currentTime = 0;
    currentTickingAudio = null;
  }
};

const stopAllSounds = () => {
  if (currentAlarmAudio) {
    currentAlarmAudio.pause();
    currentAlarmAudio.currentTime = 0;
    currentAlarmAudio = null;
  }
  stopTickingSound();
};

const triggerVibration = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    // Brief vibration pattern
    navigator.vibrate([200, 100, 200]);
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
  
  // Keep only last 100 sessions
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
    focusTime: 0,
    breakTime: 0,
    tasksCompleted: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    createdAt: new Date().toISOString()
  };

  switch(type) {
    case 'session':
      stats.totalSessions += value;
      break;
    case 'focusTime':
      stats.focusTime += value;
      break;
    case 'breakTime':
      stats.breakTime += value;
      break;
    case 'taskCompleted':
      stats.tasksCompleted += value;
      break;
  }

  localStorage.setItem('timefocus-user-stats', JSON.stringify(stats));
  return stats;
};

// Function to update streak
const updateStreak = () => {
  if (typeof window === 'undefined') return;
  
  const savedStats = localStorage.getItem('timefocus-user-stats');
  let stats = savedStats ? JSON.parse(savedStats) : {
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: null
  };

  const today = new Date().toDateString();
  const lastActiveDate = stats.lastActiveDate ? new Date(stats.lastActiveDate).toDateString() : null;

  if (lastActiveDate === today) {
    // Already active today, don't change streak
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();

  if (lastActiveDate === yesterdayString) {
    // Continuing streak
    stats.currentStreak += 1;
  } else {
    // New streak
    stats.currentStreak = 1;
  }

  // Update best streak
  if (stats.currentStreak > stats.bestStreak) {
    stats.bestStreak = stats.currentStreak;
  }

  stats.lastActiveDate = new Date().toISOString();
  localStorage.setItem('timefocus-user-stats', JSON.stringify(stats));
  return stats;
};

export function TimerProvider({ children }) {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentSessionNumber, setCurrentSessionNumber] = useState(1);
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

  // Cleanup sounds when component unmounts
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, []);

  const getTimerDuration = (currentMode) => {
    switch(currentMode) {
      case 'focus': return settings.focusTime * 60;
      case 'shortBreak': return settings.shortBreakTime * 60;
      case 'longBreak': return settings.longBreakTime * 60;
      default: return 25 * 60;
    }
  };

  // Update saved times when settings change
  useEffect(() => {
    const newSavedTimes = {
      focus: settings.focusTime * 60,
      shortBreak: settings.shortBreakTime * 60,
      longBreak: settings.longBreakTime * 60
    };
    setSavedTimes(newSavedTimes);
    
    // Update current timer immediately if not running
    if (!isRunning) {
      setTimeLeft(newSavedTimes[mode]);
    }
  }, [settings, mode, isRunning]);

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

  const handleTimerComplete = async () => {
    setIsRunning(false);
    setSessionCompleted(true);
    
    // Stop ticking sound when timer completes
    stopTickingSound();
    
    // Get notification settings
    const notificationSettings = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('timefocus-notifications') || '{"enabled": true, "sound": true, "vibration": true, "desktop": true}')
      : { enabled: true, sound: true, vibration: true, desktop: true };
    
    if (notificationSettings.enabled) {
      // Play BRIEF sound if enabled (1-2 seconds only)
      if (settings.soundEnabled && notificationSettings.sound) {
        await playBriefNotificationSound();
      }
      
      // Trigger brief vibration if enabled and available
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
    } else {
      // Update stats for break sessions
      updateUserStats('breakTime', actualDuration);
    }

    // AUTOMATIC SWITCH after alarm finishes (5 seconds)
    setTimeout(() => {
      autoSwitchToNextMode();
    }, 5000);

    // Clear session completion after 10 seconds
    setTimeout(() => {
      setSessionCompleted(false);
    }, 10000);
  };

  // New function for automatic mode switching
  const autoSwitchToNextMode = () => {
    // Stop any playing alarm when switching modes
    stopAllSounds();
    
    if (mode === 'focus') {
      // Determine if it's time for long break based on user settings
      const nextMode = (completedSessions + 1) % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      changeMode(nextMode);
    } else {
      // From any break back to focus
      changeMode('focus');
    }
  };

  const toggleTimer = async () => {
    if (isRunning) {
      // Pausing timer
      setIsRunning(false);
      stopTickingSound();
    } else {
      // Starting timer
      setIsRunning(true);
      setSessionCompleted(false);
      
      // Start ticking sound if enabled and in focus mode
      if (mode === 'focus') {
        await playTickingSound();
      }
    }
  };

  const startTimer = async () => {
    setIsRunning(true);
    setSessionCompleted(false);
    
    // Start ticking sound if enabled and in focus mode
    if (mode === 'focus') {
      await playTickingSound();
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    stopTickingSound();
  };

  const resetTimer = () => {
    setIsRunning(false);
    stopAllSounds();
    setSessionCompleted(false);
    setSessionStartTime(null);
    
    const newTime = getTimerDuration(mode);
    setTimeLeft(newTime);
    setSavedTimes(prev => ({
      ...prev,
      [mode]: newTime
    }));
  };

  const changeMode = async (newMode) => {
    setIsRunning(false);
    stopAllSounds();
    setMode(newMode);
    setSessionCompleted(false);
    setSessionStartTime(null);
    
    const newTime = savedTimes[newMode] || getTimerDuration(newMode);
    setTimeLeft(newTime);
  };

  const skipTimer = () => {
    // Simply complete the current timer
    handleTimerComplete();
  };

  // Apply settings changes immediately
  const updateSettings = (newSettings) => {
    const updatedSettings = {
      ...settings,
      ...newSettings
    };
    
    setSettings(updatedSettings);

    // Update timer durations immediately
    const newSavedTimes = {
      focus: updatedSettings.focusTime * 60,
      shortBreak: updatedSettings.shortBreakTime * 60,
      longBreak: updatedSettings.longBreakTime * 60
    };
    
    setSavedTimes(newSavedTimes);
    
    // Update current timer immediately if not running
    if (!isRunning) {
      setTimeLeft(newSavedTimes[mode]);
    }
  };

  return (
    <TimerContext.Provider value={{
      mode,
      timeLeft,
      isRunning,
      sessionCompleted,
      completedSessions,
      currentSessionNumber,
      settings,
      toggleTimer,
      startTimer,
      pauseTimer,
      resetTimer,
      changeMode,
      skipTimer,
      updateSettings
    }}>
      {children}
    </TimerContext.Provider>
  );
}