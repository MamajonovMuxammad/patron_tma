import React from 'react';
import { Branch, Language } from '../types';
import { translations } from '../locales/translations';
import { InteractiveMap } from './InteractiveMap';
import { QuickSeatBanner } from './QuickSeatBanner';
import { MapPin, Phone, Clock, Navigation, Scissors, Star, CheckCircle, ChevronRight } from 'lucide-react';

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

      {/* Interactive Map */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-extrabold text-white tracking-wide">
              {language === 'ru' ? 'Карта филиалов в Ташкенте' : 'Toshkent filiallari xaritasi'}
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">Нажмите на маркер</span>
        </div>

        <InteractiveMap
          branches={branches}
          selectedBranch={selectedBranch}
          onSelectBranch={onSelectBranch}
          language={language}
        />
      </div>

      {/* Selected Branch Highlight Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18181D] via-[#141418] to-[#0E0E12] border border-purple-500/40 p-4 shadow-2xl space-y-3">
        <div className="flex gap-3.5">
          <img
            src={selectedBranch.photoUrl}
            alt={selectedBranch.nameRu}
            className="w-24 h-24 rounded-2xl object-cover border border-purple-500/30 shrink-0"
          />

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                {language === 'ru' ? 'Выбранный филиал' : 'Tanlangan filial'}
              </span>
            </div>

            <h3 className="text-base font-black text-white truncate">
              {language === 'ru' ? selectedBranch.nameRu : selectedBranch.nameUz}
            </h3>

            <div className="flex items-center gap-1 text-xs text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">
                {language === 'ru' ? selectedBranch.addressRu : selectedBranch.addressUz}
              </span>
            </div>

            <p className="text-[11px] text-zinc-400">
              {language === 'ru' ? selectedBranch.landmarkRu : selectedBranch.landmarkUz}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">09:00 – 21:00</span>
            <span className="text-[10px] text-emerald-400 font-bold">• Открыто</span>
          </div>

          <a
            href={`tel:${selectedBranch.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{selectedBranch.phone}</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onStartBooking(selectedBranch)}
            className="col-span-2 py-3 px-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/40 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Scissors className="w-4 h-4 stroke-[2.5]" />
            <span>{language === 'ru' ? 'Записаться сюда' : 'Shu filialga yozilish'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {selectedBranch.mapUrl2Gis && (
            <a
              href={selectedBranch.mapUrl2Gis}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-2 rounded-2xl bg-[#1E1E24] hover:bg-zinc-800 border border-purple-500/30 text-xs font-bold text-white flex items-center justify-center gap-1 transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-purple-400" />
              <span>2GIS</span>
            </a>
          )}
        </div>
      </div>

      {/* All 3 Branches List */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-1">
          {language === 'ru' ? 'Все 3 филиала PATRON' : 'PATRON ning barcha 3 filiali'}
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {branches.map((b) => {
            const isCurrent = selectedBranch.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => onSelectBranch(b)}
                className={`cursor-pointer rounded-2xl p-3.5 transition-all duration-200 border flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#18181D] border-purple-500 shadow-lg shadow-purple-500/10'
                    : 'bg-[#141418]/80 hover:bg-[#18181D] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                    <img src={b.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {language === 'ru' ? b.nameRu : b.nameUz}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">
                      {language === 'ru' ? b.addressRu : b.addressUz}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartBooking(b);
                  }}
                  className={`shrink-0 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {language === 'ru' ? 'Выбрать' : 'Tanlash'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Perks / Features */}
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
