import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

interface EmailLoginFormProps {
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: () => void;
}

export const EmailLoginForm: React.FC<EmailLoginFormProps> = ({
  name,
  email,
  password,
  showPassword,
  loading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit
}) => {
  const { t } = useLanguage();

  return (
    <motion.div
      key="email-login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="relative">
        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder={t('auth.name.placeholder') || '姓名（选填）'}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="pl-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
        />
      </div>
      
      <div className="relative">
        <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          type="email"
          placeholder={t('auth.email.placeholder')}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="pl-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
        />
      </div>
      
      <div className="relative">
        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder={t('auth.password.placeholder')}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="pl-12 pr-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-3 text-slate-400 hover:text-white"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="text-xs text-slate-400 text-center">
        {t('auth.auto.register.hint') || '如果是新用户，系统会自动为您创建账户'}
      </div>

      <Button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
      >
        {loading ? (t('auth.signing.in') || '登录中...') : (t('auth.login') || '登录')}
      </Button>
    </motion.div>
  );
};