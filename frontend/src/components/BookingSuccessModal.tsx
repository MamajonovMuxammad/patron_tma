import React from 'react';
import { Booking, Language } from '../types';
import { translations } from '../locales/translations';
import { CheckCircle2, Send, Navigation, BellRing } from 'lucide-react';

interface BookingSuccessModalProps {
  booking: Booking;
  onClose: () => void;
  language: Language;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  onClose,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-cardDark border border-cardBorder rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
        {/* Neon glow effect */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-neonPurple/20 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-statusGreen/10 border-2 border-statusGreen/30 flex items-center justify-center mx-auto shadow-glow-green text-statusGreen">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-neonPurple/20 text-neonPurpleLight border border-neonPurple/30 text-xs font-bold tracking-wider mb-1">
            БРОНЬ #{booking.bookingNumber}
          </span>
          <h3 className="text-lg font-black text-white">{t.bookingSuccessTitle}</h3>
          <p className="text-xs text-textSecondary mt-1">{t.bookingSuccessSub}</p>
        </div>

        {/* Telegram Bot Simulation Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-purple-950/40 border border-blue-500/30 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Bot @patron_99_tashkent_bot</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">
            {t.bookingTgNotice}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-200/80 pt-1 border-t border-blue-500/20">
            <BellRing className="w-3 h-3 text-statusGreen" />
            <span>Авто-напоминание с кнопками «Точно приду» / «Отмена»</span>
          </div>
        </div>

        {/* Appointment summary */}
        <div className="text-left text-xs bg-bgDark/80 p-3 rounded-xl border border-white/5 space-y-1">
          <div className="flex justify-between">
            <span className="text-textSecondary">Филиал:</span>
            <span className="font-semibold text-white">{booking.branchNameRu}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">Мастер:</span>
            <span className="font-semibold text-white">{booking.barberName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">Время:</span>
            <span className="font-bold text-statusGreen">
              {booking.bookingDate} в {booking.startTime}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {booking.branchAddressRu && (
            <a
              href={`https://yandex.uz/maps/?text=${encodeURIComponent(booking.branchAddressRu + ' Ташкент')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-cardDark border border-cardBorder hover:border-neonPurple text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-red-500 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>{t.routeYandex}</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-neonPurple hover:bg-neonPurpleHover text-white font-extrabold text-xs shadow-glow-purple transition-all active:scale-95"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
