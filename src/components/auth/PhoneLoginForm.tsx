import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Smartphone, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

interface PhoneLoginFormProps {
  phone: string;
  otpCode: string;
  showOTPInput: boolean;
  loading: boolean;
  onPhoneChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onSendCode: () => void;
  onVerifyOTP: () => void;
}

export const PhoneLoginForm: React.FC<PhoneLoginFormProps> = ({
  phone,
  otpCode,
  showOTPInput,
  loading,
  onPhoneChange,
  onOtpChange,
  onSendCode,
  onVerifyOTP
}) => {
  const { t } = useLanguage();

  return (
    <motion.div
      key="phone-login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {!showOTPInput ? (
        <>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="tel"
              placeholder={t('auth.phone.placeholder')}
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="pl-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          <Button
            onClick={onSendCode}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            {loading ? t('auth.signing.in') : t('auth.send.code')}
          </Button>
        </>
      ) : (
        <>
          <div className="relative">
            <Shield className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder={t('auth.code.placeholder')}
              value={otpCode}
              onChange={(e) => onOtpChange(e.target.value)}
              className="pl-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          <Button
            onClick={onVerifyOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            {loading ? t('auth.signing.in') : t('auth.verify.code')}
          </Button>
        </>
      )}
    </motion.div>
  );
};