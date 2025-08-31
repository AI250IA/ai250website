import { PageType } from '../Navigation';

export const NAV_ITEMS = [
  { key: 'chat' as PageType, icon: '💬', gradient: 'from-emerald-500 to-teal-500' },
  { key: 'image' as PageType, icon: '🖼️', gradient: 'from-blue-500 to-indigo-500' },
  { key: 'video' as PageType, icon: '🎥', gradient: 'from-purple-500 to-pink-500' },
  { key: 'voice' as PageType, icon: '🎤', gradient: 'from-orange-500 to-red-500' }
] as const;