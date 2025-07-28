import { createContext, useContext, useState, useEffect, useRef } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

// Simple audio management
let currentAlarmAudio = null;
let currentTickingAudio = null;

// Enhanced notification sound function
const playNotificationSound = async () => {
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
      
      // Try to encode URL properly for files with spaces  
      const encodedSoundFile = encodeURI(soundFile);
      console.log('Playing alarm sound:', soundFile);
      console.log('Encoded path:', encodedSoundFile);
      
      currentAlarmAudio = new Audio(encodedSoundFile);
      currentAlarmAudio.volume = soundSettings.alarmVolume / 100;
      
      currentAlarmAudio.addEventListener('error', (e) => {
        console.error('Alarm audio error:', e);
        console.error('Tried to load:', soundFile);
        console.error('Encoded path was:', encodedSoundFile);
      });
      
      await currentAlarmAudio.play();
      console.log('🔔 Timer completed! Playing sound:', soundFile);
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
      tickingSound: 'none',
      tickingVolume: 30,
      enabled: true
    };

    if (!soundSettings.enabled || soundSettings.tickingSound === 'none') {
      return;
    }

    // Ticking sound file mapping
    const tickingSounds = {
      'clock': '/Ticking Sounds/Clock Tick.mp3',
      'metronome': '/Ticking Sounds/Metronome.mp3',
      'soft': '/Ticking Sounds/soft-tick.mp3',
      'calm-storm': '/Ticking Sounds/Calm Storm.mp3',
      'tick': '/Ticking Sounds/tick.mp3',
      'tik-tock': '/Ticking Sounds/Tik Tock.mp3'
    };

    const soundFile = tickingSounds[soundSettings.tickingSound];
    if (soundFile) {
      // Stop any currently playing ticking
      if (currentTickingAudio) {
        currentTickingAudio.pause();
        currentTickingAudio.currentTime = 0;
      }
      
      // Try to encode URL properly for files with spaces
      const encodedSoundFile = encodeURI(soundFile);
      console.log('Playing ticking sound:', soundFile);
      console.log('Encoded path:', encodedSoundFile);
      
      currentTickingAudio = new Audio(encodedSoundFile);
      currentTickingAudio.volume = soundSettings.tickingVolume / 100;
      currentTickingAudio.loop = true;
      
      currentTickingAudio.addEventListener('error', (e) => {
        console.error('Ticking audio error:', e);
        console.error('Tried to load:', soundFile);
        console.error('Encoded path was:', encodedSoundFile);
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
  if (currentTickingAudio) {
    currentTickingAudio.pause();
    currentTickingAudio.currentTime = 0;
    currentTickingAudio = null;
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
    currentStreak: 0,
    bestStreak: 0,
    lastSessionDate: null,
    achievements: [],
    totalBreakTime: 0,
    averageSessionLength: 0
  };

  switch(type) {
    case 'session':
      stats.totalSessions += value;
      break;
    case 'focusTime':
      stats.totalFocusTime += value;
      break;
    case 'breakTime':
      stats.totalBreakTime += value;
      break;
  }

  // Update average session length
  if (stats.totalSessions > 0) {
    stats.averageSessionLength = Math.round(stats.totalFocusTime / stats.totalSessions);
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
    lastSessionDate: null
  };

  const today = new Date().toDateString();
  const lastSession = stats.lastSessionDate ? new Date(stats.lastSessionDate).toDateString() : null;
  
  if (lastSession === today) {
    // Same day, don't increment streak
    return;
  } else if (lastSession === new Date(Date.now() - 86400000).toDateString()) {
    // Yesterday, increment streak
    stats.currentStreak += 1;
  } else {
    // Missed days, reset streak
    stats.currentStreak = 1;
  }

  // Update best streak
  if (stats.currentStreak > stats.bestStreak) {
    stats.bestStreak = stats.currentStreak;
  }

  stats.lastSessionDate = new Date().toISOString();
  localStorage.setItem('timefocus-user-stats', JSON.stringify(stats));
};

export function TimerProvider({ children }) {
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
      // Play sound if enabled
      if (settings.soundEnabled && notificationSettings.sound) {
        await playNotificationSound();
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
      
      const nextMode = (completedSessions + 1) % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      
      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        setTimeout(() => {
          changeMode(nextMode);
          startTimer();
        }, 3000);
      }
    } else {
      // Update stats for break sessions
      updateUserStats('breakTime', actualDuration);
      
      // Auto-start focus session if enabled
      if (settings.autoStartPomodoros) {
        setTimeout(() => {
          changeMode('focus');
          startTimer();
        }, 3000);
      }
    }

    // Clear session completion after 5 seconds
    setTimeout(() => {
      setSessionCompleted(false);
    }, 5000);
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
    stopAllSounds(); // Stop all sounds
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
    stopAllSounds(); // Stop all sounds
    setMode(newMode);
    setSessionCompleted(false);
    setSessionStartTime(null);
    
    const newTime = savedTimes[newMode] || getTimerDuration(newMode);
    setTimeLeft(newTime);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));

    // Update timer durations if changed
    const focusChanged = newSettings.focusTime && newSettings.focusTime !== settings.focusTime;
    const shortBreakChanged = newSettings.shortBreakTime && newSettings.shortBreakTime !== settings.shortBreakTime;
    const longBreakChanged = newSettings.longBreakTime && newSettings.longBreakTime !== settings.longBreakTime;

    if (focusChanged || shortBreakChanged || longBreakChanged) {
      const updatedTimes = {
        focus: (newSettings.focusTime || settings.focusTime) * 60,
        shortBreak: (newSettings.shortBreakTime || settings.shortBreakTime) * 60,
        longBreak: (newSettings.longBreakTime || settings.longBreakTime) * 60
      };
      
      setSavedTimes(updatedTimes);
      
      // Update current timer if not running
      if (!isRunning) {
        setTimeLeft(updatedTimes[mode]);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = getTimerDuration(mode);
    return ((total - timeLeft) / total) * 100;
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
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    updateSettings,
    formatTime,
    getProgress,
    getTimerDuration
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}