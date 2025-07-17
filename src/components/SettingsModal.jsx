import { X, Volume2, VolumeX, Zap, Bell, BellOff, Vibrate, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTimer } from '@/context/TimerContext';

export default function SettingsModal({ onClose }) {
  const { settings, updateSettings } = useTimer();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [motivationEnabled, setMotivationEnabled] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    sound: true,
    vibration: true,
    desktop: true,
    motivationalMessages: true
  });

  useEffect(() => {
    setLocalSettings(settings);
    
    // Load motivation setting
    const savedMotivation = localStorage.getItem('timefocus-motivation-enabled');
    if (savedMotivation !== null) {
      setMotivationEnabled(JSON.parse(savedMotivation));
    }

    // Load notification settings
    const savedNotifications = localStorage.getItem('timefocus-notifications');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
  }, [settings]);

  const updateLocalSetting = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleMotivation = () => {
    const newValue = !motivationEnabled;
    setMotivationEnabled(newValue);
    localStorage.setItem('timefocus-motivation-enabled', JSON.stringify(newValue));
  };

  const updateNotificationSetting = (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    localStorage.setItem('timefocus-notifications', JSON.stringify(newSettings));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateNotificationSetting('desktop', true);
        // Show test notification
        new Notification('TimeFocus', {
          body: '🎉 Desktop notifications enabled!',
          icon: '/favicon.ico'
        });
      } else {
        updateNotificationSetting('desktop', false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Timer Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Timer Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Focus Time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.focusTime}
                  onChange={(e) => updateLocalSetting('focusTime', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Short Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakTime}
                  onChange={(e) => updateLocalSetting('shortBreakTime', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Long Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakTime}
                  onChange={(e) => updateLocalSetting('longBreakTime', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-gray-600">Long Break Interval</label>
                  <div className="text-xs text-gray-400 mt-1">Every X focus sessions</div>
                </div>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={localSettings.longBreakInterval}
                  onChange={(e) => updateLocalSetting('longBreakInterval', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Auto Start Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Auto Start</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Auto start breaks</label>
                <button
                  onClick={() => updateLocalSetting('autoStartBreaks', !localSettings.autoStartBreaks)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    localSettings.autoStartBreaks ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    localSettings.autoStartBreaks ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Auto start pomodoros</label>
                <button
                  onClick={() => updateLocalSetting('autoStartPomodoros', !localSettings.autoStartPomodoros)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    localSettings.autoStartPomodoros ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    localSettings.autoStartPomodoros ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <Bell size={20} />
              <span>Notifications</span>
            </h3>
            <div className="space-y-4">
              {/* Master notification toggle */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <label className="text-gray-700 flex items-center space-x-2 font-medium">
                  {notificationSettings.enabled ? <Bell size={18} className="text-blue-500" /> : <BellOff size={18} className="text-gray-400" />}
                  <span>Enable Notifications</span>
                </label>
                <button
                  onClick={() => updateNotificationSetting('enabled', !notificationSettings.enabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notificationSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Individual notification settings */}
              <div className={`space-y-3 ${!notificationSettings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center">
                  <label className="text-gray-600 flex items-center space-x-2">
                    {localSettings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    <span>Alarm Sound</span>
                  </label>
                  <button
                    onClick={() => updateLocalSetting('soundEnabled', !localSettings.soundEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      localSettings.soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      localSettings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-600 flex items-center space-x-2">
                    <Monitor size={18} />
                    <span>Desktop Notifications</span>
                  </label>
                  <button
                    onClick={requestNotificationPermission}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings.desktop ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notificationSettings.desktop ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-600 flex items-center space-x-2">
                    <Vibrate size={18} />
                    <span>Vibration (Mobile)</span>
                  </label>
                  <button
                    onClick={() => updateNotificationSetting('vibration', !notificationSettings.vibration)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings.vibration ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notificationSettings.vibration ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-600 flex items-center space-x-2">
                    <Zap size={18} className="text-yellow-500" />
                    <span>Motivational Messages</span>
                  </label>
                  <button
                    onClick={toggleMotivation}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      motivationEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      motivationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Info about notifications */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mt-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                <Bell size={16} />
                <span>🔔 How notifications work:</span>
              </h4>
              <div className="text-sm text-blue-600 space-y-1">
                <div>• 🎯 Get alerts when focus sessions complete</div>
                <div>• ☕ Notified when break time is over</div>
                <div>• 🎉 Motivational messages after each session</div>
                <div>• 🖥️ Desktop notifications work even when tab is closed</div>
                <div>• 📱 Vibration available on mobile devices</div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}