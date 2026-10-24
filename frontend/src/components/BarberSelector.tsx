import React from 'react';
import { Barber, Language } from '../types';
import { translations } from '../locales/translations';
import { Star, Zap, Check } from 'lucide-react';

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarber: Barber | null; // null means "Any barber"
  onSelect: (barber: Barber | null) => void;
  language: Language;
}

export const BarberSelector: React.FC<BarberSelectorProps> = ({
  barbers,
  selectedBarber,
  onSelect,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-2.5">
      <div>
        <h2 className="text-sm font-extrabold text-white tracking-wide">{t.step2Title}</h2>
        <p className="text-xs text-textSecondary">{t.step2Subtitle}</p>
      </div>

      {/* Option: Any free barber */}
      <div
        onClick={() => onSelect(null)}
        className={`relative cursor-pointer rounded-2xl p-3.5 transition-all active:scale-[0.99] flex items-center justify-between ${
          selectedBarber === null
            ? 'glass-card-active border-neonPurple'
            : 'glass-card hover:border-cardBorder'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-bgDark font-black">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">{t.anyBarber}</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Быстро
              </span>
            </div>
            <p className="text-xs text-textSecondary mt-0.5">{t.anyBarberDesc}</p>
          </div>
        </div>

        {selectedBarber === null && (
          <span className="w-5 h-5 rounded-full bg-neonPurple flex items-center justify-center text-white shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
        )}
      </div>

      {/* Barbers list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {barbers.map((barber) => {
          const isSelected = selectedBarber?.id === barber.id;
          const title = language === 'ru' ? barber.titleRu : barber.titleUz;
          const specialties = language === 'ru' ? barber.specialtiesRu : barber.specialtiesUz;

          return (
            <div
              key={barber.id}
              onClick={() => onSelect(barber)}
              className={`relative cursor-pointer rounded-2xl p-3 transition-all active:scale-[0.99] flex flex-col justify-between ${
                isSelected
                  ? 'glass-card-active border-neonPurple'
                  : 'glass-card hover:border-cardBorder'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={barber.avatarUrl}
                    alt={barber.name}
                    className="w-12 h-12 rounded-xl object-cover border border-cardBorder"
                  />
                  <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-1 py-0.5 bg-bgDark rounded-md border border-cardBorder text-[9px] font-bold text-amber-400">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>{barber.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white truncate">{barber.name}</h3>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-neonPurple flex items-center justify-center text-white shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <span className="inline-block text-[10px] font-semibold text-neonPurpleLight mt-0.5">
                    {title}
                  </span>

                  <p className="text-[11px] text-textSecondary line-clamp-1 mt-0.5">
                    {specialties}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
