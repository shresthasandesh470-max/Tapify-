
export type CardTemplate = 'modern' | 'classic' | 'creative' | 'minimal' | 'executive' | 'tech' | 'bold' | 'sleek';
export type CardTheme = 'light' | 'dark' | 'glass' | 'mesh' | 'neon' | 'aurora' | 'retro' | 'gold';
export type CardOrientation = 'landscape' | 'portrait';
export type CardLanguage = 'en' | 'ne';

export interface BusinessCardData {
  id: string;
  userId: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  twitter: string;
  facebook?: string;
  instagram?: string;
  address: string;
  profileImage: string;
  backgroundUrl?: string;
  backgroundBlur?: number;
  themeColor: string;
  template: CardTemplate;
  theme: CardTheme;
  orientation: CardOrientation;
  fontFamily?: string;
  language?: CardLanguage;
  bio: string;
  createdAt: number;
  whatsappNumber?: string;
  orderRedirectUrl?: string;
  isOrderEnabled?: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: 'SAVE' | 'AI_TRANSLATE' | 'AI_IMAGE_EDIT' | 'LOGIN' | 'NFC_WRITE' | 'ORDER_NFC';
  details: string;
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  isVerified?: boolean;
}

export type ViewState = 'landing' | 'login' | 'verify_email' | 'enter_otp' | 'register' | 'editor' | 'admin' | 'forgot_password' | 'reset_password';
