import React from 'react';
import { Branch, Language } from '../types';
import { translations } from '../locales/translations';
import { QuickSeatBanner } from './QuickSeatBanner';
import { MapPin, Phone, Clock, Scissors, Star, ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react';

interface HomeScreenProps {
  branches: Branch[];
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
  onStartBooking: (branch?: Branch) => void;
  language: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  branches,
  selectedBranch,
  onSelectBranch,
  onStartBooking,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-4 animate-fadeIn pb-8">
      {/* Quick Seat Banner */}
      <QuickSeatBanner
        language={language}
        onQuickBook={() => onStartBooking(branches[0])}
      />

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1828] via-[#141418] to-[#0A0A0C] border border-purple-500/30 p-5 shadow-2xl">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider">
              Barbershop • Tashkent
            </span>
            <div className="flex items-center text-amber-400 text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-current mr-1" />
              <span>4.95 (500+ отзывов)</span>
            </div>
          </div>

          <h1 className="text-xl font-black text-white leading-tight">
            Сеть премиальных барбершопов <span className="text-purple-400">«PATRON»</span>
          </h1>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {language === 'ru'
              ? '3 филиала в Ташкенте. Мужские модельные стрижки, оформление бороды и премиальный уход без очередей.'
              : 'Toshkentda 3 ta filial. Erkaklar soch turmagi, soqol tekislash va premium parvarish navbatlarsiz.'}
          </p>

          <div className="pt-2">
            <button
              onClick={() => onStartBooking()}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Scissors className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'ru' ? 'Онлайн-запись в 3 клика' : 'Online yozilish (3 bosqichda)'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3 Branches Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {language === 'ru' ? 'Наши филиалы в Ташкенте (3 точки)' : 'Toshkentdagi filiallarimiz'}
            </h2>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">09:00 – 21:00</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {branches.map((branch) => {
            const isCurrent = selectedBranch.id === branch.id;
            const branchName = language === 'ru' ? branch.nameRu : branch.nameUz;
            const branchAddress = language === 'ru' ? branch.addressRu : branch.addressUz;
            const landmark = language === 'ru' ? branch.landmarkRu : branch.landmarkUz;

            return (
              <div
                key={branch.id}
                onClick={() => onSelectBranch(branch)}
                className={`cursor-pointer rounded-3xl p-4 transition-all duration-300 border flex flex-col justify-between gap-3 shadow-xl ${
                  isCurrent
                    ? 'bg-gradient-to-br from-[#1C1828] via-[#141418] to-[#121018] border-purple-500 ring-1 ring-purple-500/40'
                    : 'bg-[#141418] hover:bg-[#18181D] border-zinc-800/90 hover:border-zinc-700'
                }`}
              >
                {/* Branch Header with Photo */}
                <div className="flex gap-3.5">
                  <img
                    src={branch.photoUrl}
                    alt={branchName}
                    className="w-20 h-20 rounded-2xl object-cover border border-purple-500/30 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-white truncate">{branchName}</h3>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold shrink-0">
                          Выбран
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{branchAddress}</span>
                    </div>

                    {landmark && (
                      <p className="text-[11px] text-zinc-400 truncate">{landmark}</p>
                    )}
                  </div>
                </div>

                {/* Info Bar: Hours & Phone */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold">09:00 – 21:00</span>
                    <span className="text-[10px] text-emerald-400 font-bold">• Без выходных</span>
                  </div>

                  <a
                    href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{branch.phone}</span>
                  </a>
                </div>

                {/* Bottom Action Buttons: Yandex Maps + Booking Button */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                  {branch.mapUrlYandex && (
                    <a
                      href={branch.mapUrlYandex}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="py-2.5 px-2 rounded-xl bg-[#1C1C24] hover:bg-zinc-800 border border-zinc-700/80 hover:border-purple-500/60 text-xs font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                    >
                      <svg className="w-3.5 h-3.5 text-red-500 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span className="truncate">{language === 'ru' ? 'Яндекс.Карты' : 'Yandeks Xarita'}</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                    </a>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartBooking(branch);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{language === 'ru' ? 'Записаться сюда' : 'Yozilish'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Perks Badge Row */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="p-3 rounded-2xl bg-[#141418] border border-zinc-800/80 text-center space-y-1">
          <div className="flex items-center justify-center text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-black ml-1 text-white">4.95</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">Рейтинг гостей</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#141418] border border-zinc-800/80 text-center space-y-1">
          <div className="text-xs font-black text-purple-400">9 мастеров</div>
          <p className="text-[10px] text-zinc-400 font-medium">Top & Senior</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#141418] border border-zinc-800/80 text-center space-y-1">
          <div className="text-xs font-black text-emerald-400">0$ SMS</div>
          <p className="text-[10px] text-zinc-400 font-medium">Telegram бот</p>
        </div>
      </div>
    </div>
  );
};
