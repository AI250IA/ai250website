import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { authAPI } from '../utils/api';

interface User {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    provider?: string;
    wallet_address?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInOrRegister: (email: string, password: string, name?: string) => Promise<{ error?: any }>;
  signInWithPhone: (phone: string) => Promise<{ error?: any }>;
  verifyOTP: (phone: string, token: string) => Promise<{ error?: any }>;
  sendSmsCode: (phone: string, code: string) => Promise<{ error?: any }>;
  loginWithPhoneCode: (phone: string, code: string) => Promise<{ error?: any }>;
  sendEmailCode: (email: string, code: string) => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  signInWithGitHub: () => Promise<{ error?: any }>;
  signInWithMetaMask: () => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseClient();

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      try {
        // 检查URL中是否有OAuth回调参数
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (code && state) {
          try {
            // 尝试处理OAuth回调
            let result;
            if (state.includes('google')) {
              result = await authAPI.googleCallback(code, state);
            } else if (state.includes('github')) {
              result = await authAPI.githubCallback(code, state);
            }
            
            if (result?.token) {
              localStorage.setItem('auth_token', result.token.access_token);
              // 创建模拟用户
              setUser({
                id: crypto.randomUUID(),
                email: 'oauth@example.com',
                user_metadata: {
                  name: 'OAuth User',
                  provider: state.includes('google') ? 'google' : 'github'
                }
              });
              
              // 清理URL参数
              window.history.replaceState({}, document.title, window.location.pathname);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('OAuth callback error:', error);
          }
        }

        // 检查本地存储的token
        const token = localStorage.getItem('auth_token');
        if (token) {
          // 如果有token，创建模拟用户会话
          setUser({
            id: crypto.randomUUID(),
            email: 'stored@example.com',
            user_metadata: {
              name: 'Stored User',
              provider: 'local'
            }
          });
          setLoading(false);
          return;
        }

        // 检查Supabase会话
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            user_metadata: session.user.user_metadata
          });
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            user_metadata: session.user.user_metadata
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInOrRegister = async (email: string, password: string, name?: string) => {
    try {
      // 首先尝试登录
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // 如果登录失败，且是因为用户不存在或密码错误，尝试注册
        if (signInError.message?.includes('Invalid login credentials') || 
            signInError.message?.includes('Email not confirmed') ||
            signInError.message?.includes('User not found')) {
          
          // 尝试自动注册
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/make-server-4c0d39e6/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              email,
              password,
              name: name || email.split('@')[0] // 如果没有提供名字，使用邮箱前缀作为默认名字
            }),
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
          }

          // 注册成功后立即登录
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (loginError) {
            throw loginError;
          }

          return { error: null };
        } else {
          // 其他类型的登录错误
          return { error: signInError };
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // 新的API集成方法
  const sendSmsCode = async (phone: string, code: string) => {
    try {
      await authAPI.sendSmsCode(phone, code);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const loginWithPhoneCode = async (phone: string, code: string) => {
    try {
      const result = await authAPI.loginWithPhoneCode(phone, code);
      
      // 保存本地token
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        // 创建一个模拟用户对象
        setUser({
          id: crypto.randomUUID(),
          phone: phone,
          user_metadata: {
            name: phone,
            provider: 'phone'
          }
        });
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const sendEmailCode = async (email: string, code: string) => {
    try {
      await authAPI.sendEmailCode(email, code);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // 先尝试新的API
      try {
        const { url } = await authAPI.getGoogleAuthUrl();
        window.location.href = url;
        return { error: null };
      } catch (apiError) {
        // 如果新API失败，回退到Supabase OAuth
        console.log('Using fallback Supabase Google OAuth');
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        return { error };
      }
    } catch (error) {
      return { error };
    }
  };

  const signInWithGitHub = async () => {
    try {
      // 先尝试新的API
      try {
        const { url } = await authAPI.getGitHubAuthUrl();
        window.location.href = url;
        return { error: null };
      } catch (apiError) {
        // 如果新API失败，回退到Supabase OAuth
        console.log('Using fallback Supabase GitHub OAuth');
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: window.location.origin
          }
        });
        return { error };
      }
    } catch (error) {
      return { error };
    }
  };

  const signInWithMetaMask = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof (window as any).ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const walletAddress = accounts[0];

      // Create a message for the user to sign
      const message = `Sign this message to authenticate with MetaDIA: ${Date.now()}`;
      
      // Request signature
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      });

      // Send to server for verification and user creation/login
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/make-server-4c0d39e6/auth/metamask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          walletAddress,
          message,
          signature
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'MetaMask authentication failed');
      }

      // The server should handle creating/updating the user and returning session
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // 清理本地存储
      localStorage.removeItem('auth_token');
      
      // 同时清理Supabase会话
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signInOrRegister,
    signInWithPhone,
    verifyOTP,
    sendSmsCode,
    loginWithPhoneCode,
    sendEmailCode,
    signInWithGoogle,
    signInWithGitHub,
    signInWithMetaMask,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
