import { BarChart3, Settings, User, Menu, X, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ onShowStats, onShowSettings, onShowProfile }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (action) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 🔥 COMPACT NAVBAR - Reduced height and better spacing */}
      <nav className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14"> {/* Reduced from h-16 to h-14 */}
            
            {/* Logo - More compact */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"> {/* Smaller logo */}
                <Clock size={14} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white tracking-tight">TimeFocus</h1> {/* Smaller text */}
                <p className="text-xs text-white/60 -mt-1">📱💻🖥️ Works on all devices</p> {/* Smaller subtitle */}
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-bold text-white">TimeFocus</h1> {/* Even smaller on mobile */}
              </div>
            </div>

            {/* Desktop Navigation - More compact buttons */}
            <div className="hidden md:flex items-center space-x-2"> {/* Reduced space */}
              <button 
                onClick={onShowStats}
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 border border-white/10 text-sm" /* Smaller padding */
              >
                <BarChart3 size={16} />
                <span className="font-medium">Analytics</span>
              </button>
              <button 
                onClick={onShowSettings}
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 border border-white/10 text-sm"
              >
                <Settings size={16} />
                <span className="font-medium">Settings</span>
              </button>
              <button 
                onClick={onShowProfile}
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 border border-white/10 text-sm"
              >
                <User size={16} />
                <span className="font-medium">Profile</span>
              </button>
            </div>

            {/* Mobile Menu Button - Compact */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/10"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Improved design */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="md:hidden fixed top-14 right-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/20">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Menu</h3>
                <button 
                  onClick={toggleMobileMenu}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleMenuClick(onShowStats)}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 border border-blue-200 text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Analytics</div>
                    <div className="text-sm text-gray-600">View your stats</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleMenuClick(onShowSettings)}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-gray-200 text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Settings</div>
                    <div className="text-sm text-gray-600">Customize timer</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleMenuClick(onShowProfile)}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 border border-green-200 text-left"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Profile</div>
                    <div className="text-sm text-gray-600">Your account</div>
                  </div>
                </button>
              </div>

              {/* Device info */}
              <div className="mt-6 p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">📱💻🖥️</span>
                </div>
                <div className="text-sm font-medium text-purple-800">Works everywhere</div>
                <div className="text-xs text-purple-600 mt-1">
                  Desktop, tablet, mobile optimized
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}