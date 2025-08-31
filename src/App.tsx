import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { AuthProvider } from './components/AuthContext';
import { Navigation, PageType } from './components/Navigation';
import { FeatureCards } from './components/FeatureCards';
import { ChatInterface } from './components/ChatInterface';
import { ImageInterface } from './components/ImageInterface';
import { VideoInterface } from './components/VideoInterface';
import { VoiceInterface } from './components/VoiceInterface';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';

const MainContent: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<PageType>('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1752451399416-faef5f9fe572?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjBhYnN0cmFjdCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU2NTY1MzQyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="container mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            {currentPage === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Welcome Section */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center mb-16"
                >
                  <motion.h1
                    className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    key={language} // This will trigger re-animation on language change
                  >
                    {t('main.welcome')}
                  </motion.h1>
                  <motion.p
                    className="text-xl text-slate-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    key={`subtitle-${language}`} // This will trigger re-animation on language change
                  >
                    {t('main.subtitle')}
                  </motion.p>
                </motion.div>

                {/* Feature Cards */}
                <div className="mb-16">
                  <FeatureCards />
                </div>

                {/* Chat Interface */}
                <ChatInterface />
              </motion.div>
            )}

            {currentPage === 'image' && (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ImageInterface />
              </motion.div>
            )}

            {currentPage === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <VideoInterface />
              </motion.div>
            )}

            {currentPage === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <VoiceInterface />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="dark">
      <LanguageProvider>
        <AuthProvider>
          <MainContent />
          <Toaster 
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgb(30 41 59 / 0.95)',
                border: '1px solid rgb(71 85 105 / 0.5)',
                color: 'white',
              },
            }}
          />
        </AuthProvider>
      </LanguageProvider>
    </div>
  );
}