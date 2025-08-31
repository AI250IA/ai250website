import React from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  Crown, 
  Sparkles,
  Wallet,
  Shield
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { motion } from 'motion/react';

export const UserDropdown: React.FC = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserDisplayName = () => {
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    if (user.phone) {
      return user.phone;
    }
    if (user.user_metadata?.wallet_address) {
      return `${user.user_metadata.wallet_address.slice(0, 6)}...${user.user_metadata.wallet_address.slice(-4)}`;
    }
    return 'User';
  };

  const getUserAvatar = () => {
    return user.user_metadata?.avatar_url || '';
  };

  const getProviderIcon = () => {
    const provider = user.user_metadata?.provider;
    switch (provider) {
      case 'google':
        return '🌐';
      case 'github':
        return '🐙';
      case 'metamask':
        return '🦊';
      default:
        return '👤';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
            <Avatar className="h-10 w-10 border-2 border-purple-500/30">
              <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 text-white" 
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-purple-500/30">
                <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-lg">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user.email || user.phone || user.user_metadata?.wallet_address}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs">{getProviderIcon()}</span>
                  <span className="text-xs text-slate-400 capitalize">
                    {user.user_metadata?.provider || 'email'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* User level/badge */}
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300">AI创作者</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-slate-700/50" />
        
        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer">
          <User className="mr-3 h-4 w-4" />
          <span>{t('auth.profile')}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer">
          <Settings className="mr-3 h-4 w-4" />
          <span>{t('auth.settings')}</span>
        </DropdownMenuItem>

        {user.user_metadata?.provider === 'metamask' && (
          <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer">
            <Wallet className="mr-3 h-4 w-4" />
            <span>钱包管理</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer">
          <Shield className="mr-3 h-4 w-4" />
          <span>安全中心</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-slate-700/50" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>{t('auth.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};