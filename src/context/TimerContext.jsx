// ملف TimerContext.jsx - الإصلاح النهائي

import { createContext, useContext, useState, useEffect, useRef } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

// Audio management
let currentAlarmAudio = null;
let currentTickingAudio = null;

const playBriefNotificationSound = async () => {
  try {
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

    const alarmSounds = {
      'bell': '/sounds/bell.mp3',
      'kitchen': '/sounds/kitchen.mp3',
      'winter': '/sounds/winter.mp3'
    };

    const soundFile = alarmSounds[soundSettings.alarmSound];
    if (soundFile) {
      if (currentAlarmAudio) {
        currentAlarmAudio.pause();
        currentAlarmAudio.currentTime = 0;
      }
      
      currentAlarmAudio = new Audio(soundFile);
      currentAlarmAudio.volume = soundSettings.alarmVolume / 100;
      
      await currentAlarmAudio.play();
      
      setTimeout(() => {
        if (currentAlarmAudio) {
          currentAlarmAudio.pause();
          currentAlarmAudio.currentTime = 0;
          currentAlarmAudio = null;
        }
      }, 4000);
      
      console.log('🔔 Alarm played!');
    }
  } catch (error) {
    console.log('🔔 Timer completed! (Sound error)', error);
  }
};

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

    const tickingSounds = {
      'metronome': '/Ticking Sounds/Metronome.mp3',
      'soft': '/Ticking Sounds/soft-tick.mp3',
      'tick': '/Ticking Sounds/tick.mp3',
      'clock': '/Ticking Sounds/clock.mp3'
    };

    const soundFile = tickingSounds[soundSettings.tickingSound];
    if (soundFile) {
      stopTickingSound();
      
      currentTickingAudio = new Audio(soundFile);
      currentTickingAudio.volume = soundSettings.tickingVolume / 100;
      currentTickingAudio.loop = true;
      
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

export function TimerProvider({ children }) {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentSessionNumber, setCurrentSessionNumber] = useState(1);
  
  // 🔥 CRITICAL: Use ref to store interval ID
  const intervalRef = useRef(null);
  
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
  });

  // Load settings and session data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Load settings
        const savedSettings = localStorage.getItem('timefocus-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
        }

        // Load session data
        const savedSession = localStorage.getItem('timefocus-current-session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          
          // Restore session state
          if (session.mode) setMode(session.mode);
          if (session.timeLeft !== undefined) setTimeLeft(session.timeLeft);
          if (session.completedSessions) setCompletedSessions(session.completedSessions);
          if (session.currentSessionNumber) setCurrentSessionNumber(session.currentSessionNumber);
          
          console.log('📖 Restored session:', session);
        } else {
          // Initialize with focus time from settings
          const focusTime = savedSettings ? JSON.parse(savedSettings).focusTime : 25;
          setTimeLeft(focusTime * 60);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timefocus-settings', JSON.stringify(settings));
    }
  }, [settings]);

  // 🔥 CRITICAL: Save session data whenever relevant state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionData = {
        mode,
        timeLeft,
        completedSessions,
        currentSessionNumber,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('timefocus-current-session', JSON.stringify(sessionData));
      console.log('💾 Saved session state:', sessionData);
    }
  }, [mode, timeLeft, completedSessions, currentSessionNumber]);

  // 🔥 CRITICAL: The main timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      console.log('⏰ Starting timer countdown from:', timeLeft);
      
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          console.log('⏳ Timer tick:', prev - 1);
          
          if (prev <= 1) {
            console.log('✅ Timer completed!');
            // Timer completed
            setIsRunning(false);
            setSessionCompleted(true);
            stopTickingSound();
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear interval when not running
      if (intervalRef.current) {
        console.log('⏹️ Clearing timer interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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

  const handleTimerComplete = async () => {
    console.log('🎉 Timer session completed!');
    
    // Play completion sound
    await playBriefNotificationSound();
    
    // Show browser notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const messages = {
        focus: 'Focus session completed! Time for a break.',
        shortBreak: 'Break finished! Ready to focus again?',
        longBreak: 'Long break finished! Time to get back to work!'
      };
      
      new Notification('TimeFocus', {
        body: messages[mode],
        icon: '/favicon.ico'
      });
    }

    // Update stats
    if (mode === 'focus') {
      setCompletedSessions(prev => prev + 1);
      updateUserStats('session', 1);
      updateUserStats('focusTime', settings.focusTime);
    } else {
      updateUserStats('breakTime', mode === 'longBreak' ? settings.longBreakTime : settings.shortBreakTime);
    }
  };

  // 🔥 FIXED: The main toggleTimer function
  const toggleTimer = async () => {
    if (isRunning) {
      console.log('⏸️ PAUSING timer at:', timeLeft, 'seconds');
      // Pausing - just stop the timer, keep the time
      setIsRunning(false);
      stopTickingSound();
      
      // The time is automatically saved by the useEffect above
    } else {
      console.log('▶️ STARTING timer from:', timeLeft, 'seconds');
      // Starting/resuming - start from current timeLeft
      setIsRunning(true);
      setSessionCompleted(false);
      
      // Start ticking sound if enabled and in focus mode
      if (mode === 'focus') {
        await playTickingSound();
      }
    }
  };

  const resetTimer = () => {
    console.log('🔄 RESETTING timer');
    setIsRunning(false);
    stopAllSounds();
    setSessionCompleted(false);
    
    const newTime = getTimerDuration(mode);
    setTimeLeft(newTime);
    
    console.log('🔄 Timer reset to:', newTime, 'seconds');
  };

  const changeMode = async (newMode) => {
    console.log('🔄 Changing mode from', mode, 'to', newMode);
    
    setIsRunning(false);
    stopAllSounds();
    setMode(newMode);
    setSessionCompleted(false);
    
    const newTime = getTimerDuration(newMode);
    setTimeLeft(newTime);
    
    console.log('🔄 Mode changed. New time:', newTime, 'seconds');
  };

  const skipTimer = () => {
    console.log('⏭️ Skipping timer');
    setTimeLeft(0);
    handleTimerComplete();
  };

  const updateSettings = (newSettings) => {
    console.log('⚙️ Updating settings:', newSettings);
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Update current timer if not running
    if (!isRunning) {
      const newTime = getTimerDuration(mode);
      setTimeLeft(newTime);
      console.log('⚙️ Settings updated. New timer duration:', newTime);
    }
  };

  // Helper function to complete a task
  const completeTask = () => {
    updateUserStats('taskCompleted', 1);
  };

  // Update user stats helper
  const updateUserStats = (type, value = 1) => {
    if (typeof window === 'undefined') return;
    
    const savedStats = localStorage.getItem('timefocus-user-stats');
    let stats = savedStats ? JSON.parse(savedStats) : {
      totalSessions: 0,
      focusTime: 0,
      breakTime: 0,
      tasksCompleted: 0,
      lastActiveDate: null
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

    stats.lastActiveDate = new Date().toISOString();
    localStorage.setItem('timefocus-user-stats', JSON.stringify(stats));
    console.log('📊 Stats updated:', type, value);
    return stats;
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
      resetTimer,
      changeMode,
      skipTimer,
      updateSettings,
      completeTask
    }}>
      {children}
    </TimerContext.Provider>
  );
}