import { X, Volume2, VolumeX, Zap, Bell, BellOff, Vibrate, Monitor, Play } from 'lucide-react';
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

  // Enhanced sound settings
  const [soundSettings, setSoundSettings] = useState({
    alarmSound: 'bell',
    alarmVolume: 50,
    tickingSound: 'none',
    tickingVolume: 30,
    enabled: true
  });

  // Available sound options
  const alarmSounds = [
    { value: 'bell', label: 'Bell', file: '/sounds/bell.mp3' },
    { value: 'kitchen', label: 'Kitchen', file: '/sounds/kitchen.mp3' },
    { value: 'burp', label: 'Burp', file: '/sounds/burp.mp3' },
    { value: 'winter', label: 'Winter', file: '/sounds/winter.mp3' },
    { value: 'none', label: 'None', file: null }
  ];

  const tickingSounds = [
    { value: 'none', label: 'None', file: null },
    { value: 'clock', label: 'Clock Tick', file: '/sounds/tick.mp3' },
    { value: 'metronome', label: 'Metronome', file: '/sounds/metronome.mp3' },
    { value: 'soft', label: 'Soft Tick', file: '/sounds/soft-tick.mp3' }
  ];

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

    // Load sound settings
    const savedSounds = localStorage.getItem('timefocus-sound-settings');
    if (savedSounds) {
      setSoundSettings(JSON.parse(savedSounds));
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

  const updateSoundSetting = (key, value) => {
    const newSettings = { ...soundSettings, [key]: value };
    setSoundSettings(newSettings);
    localStorage.setItem('timefocus-sound-settings', JSON.stringify(newSettings));
  };

  // Play test sound function
  const playTestSound = (soundType) => {
    const soundFile = soundType === 'alarm' 
      ? alarmSounds.find(s => s.value === soundSettings.alarmSound)?.file
      : tickingSounds.find(s => s.value === soundSettings.tickingSound)?.file;
    
    if (soundFile) {
      try {
        const audio = new Audio(soundFile);
        audio.volume = (soundType === 'alarm' ? soundSettings.alarmVolume : soundSettings.tickingVolume) / 100;
        audio.play();
      } catch (error) {
        console.log('Could not play test sound');
      }
    }
  };

  const handleSave = () => {
    updateSettings({
      ...localSettings,
      soundSettings
    });
    onClose();
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateNotificationSetting('desktop', true);
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
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
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
              
              {/* Auto-start toggle */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <label className="text-gray-700 font-medium">Auto-start next session</label>
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

          {/* Sound Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <Volume2 size={20} />
              <span>Sound Settings</span>
            </h3>
            
            {/* Master sound toggle */}
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl mb-4">
              <label className="text-gray-700 flex items-center space-x-2 font-medium">
                {soundSettings.enabled ? <Volume2 size={18} className="text-orange-500" /> : <VolumeX size={18} className="text-gray-400" />}
                <span>Enable All Sounds</span>
              </label>
              <button
                onClick={() => updateSoundSetting('enabled', !soundSettings.enabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  soundSettings.enabled ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  soundSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className={`space-y-6 ${!soundSettings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Alarm Sound */}
              <div className="sound-card alarm rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-800 font-semibold flex items-center space-x-2">
                    <Bell size={20} className="text-green-600" />
                    <span>Alarm Sound</span>
                  </label>
                  <button
                    onClick={() => playTestSound('alarm')}
                    className="test-sound-btn p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-all duration-200"
                    title="Test Sound"
                  >
                    <Play size={18} className="text-green-600" />
                  </button>
                </div>
                
                {/* Alarm Sound Selection */}
                <select
                  value={soundSettings.alarmSound}
                  onChange={(e) => updateSoundSetting('alarmSound', e.target.value)}
                  className="sound-select w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white mb-4 text-gray-700 font-medium"
                >
                  {alarmSounds.map(sound => (
                    <option key={sound.value} value={sound.value}>
                      {sound.label}
                    </option>
                  ))}
                </select>
                
                {/* Alarm Volume */}
                {soundSettings.alarmSound !== 'none' && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600 font-medium">Volume</span>
                      <span className="volume-display text-sm text-green-600">{soundSettings.alarmVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundSettings.alarmVolume}
                      onChange={(e) => updateSoundSetting('alarmVolume', parseInt(e.target.value))}
                      className="sound-slider alarm w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ticking Sound */}
              <div className="sound-card ticking rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-800 font-semibold flex items-center space-x-2">
                    <Volume2 size={20} className="text-purple-600" />
                    <span>Ticking Sound</span>
                  </label>
                  <button
                    onClick={() => playTestSound('ticking')}
                    className="test-sound-btn p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all duration-200"
                    title="Test Sound"
                  >
                    <Play size={18} className="text-purple-600" />
                  </button>
                </div>
                
                {/* Ticking Sound Selection */}
                <select
                  value={soundSettings.tickingSound}
                  onChange={(e) => updateSoundSetting('tickingSound', e.target.value)}
                  className="sound-select w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white mb-4 text-gray-700 font-medium"
                >
                  {tickingSounds.map(sound => (
                    <option key={sound.value} value={sound.value}>
                      {sound.label}
                    </option>
                  ))}
                </select>
                
                {/* Ticking Volume */}
                {soundSettings.tickingSound !== 'none' && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600 font-medium">Volume</span>
                      <span className="volume-display text-sm text-purple-600">{soundSettings.tickingVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundSettings.tickingVolume}
                      onChange={(e) => updateSoundSetting('tickingVolume', parseInt(e.target.value))}
                      className="sound-slider ticking w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
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