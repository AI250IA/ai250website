import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Mail, Bot, Globe, ChevronDown, LogIn } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { AuthModal } from './AuthModal';
import { UserDropdown } from './UserDropdown';
import { motion, AnimatePresence } from 'motion/react';
import { NAV_ITEMS } from './navigation/constants';
import logoImage from 'figma:asset/336b4fef317f4db582809faad02340ea38abe7be.png';

export type PageType = 'chat' | 'image' | 'video' | 'voice';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, loading } = useAuth();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400/30 to-blue-600/30 p-1.5 backdrop-blur-md border border-cyan-400/20 shadow-2xl"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 30px rgba(34, 211, 238, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-white/5">
              <img 
                src={logoImage} 
                alt="MetaDIA Logo" 
                className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-transparent to-blue-500/10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20"></div>
            </div>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-cyan-400/30 animate-pulse"></div>
          </motion.div>
          <span className="text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            MetaDIA
          </span>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.key}
              onClick={() => onPageChange(item.key)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 relative overflow-hidden ${
                currentPage === item.key
                  ? `bg-gradient-to-r ${item.gradient} bg-opacity-20 text-white border border-white/30 shadow-lg` 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {currentPage === item.key && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-lg`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center">
                <span className="mr-2">{item.icon}</span>
                {t(`nav.${item.key}`)}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative" ref={menuRef}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-all duration-200"
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'zh' ? '中文' : 'EN'}
              <ChevronDown className={`w-3 h-3 ml-1 opacity-50 transition-transform duration-200 ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            <AnimatePresence>
              {isLanguageMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-36 bg-slate-800/98 backdrop-blur-lg border border-slate-600/80 rounded-lg shadow-2xl z-[9999] overflow-hidden ring-1 ring-white/5"
                >
                  <div className="py-2">
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => {
                        setLanguage('zh');
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center ${
                        language === 'zh' 
                          ? 'bg-blue-500/20 text-blue-400 border-r-2 border-blue-400' 
                          : 'text-slate-200 hover:bg-slate-700/80 hover:text-white'
                      }`}
                    >
                      <span className="mr-3 text-base">🇨🇳</span>
                      <span className="font-medium">中文</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => {
                        setLanguage('en');
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center ${
                        language === 'en' 
                          ? 'bg-blue-500/20 text-blue-400 border-r-2 border-blue-400' 
                          : 'text-slate-200 hover:bg-slate-700/80 hover:text-white'
                      }`}
                    >
                      <span className="mr-3 text-base">🇺🇸</span>
                      <span className="font-medium">English</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Email */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Mail className="w-5 h-5" />
          </motion.button>

          {/* Upgrade Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg">
              {t('nav.upgrade')}
            </Button>
          </motion.div>

          {/* User Authentication */}
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-slate-700/50 animate-pulse"></div>
          ) : user ? (
            <UserDropdown />
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={() => {
                  setIsAuthModalOpen(true);
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {t('auth.login')}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </motion.nav>
  );
};