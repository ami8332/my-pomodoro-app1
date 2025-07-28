import { useState } from 'react';
import { Clock, BarChart3, Settings, User, Monitor, Smartphone, Tablet, Menu, X } from 'lucide-react';

export default function Navbar({ onShowSettings, onShowStats, onShowProfile }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (action) => {
    action();
    setIsMobileMenuOpen(false); // Close menu after selection
  };

  return (
    <>
      <nav className="flex justify-between items-center p-6 text-white relative z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
            <Clock className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">TimeFocus</h1>
            {/* Device Compatibility Badge - Hide on mobile */}
            <div className="hidden sm:flex items-center space-x-1 mt-1">
              <div className="flex items-center space-x-1 bg-white/15 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                <Monitor size={12} className="text-white/80" />
                <Tablet size={12} className="text-white/80" />
                <Smartphone size={12} className="text-white/80" />
                <span className="text-white/80 text-xs font-medium">Works on all devices</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Menu - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-3">
          <button 
            onClick={onShowStats}
            className="px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-300 flex items-center space-x-2 border border-white/20"
          >
            <BarChart3 size={18} />
            <span className="font-medium">Analytics</span>
          </button>
          <button 
            onClick={onShowSettings}
            className="px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-300 flex items-center space-x-2 border border-white/20"
          >
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </button>
          <button 
            onClick={onShowProfile}
            className="px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-300 flex items-center space-x-2 border border-white/20"
          >
            <User size={18} />
            <span className="font-medium">Profile</span>
          </button>
        </div>

        {/* Mobile Menu Button - Visible only on mobile */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-3 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-300 border border-white/20 z-50 relative"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Visible only when menu is open */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="md:hidden fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-800">Menu</h3>
                <button 
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                <button 
                  onClick={() => handleMenuClick(onShowStats)}
                  className="w-full flex items-center space-x-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 border border-blue-200 text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-lg">Analytics</div>
                    <div className="text-sm text-gray-600">View your productivity stats</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleMenuClick(onShowSettings)}
                  className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-gray-200 text-left"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Settings size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-lg">Settings</div>
                    <div className="text-sm text-gray-600">Customize your timer</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleMenuClick(onShowProfile)}
                  className="w-full flex items-center space-x-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 border border-green-200 text-left"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-lg">Profile</div>
                    <div className="text-sm text-gray-600">Manage your account</div>
                  </div>
                </button>

                {/* Device Compatibility Info for Mobile */}
                <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor size={16} className="text-purple-600" />
                    <Tablet size={16} className="text-purple-600" />
                    <Smartphone size={16} className="text-purple-600" />
                  </div>
                  <div className="text-sm font-medium text-purple-800">Works on all devices</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Desktop, tablet, and mobile optimized
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}