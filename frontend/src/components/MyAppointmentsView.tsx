import React from 'react';
import { Booking, Language } from '../types';
import { translations } from '../locales/translations';
import { Calendar, Clock, MapPin, User, Navigation, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

interface MyAppointmentsViewProps {
  bookings: Booking[];
  onCancelBooking: (id: number) => void;
  language: Language;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({
  bookings,
  onCancelBooking,
  language,
}) => {
  const t = translations[language];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            {t.statusConfirmed}
          </span>
        );
      case 'PENDING_CONFIRMATION':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
            {t.statusPending}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
            {t.statusCompleted}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 text-[10px] font-bold">
            {t.statusCancelled}
          </span>
        );
      case 'NO_SHOW':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
            {t.statusNoShow}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-white tracking-wide">{t.myBookings}</h2>
          <p className="text-xs text-textSecondary">Ваша история визитов и текущие брони</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="py-12 px-4 rounded-3xl bg-cardDark border border-cardBorder text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-textMuted mx-auto" />
          <p className="text-sm font-bold text-white">{t.noBookings}</p>
          <p className="text-xs text-textSecondary">
            Запишитесь на стрижку на главной вкладке в 3 клика
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            const isCompleted = booking.status === 'COMPLETED';

            return (
              <div
                key={booking.id}
                className={`rounded-2xl p-4 border transition-all ${
                  isCancelled
                    ? 'bg-black/30 border-white/5 opacity-60'
                    : 'glass-card hover:border-neonPurple/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono text-neonPurpleLight font-bold">
                      #{booking.bookingNumber}
                    </span>
                    <h3 className="text-sm font-bold text-white">{booking.branchNameRu}</h3>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="space-y-1.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-textSecondary">
                    <User className="w-3.5 h-3.5 text-neonPurpleLight shrink-0" />
                    <span>Мастер: <strong className="text-white">{booking.barberName}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-textSecondary">
                    <Clock className="w-3.5 h-3.5 text-statusGreen shrink-0" />
                    <span>
                      <strong className="text-statusGreen font-bold">{booking.bookingDate} в {booking.startTime}</strong>
                      <span className="text-textMuted"> ({booking.totalDurationMinutes} {t.min})</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-textSecondary">
                    <MapPin className="w-3.5 h-3.5 text-neonPurpleLight shrink-0" />
                    <span className="truncate">{booking.branchAddressRu}</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs font-bold border-t border-white/5">
                    <span className="text-textSecondary">Стоимость:</span>
                    <span className="text-white font-black">
                      {booking.totalPriceUzs.toLocaleString('ru-RU')} {t.sum}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {!isCancelled && !isCompleted && (
                  <div className="pt-2 flex items-center gap-2 border-t border-white/10">
                    <a
                      href={`https://yandex.uz/maps/?text=${encodeURIComponent(booking.branchAddressRu + ' Ташкент')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-cardDark border border-cardBorder hover:border-neonPurple text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                    >
                      <svg className="w-3.5 h-3.5 text-red-500 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span>{t.routeYandex}</span>
                    </a>

                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="py-2 px-3 rounded-xl bg-red-950/40 border border-red-500/30 hover:border-red-500 text-[11px] font-bold text-red-300 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t.cancelBookingBtn}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
