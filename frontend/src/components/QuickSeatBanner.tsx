import React from 'react';
import { Language } from '../types';
import { translations } from '../locales/translations';
import { Zap, ArrowRight } from 'lucide-react';

interface QuickSeatBannerProps {
  language: Language;
  onQuickBook: () => void;
}

export const QuickSeatBanner: React.FC<QuickSeatBannerProps> = ({ language, onQuickBook }) => {
  const t = translations[language];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/70 via-cardDark to-cardDark border border-emerald-500/30 p-3.5 shadow-glow-green/20">
      {/* Background soft glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-statusGreen animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-statusGreen relative shadow-glow-green" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-statusGreen/20 text-statusGreen border border-statusGreen/30">
                {t.quickSeatTag}
              </span>
              <span className="text-xs text-textSecondary font-semibold">Без ожидания</span>
            </div>
            <p className="text-xs font-bold text-white mt-0.5 leading-snug">
              {t.quickSeatText}
            </p>
          </div>
        </div>

        <button
          onClick={onQuickBook}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-statusGreen hover:bg-emerald-400 text-bgDark font-black text-xs shadow-glow-green transition-all active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{t.quickSeatBtn}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
