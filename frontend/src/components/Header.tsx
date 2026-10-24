import React from 'react';
import { Language, AppMode } from '../types';
import { translations } from '../locales/translations';
import { Scissors, ShieldCheck, User, Calendar } from 'lucide-react';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeTab: 'book' | 'my-bookings';
  setActiveTab: (tab: 'book' | 'my-bookings') => void;
  bookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  mode,
  setMode,
  activeTab,
  setActiveTab,
  bookingsCount,
}) => {
  const t = translations[language];

  const triggerHaptic = () => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    } catch {}
  };

  return (
    <header className="sticky top-0 z-40 bg-bgDark/95 backdrop-blur-md border-b border-cardBorder/60 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neonPurple to-purple-800 flex items-center justify-center shadow-glow-purple">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">PATRON</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-neonPurple/20 text-neonPurpleLight border border-neonPurple/30">
                {t.tashkent}
              </span>
            </div>
            <p className="text-[10px] text-textSecondary font-medium">BARBERSHOP • @patron_99_uz</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <div className="flex items-center bg-cardDark border border-cardBorder rounded-lg p-0.5">
            <button
              onClick={() => {
                triggerHaptic();
                setLanguage('ru');
              }}
              className={`px-2 py-1 text-xs font-bold rounded ${
                language === 'ru'
                  ? 'bg-neonPurple text-white shadow-sm'
                  : 'text-textSecondary hover:text-white'
              } transition-all`}
            >
              RU
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                setLanguage('uz');
              }}
              className={`px-2 py-1 text-xs font-bold rounded ${
                language === 'uz'
                  ? 'bg-neonPurple text-white shadow-sm'
                  : 'text-textSecondary hover:text-white'
              } transition-all`}
            >
              UZ
            </button>
          </div>

          {/* Mode Switcher */}
          <button
            onClick={() => {
              triggerHaptic();
              setMode(mode === 'client' ? 'admin' : 'client');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              mode === 'admin'
                ? 'bg-purple-950/80 border-neonPurple text-neonPurpleLight shadow-glow-purple'
                : 'bg-cardDark border-cardBorder text-textSecondary hover:text-white'
            }`}
            title="Переключить режим Клиент / Админ"
          >
            {mode === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-neonPurpleLight" />
                <span className="hidden sm:inline">Админ</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Клиент</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Client Subtabs (Book vs My Bookings) */}
      {mode === 'client' && (
        <div className="max-w-md mx-auto mt-2.5 pt-2 border-t border-white/5 flex gap-2">
          <button
            onClick={() => {
              triggerHaptic();
              setActiveTab('book');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'book'
                ? 'bg-neonPurple text-white shadow-glow-purple'
                : 'bg-cardDark text-textSecondary hover:text-white border border-cardBorder/50'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Онлайн-запись</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic();
              setActiveTab('my-bookings');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'my-bookings'
                ? 'bg-neonPurple text-white shadow-glow-purple'
                : 'bg-cardDark text-textSecondary hover:text-white border border-cardBorder/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.myBookings}</span>
            {bookingsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-bgDark text-[10px] font-extrabold flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
