import React, { useMemo } from 'react';
import { Slot, Language } from '../types';
import { translations } from '../locales/translations';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface TimeSlotPickerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  slots: Slot[];
  selectedSlotTime: string | null;
  onSelectSlot: (time: string) => void;
  language: Language;
  loadingSlots: boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  onSelectDate,
  slots,
  selectedSlotTime,
  onSelectSlot,
  language,
  loadingSlots,
}) => {
  const t = translations[language];

  // 7 days ahead
  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayNum = d.getDate();
      const monthNamesRu = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
      const monthNamesUz = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];
      const weekDaysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      const weekDaysUz = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

      const month = language === 'ru' ? monthNamesRu[d.getMonth()] : monthNamesUz[d.getMonth()];
      const weekDay = language === 'ru' ? weekDaysRu[d.getDay()] : weekDaysUz[d.getDay()];

      let label = `${dayNum} ${month}`;
      if (i === 0) label = language === 'ru' ? 'Сегодня' : 'Bugun';
      else if (i === 1) label = language === 'ru' ? 'Завтра' : 'Ertaga';

      list.push({ iso, label, weekDay, dayNum });
    }
    return list;
  }, [language]);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-extrabold text-white tracking-wide">{t.step4Title}</h2>
        <p className="text-xs text-textSecondary">{t.step4Subtitle}</p>
      </div>

      {/* Horizontal Date Picker */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {dates.map((item) => {
          const isSelected = selectedDate === item.iso;
          return (
            <button
              key={item.iso}
              onClick={() => onSelectDate(item.iso)}
              className={`shrink-0 flex flex-col items-center justify-center min-w-[72px] py-2 px-2.5 rounded-2xl border transition-all active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-b from-neonPurple to-purple-800 border-neonPurple text-white shadow-glow-purple'
                  : 'bg-cardDark border-cardBorder text-textSecondary hover:border-cardBorder/80'
              }`}
            >
              <span className="text-[11px] font-semibold opacity-90">{item.weekDay}</span>
              <span className="text-base font-extrabold">{item.dayNum}</span>
              <span className="text-[10px] font-medium opacity-80 truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time Slots Grid */}
      <div className="pt-1">
        {loadingSlots ? (
          <div className="py-8 text-center text-xs text-textSecondary">
            <div className="w-6 h-6 border-2 border-neonPurple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Загрузка свободных окон...</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="py-6 px-4 rounded-2xl bg-cardDark border border-cardBorder text-center text-xs text-textSecondary flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>На выбранную дату нет свободных слотов</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlotTime === slot.time;
              const isAvailable = slot.available;

              return (
                <button
                  key={slot.time}
                  disabled={!isAvailable}
                  onClick={() => onSelectSlot(slot.time)}
                  className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all relative ${
                    isSelected
                      ? 'bg-neonPurple text-white shadow-glow-purple border border-neonPurpleLight active:scale-95'
                      : isAvailable
                      ? 'bg-cardDark hover:border-neonPurple/50 border border-cardBorder text-white hover:bg-cardDark/80 active:scale-95'
                      : 'bg-black/30 border border-white/5 text-textMuted/40 line-through cursor-not-allowed'
                  }`}
                >
                  <span>{slot.time}</span>
                  {isAvailable && slot.barberName && (
                    <span className="block text-[9px] font-normal truncate opacity-70">
                      {slot.barberName}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
