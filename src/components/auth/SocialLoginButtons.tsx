import React from 'react';
import { Button } from '../ui/button';
import { Github, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { GoogleIcon } from './GoogleIcon';

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: 'google' | 'github' | 'metamask') => void;
  loading: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onSocialLogin,
  loading
}) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-900 text-slate-400">{t('auth.or')}</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => onSocialLogin('google')}
            disabled={loading}
            className="w-full h-12 bg-white/95 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 shadow-sm backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="w-5 h-5 mr-3" />
            <span className="font-medium">{t('auth.login.google')}</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => onSocialLogin('github')}
            disabled={loading}
            className="w-full h-12 bg-white/95 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 shadow-sm backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="w-5 h-5 mr-3 text-gray-800" />
            <span className="font-medium">{t('auth.login.github')}</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => onSocialLogin('metamask')}
            disabled={loading}
            className="w-full h-12 bg-white/95 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 shadow-sm backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet className="w-5 h-5 mr-3 text-orange-500" />
            <span className="font-medium">{t('auth.login.metamask')}</span>
          </Button>
        </motion.div>
      </div>
    </>
  );
};