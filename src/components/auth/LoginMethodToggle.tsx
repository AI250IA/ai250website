import React from 'react';
import { Button } from '../ui/button';
import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface LoginMethodToggleProps {
  loginMethod: 'email' | 'phone';
  onMethodChange: (method: 'email' | 'phone') => void;
}

export const LoginMethodToggle: React.FC<LoginMethodToggleProps> = ({
  loginMethod,
  onMethodChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2 mb-4">
      <Button
        type="button"
        variant={loginMethod === 'email' ? 'default' : 'outline'}
        onClick={() => onMethodChange('email')}
        className={`flex-1 ${
          loginMethod === 'email' 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
            : 'border-slate-600 text-slate-300'
        }`}
      >
        <Mail className="w-4 h-4 mr-2" />
        {t('auth.login.email')}
      </Button>
      <Button
        type="button"
        variant={loginMethod === 'phone' ? 'default' : 'outline'}
        onClick={() => onMethodChange('phone')}
        className={`flex-1 ${
          loginMethod === 'phone' 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
            : 'border-slate-600 text-slate-300'
        }`}
      >
        <Phone className="w-4 h-4 mr-2" />
        {t('auth.login.phone')}
      </Button>
    </div>
  );
};