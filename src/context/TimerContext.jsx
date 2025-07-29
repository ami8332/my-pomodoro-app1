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
  const [timeLeft, setTimeLeft] = useState(null); // 🔥 FIX: null بدلاً من 25 * 60
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentSessionNumber, setCurrentSessionNumber] = useState(1);
  const [settingsLoaded, setSettingsLoaded] = useState(false); // 🔥 FIX: track settings loading
  
  const [pausedAt, setPausedAt] = useState(null);
  const [wasRunningBeforeClose, setWasRunningBeforeClose] = useState(false);
  
  const intervalRef = useRef(null);
  
  // 🔥 FIX: Default settings - سيتم تحديثها من localStorage
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
  });

  const getTimerDuration = (currentMode) => {
    switch(currentMode) {
      case 'focus': return settings.focusTime * 60;
      case 'shortBreak': return settings.shortBreakTime * 60;
      case 'longBreak': return settings.longBreakTime * 60;
      default: return 25 * 60;
    }
  };

  // 🔥 FIX: Load settings and session on mount - يجب أن يحدث قبل تعيين timeLeft
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Load settings FIRST
        const savedSettings = localStorage.getItem('timefocus-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          console.log('📖 Settings loaded:', parsed);
          
          // Set initial timeLeft based on loaded settings
          const initialTime = parsed.focusTime * 60;
          setTimeLeft(initialTime);
          console.log('⏰ Initial timer set to:', parsed.focusTime, 'minutes =', initialTime, 'seconds');
        } else {
          // No saved settings, use defaults
          const defaultTime = 25 * 60;
          setTimeLeft(defaultTime);
          console.log('⏰ Using default timer:', defaultTime, 'seconds');
        }
        
        setSettingsLoaded(true);
        
        // Try to load saved session AFTER settings are loaded
        const savedSession = localStorage.getItem('timefocus-active-session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          console.log('📖 Loading saved session:', session);
          
          const lastSaved = new Date(session.lastSaved);
          const now = new Date();
          const hoursDiff = (now - lastSaved) / (1000 * 60 * 60);
          
          if (hoursDiff <= 24) {
            setMode(session.mode || 'focus');
            setTimeLeft(session.timeLeft || getTimerDuration(session.mode || 'focus'));
            setCompletedSessions(session.completedSessions || 0);
            setCurrentSessionNumber(session.currentSessionNumber || 1);
            setSessionCompleted(session.sessionCompleted || false);
            setWasRunningBeforeClose(session.wasRunningBeforeClose || false);
            setPausedAt(session.pausedAt);
            
            console.log('✅ Session restored successfully!');
            showSessionRestoreNotification(session);
          } else {
            console.log('🗑️ Session too old, starting fresh');
            localStorage.removeItem('timefocus-active-session');
          }
        }
      } catch (error) {
        console.error('❌ Error during initialization:', error);
        // Fallback to defaults
        setTimeLeft(25 * 60);
        setSettingsLoaded(true);
      }
    }
  }, []);

  // 🔥 FIX: Update timeLeft when settings change (only if not running)
  useEffect(() => {
    if (settingsLoaded && !isRunning && timeLeft !== null) {
      const newTime = getTimerDuration(mode);
      setTimeLeft(newTime);
      console.log('⚙️ Settings updated, timer reset to:', settings[mode === 'focus' ? 'focusTime' : mode === 'shortBreak' ? 'shortBreakTime' : 'longBreakTime'], 'minutes');
    }
  }, [settings, mode, settingsLoaded, isRunning]);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    if (typeof window !== 'undefined' && settingsLoaded) {
      localStorage.setItem('timefocus-settings', JSON.stringify(settings));
      console.log('💾 Settings saved:', settings);
    }
  }, [settings, settingsLoaded]);

  const saveSessionState = (additionalData = {}) => {
    if (typeof window === 'undefined') return;
    
    const sessionData = {
      mode,
      timeLeft,
      isRunning,
      wasRunningBeforeClose: isRunning,
      pausedAt: isRunning ? null : new Date().toISOString(),
      completedSessions,
      currentSessionNumber,
      sessionCompleted,
      lastSaved: new Date().toISOString(),
      ...additionalData
    };
    
    localStorage.setItem('timefocus-active-session', JSON.stringify(sessionData));
    console.log('💾 Session saved:', sessionData);
  };

  const showSessionRestoreNotification = (session) => {
    const minutes = Math.floor(session.timeLeft / 60);
    const seconds = session.timeLeft % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const message = session.wasRunningBeforeClose 
      ? `⏰ Session restored! Timer was running, paused at ${timeStr}`
      : `📖 Session restored! Timer was paused at ${timeStr}`;
    
    showToast(message, 'info', 5000);
  };

  const showToast = (message, type = 'success', duration = 3000) => {
    const colors = {
      success: 'from-green-500 to-emerald-600',
      info: 'from-blue-500 to-indigo-600',
      warning: 'from-yellow-500 to-orange-600'
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, ${colors[type] || colors.success});
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      backdrop-filter: blur(10px);
      max-width: 320px;
      font-family: system-ui, -apple-system, sans-serif;
      animation: slideInRight 0.3s ease-out;
    `;
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (style.parentNode) style.parentNode.removeChild(style);
      }, 300);
    }, duration);
  };

  // Save session state when important values change
  useEffect(() => {
    if (settingsLoaded) {
      saveSessionState();
    }
  }, [mode, timeLeft, completedSessions, currentSessionNumber, sessionCompleted, isRunning, settingsLoaded]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveSessionState({ 
        wasRunningBeforeClose: isRunning,
        pausedAt: isRunning ? null : new Date().toISOString()
      });
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveSessionState({
          wasRunningBeforeClose: isRunning,
          pausedAt: isRunning ? null : new Date().toISOString()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);

  // Main timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      console.log('⏰ Starting timer countdown from:', timeLeft);
      
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          
          if (newTime <= 0) {
            console.log('✅ Timer completed!');
            setIsRunning(false);
            setSessionCompleted(true);
            stopTickingSound();
            handleTimerComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    return () => {
      stopAllSounds();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleTimerComplete = async () => {
    console.log('🎉 Timer session completed!');
    
    localStorage.removeItem('timefocus-active-session');
    
    await playBriefNotificationSound();
    
    if (mode === 'focus') {
      const focusDurationMinutes = settings.focusTime;
      
      if (typeof window !== 'undefined' && window.addWorkTimeToActiveTask) {
        window.addWorkTimeToActiveTask(focusDurationMinutes);
        console.log(`🎯 Added ${focusDurationMinutes} minutes to active task`);
      }
      
      setCompletedSessions(prev => prev + 1);
      updateUserStats('session', 1);
      updateUserStats('focusTime', settings.focusTime);
      
      showToast(`🎉 Focus session completed! ${focusDurationMinutes} minutes logged to active task.`, 'success', 4000);
    } else {
      updateUserStats('breakTime', mode === 'longBreak' ? settings.longBreakTime : settings.shortBreakTime);
      
      const breakType = mode === 'longBreak' ? 'Long break' : 'Short break';
      showToast(`☕ ${breakType} completed! Ready to focus again?`, 'info', 3000);
    }

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const messages = {
        focus: `Focus session completed! ${settings.focusTime} minutes added to your active task.`,
        shortBreak: 'Break finished! Ready to focus again?',
        longBreak: 'Long break finished! Time to get back to work!'
      };
      
      new Notification('TimeFocus', {
        body: messages[mode],
        icon: '/favicon.ico'
      });
    }

    setTimeout(() => {
      if (settings.autoStartBreaks && mode === 'focus') {
        const nextMode = currentSessionNumber % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
        changeMode(nextMode);
      } else if (settings.autoStartPomodoros && mode !== 'focus') {
        changeMode('focus');
        if (mode === 'shortBreak' || mode === 'longBreak') {
          setCurrentSessionNumber(prev => prev + 1);
        }
      }
    }, 2000);
  };

  const toggleTimer = async () => {
    if (isRunning) {
      console.log('⏸️ PAUSING timer at:', timeLeft, 'seconds');
      setIsRunning(false);
      stopTickingSound();
      setPausedAt(new Date().toISOString());
      showToast('⏸️ Timer paused', 'info', 2000);
    } else {
      console.log('▶️ STARTING timer from:', timeLeft, 'seconds');
      setIsRunning(true);
      setSessionCompleted(false);
      setPausedAt(null);
      
      if (wasRunningBeforeClose) {
        showToast('▶️ Session resumed!', 'success', 2000);
        setWasRunningBeforeClose(false);
      }
      
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
    setPausedAt(null);
    setWasRunningBeforeClose(false);
    
    const newTime = getTimerDuration(mode);
    setTimeLeft(newTime);
    
    localStorage.removeItem('timefocus-active-session');
    showToast('🔄 Timer reset', 'info', 2000);
  };

  const changeMode = async (newMode) => {
    console.log('🔄 Changing mode from', mode, 'to', newMode);
    
    setIsRunning(false);
    stopAllSounds();
    setMode(newMode);
    setSessionCompleted(false);
    setPausedAt(null);
    setWasRunningBeforeClose(false);
    
    const newTime = getTimerDuration(newMode);
    setTimeLeft(newTime);
    
    const modeNames = {
      focus: 'Focus',
      shortBreak: 'Short Break',
      longBreak: 'Long Break'
    };
    
    showToast(`🔄 Switched to ${modeNames[newMode]}`, 'info', 2000);
  };

  const skipTimer = () => {
    console.log('⏭️ Skipping timer');
    setTimeLeft(0);
    localStorage.removeItem('timefocus-active-session');
    handleTimerComplete();
  };

  // 🔥 FIX: Update settings function - لا يعيد تعيين التايمر إذا كان يعمل
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Only reset timer if NOT running
    if (!isRunning) {
      const newTime = getTimerDuration(mode);
      setTimeLeft(newTime);
      console.log('⚙️ Settings updated, timer reset to:', newTime / 60, 'minutes');
    } else {
      console.log('⚙️ Settings updated, but timer is running - no reset');
    }
    
    showToast('⚙️ Settings saved', 'success', 2000);
  };

  const completeTask = () => {
    updateUserStats('taskCompleted', 1);
  };

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
    return stats;
  };

  // 🔥 FIX: Don't render until settings are loaded
  if (!settingsLoaded || timeLeft === null) {
    return (
      <TimerContext.Provider value={{
        mode: 'focus',
        timeLeft: 0,
        isRunning: false,
        sessionCompleted: false,
        completedSessions: 0,
        currentSessionNumber: 1,
        settings: settings,
        wasRunningBeforeClose: false,
        pausedAt: null,
        toggleTimer: () => {},
        resetTimer: () => {},
        changeMode: () => {},
        skipTimer: () => {},
        updateSettings: () => {},
        completeTask: () => {}
      }}>
        {children}
      </TimerContext.Provider>
    );
  }

  return (
    <TimerContext.Provider value={{
      mode,
      timeLeft,
      isRunning,
      sessionCompleted,
      completedSessions,
      currentSessionNumber,
      settings,
      wasRunningBeforeClose,
      pausedAt,
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