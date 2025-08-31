import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { AuthHeader } from './auth/AuthHeader';
import { LoginMethodToggle } from './auth/LoginMethodToggle';
import { EmailLoginForm } from './auth/EmailLoginForm';
import { PhoneLoginForm } from './auth/PhoneLoginForm';
import { SocialLoginButtons } from './auth/SocialLoginButtons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { t } = useLanguage();
  const { 
    signInOrRegister, 
    signInWithPhone, 
    verifyOTP,
    signInWithGoogle, 
    signInWithGitHub, 
    signInWithMetaMask 
  } = useAuth();

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setOtpCode('');
    setShowOTPInput(false);
    setLoading(false);
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast.error(t('auth.fill.email.password'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('auth.password.min.length'));
      return;
    }

    setLoading(true);
    const { error } = await signInOrRegister(email, password, name || email.split('@')[0]);
    
    if (error) {
      toast.error(error.message || t('auth.login.failed'));
    } else {
      toast.success(t('auth.login.success'));
      resetForm();
      onClose();
    }
    setLoading(false);
  };

  const handlePhoneLogin = async () => {
    if (!phone) {
      toast.error('请输入手机号');
      return;
    }

    setLoading(true);
    const { error } = await signInWithPhone(phone);
    
    if (error) {
      toast.error(error.message || '发送验证码失败');
    } else {
      setShowOTPInput(true);
      toast.success('验证码已发送');
    }
    setLoading(false);
  };

  const handleOTPVerify = async () => {
    if (!otpCode) {
      toast.error('请输入验证码');
      return;
    }

    setLoading(true);
    const { error } = await verifyOTP(phone, otpCode);
    
    if (error) {
      toast.error(error.message || '验证失败');
    } else {
      toast.success('登录成功！');
      resetForm();
      onClose();
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'metamask') => {
    setLoading(true);
    let error;

    try {
      switch (provider) {
        case 'google':
          ({ error } = await signInWithGoogle());
          break;
        case 'github':
          ({ error } = await signInWithGitHub());
          break;
        case 'metamask':
          ({ error } = await signInWithMetaMask());
          break;
      }

      if (error) {
        if (provider === 'metamask' && error.message?.includes('not installed')) {
          toast.error(t('auth.metamask.not.installed'));
        } else {
          toast.error(error.message || `${provider} 登录失败`);
        }
      } else {
        if (provider !== 'metamask') {
          // OAuth providers redirect, so we don't close here
          return;
        }
        toast.success('登录成功！');
        resetForm();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || '登录失败');
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {t('auth.login')} - MetaDIA
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t('auth.welcome.back')}
          </DialogDescription>
          
          <AuthHeader />
        </DialogHeader>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl text-center mb-4">{t('auth.welcome.back')}</h3>
            
            <LoginMethodToggle 
              loginMethod={loginMethod}
              onMethodChange={setLoginMethod}
            />

            <AnimatePresence mode="wait">
              {loginMethod === 'email' ? (
                <EmailLoginForm
                  name={name}
                  email={email}
                  password={password}
                  showPassword={showPassword}
                  loading={loading}
                  onNameChange={setName}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onSubmit={handleEmailAuth}
                />
              ) : (
                <PhoneLoginForm
                  phone={phone}
                  otpCode={otpCode}
                  showOTPInput={showOTPInput}
                  loading={loading}
                  onPhoneChange={setPhone}
                  onOtpChange={setOtpCode}
                  onSendCode={handlePhoneLogin}
                  onVerifyOTP={handleOTPVerify}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Social Login Options */}
        <div className="space-y-4">
          <SocialLoginButtons
            onSocialLogin={handleSocialLogin}
            loading={loading}
          />
        </div>

        {/* Info Text */}
        <div className="text-center text-sm text-slate-400">
          <p>{t('auth.smart.login.hint') || '智能登录：已有账户直接登录，新用户自动注册'}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};