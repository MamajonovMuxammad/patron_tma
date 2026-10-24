import React from 'react';
import { Language } from '../types';
import { Scissors, Phone } from 'lucide-react';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
}) => {
  const triggerHaptic = () => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    } catch {}
  };

  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-xl border-b border-purple-500/15 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-600/30 ring-1 ring-purple-400/30">
            <Scissors className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-wider text-white">PATRON</span>
              <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                TASHKENT
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">BARBERSHOP • @patron_99_uz</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Call */}
          <a
            href="tel:+998950232000"
            className="p-2 rounded-xl bg-[#141418] border border-zinc-800 text-zinc-300 hover:text-white hover:border-purple-500 transition-all"
            title="Позвонить"
          >
            <Phone className="w-3.5 h-3.5 text-purple-400" />
          </a>

          {/* Language Switch */}
          <div className="flex items-center bg-[#141418] border border-zinc-800 rounded-xl p-0.5">
            <button
              onClick={() => {
                triggerHaptic();
                setLanguage('ru');
              }}
              className={`px-2 py-1 text-xs font-black rounded-lg transition-all ${
                language === 'ru'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                setLanguage('uz');
              }}
              className={`px-2 py-1 text-xs font-black rounded-lg transition-all ${
                language === 'uz'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              UZ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
