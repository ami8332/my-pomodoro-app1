// lib/analytics.js - Optional advanced tracking for TimeFocus

const GA_TRACKING_ID = 'G-DN05E92D4E';

// Basic event tracking
export const trackEvent = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Timer Events
export const trackTimerStart = (mode, duration) => {
  trackEvent({
    action: 'timer_start',
    category: 'Timer',
    label: mode, // 'focus', 'shortBreak', 'longBreak'
    value: duration
  });
};

export const trackTimerComplete = (mode, duration) => {
  trackEvent({
    action: 'timer_complete',
    category: 'Timer',
    label: mode,
    value: duration
  });
};

export const trackTimerPause = (mode) => {
  trackEvent({
    action: 'timer_pause',
    category: 'Timer',
    label: mode
  });
};

// Task Events
export const trackTaskCreated = (targetHours) => {
  trackEvent({
    action: 'task_created',
    category: 'Tasks',
    label: 'new_task',
    value: targetHours
  });
};

export const trackTaskCompleted = () => {
  trackEvent({
    action: 'task_completed',
    category: 'Tasks',
    label: 'task_done'
  });
};

// Settings Events  
export const trackSettingsChanged = (setting, newValue) => {
  trackEvent({
    action: 'settings_changed',
    category: 'Settings',
    label: setting,
    value: newValue
  });
};