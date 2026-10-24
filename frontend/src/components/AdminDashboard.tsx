import React, { useState } from 'react';
import { Branch, Barber, DashboardStats, Booking, Language } from '../types';
import { translations } from '../locales/translations';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  Zap,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  stats: DashboardStats;
  branches: Branch[];
  selectedBranchId: number;
  onSelectBranch: (id: number) => void;
  barbers: Barber[];
  onBlockWalkIn: (barberId: number, startTime: string, duration: number, notes: string) => Promise<void>;
  onUpdateStatus: (bookingId: number, status: string) => Promise<void>;
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  branches,
  selectedBranchId,
  onSelectBranch,
  barbers,
  onBlockWalkIn,
  onUpdateStatus,
  language,
}) => {
  const t = translations[language];
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInBarberId, setWalkInBarberId] = useState<number>(barbers[0]?.id || 101);
  const [walkInTime, setWalkInTime] = useState<string>('14:30');
  const [walkInDuration, setWalkInDuration] = useState<number>(45);
  const [walkInNotes, setWalkInNotes] = useState<string>('Клиент с улицы (живая очередь)');
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingWalkIn(true);
    try {
      await onBlockWalkIn(walkInBarberId, walkInTime, walkInDuration, walkInNotes);
      setShowWalkInModal(false);
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{t.statusConfirmed}</span>
          </span>
        );
      case 'PENDING_CONFIRMATION':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{t.statusPending}</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-purple-400" />
            <span>{t.statusCompleted}</span>
          </span>
        );
      case 'NO_SHOW':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>{t.statusNoShow}</span>
          </span>
        );
      case 'WALK_IN_BLOCKED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <Lock className="w-3 h-3 text-orange-400" />
            <span>{t.statusWalkIn}</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/40 text-[10px] font-extrabold">
            {t.statusCancelled}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Branch selector for admin */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {branches.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelectBranch(b.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedBranchId === b.id
                ? 'bg-neonPurple text-white shadow-glow-purple border border-neonPurpleLight'
                : 'bg-cardDark text-textSecondary hover:text-white border border-cardBorder'
            }`}
          >
            {b.nameRu.replace('Филиал ', '')}
          </button>
        ))}
      </div>

      {/* Quick Walk-in Slot Blocker Button */}
      <button
        onClick={() => setShowWalkInModal(true)}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-neonPurple to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-sm shadow-glow-purple transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-neonPurpleLight/40"
      >
        <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
        <span>{t.walkInBlockBtn}</span>
      </button>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="glass-card rounded-2xl p-3 space-y-1">
          <div className="flex items-center justify-between text-textSecondary">
            <span className="text-[11px] font-semibold">{t.adminStatBookings}</span>
            <Users className="w-4 h-4 text-neonPurpleLight" />
          </div>
          <p className="text-xl font-black text-white">{stats.totalBookings}</p>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <span>{stats.confirmedCount} подтверждено</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-3 space-y-1">
          <div className="flex items-center justify-between text-textSecondary">
            <span className="text-[11px] font-semibold">{t.adminStatRevenue}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-black text-white">
            {stats.expectedRevenueUzs.toLocaleString('ru-RU')}
          </p>
          <div className="text-[10px] text-textMuted font-medium">сум за сегодня</div>
        </div>

        <div className="glass-card rounded-2xl p-3 space-y-1">
          <div className="flex items-center justify-between text-textSecondary">
            <span className="text-[11px] font-semibold">{t.adminStatFreeSlots}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-black text-white">{stats.availableSlotsCount}</p>
          <div className="text-[10px] text-textMuted font-medium">окон в сетке</div>
        </div>

        <div className="glass-card rounded-2xl p-3 space-y-1">
          <div className="flex items-center justify-between text-textSecondary">
            <span className="text-[11px] font-semibold">{t.adminStatNoShows}</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-xl font-black text-white">{stats.noShowCount}</p>
          <div className="text-[10px] text-emerald-400 font-bold">Anti-No-Show активен</div>
        </div>
      </div>

      {/* Schedule / Master bookings list */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white">{t.scheduleTitle}</h3>
          <span className="text-xs text-textSecondary font-mono">{stats.date}</span>
        </div>

        <div className="space-y-2.5">
          {stats.bookings.map((booking) => (
            <div
              key={booking.id}
              className="glass-card rounded-2xl p-3.5 space-y-2.5 border border-cardBorder hover:border-neonPurple/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">
                      {booking.startTime} – {booking.endTime}
                    </span>
                    <span className="text-[11px] font-mono text-neonPurpleLight font-bold">
                      #{booking.bookingNumber}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-200 mt-0.5">
                    {booking.clientName}
                  </p>
                  {booking.clientPhone && (
                    <p className="text-[11px] font-mono text-textMuted">{booking.clientPhone}</p>
                  )}
                </div>

                <div>{getStatusBadge(booking.status)}</div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                <span className="text-textSecondary">
                  Мастер: <strong className="text-white">{booking.barberName}</strong>
                </span>
                <span className="font-extrabold text-white">
                  {booking.totalPriceUzs.toLocaleString('ru-RU')} сум
                </span>
              </div>

              {booking.notes && (
                <div className="text-[11px] text-amber-300/90 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                  💬 {booking.notes}
                </div>
              )}

              {/* Admin Action Buttons */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-white/10">
                {booking.clientPhone && !booking.isWalkIn && (
                  <a
                    href={`tel:${booking.clientPhone.replace(/\s+/g, '')}`}
                    className="p-2 rounded-xl bg-cardDark border border-cardBorder text-textSecondary hover:text-white hover:border-neonPurple transition-all"
                    title={t.callClient}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}

                {booking.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onUpdateStatus(booking.id, 'COMPLETED')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900 text-purple-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <CheckCircle className="w-3 h-3 text-purple-400" />
                    <span>{t.markCompleted}</span>
                  </button>
                )}

                {booking.status !== 'NO_SHOW' && booking.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onUpdateStatus(booking.id, 'NO_SHOW')}
                    className="py-1.5 px-2.5 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-red-300 font-bold text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span>{t.markNoShow}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Walk-in blocker modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-cardDark border border-cardBorder rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="text-sm font-extrabold text-white">
                  {t.walkInBlockModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-textSecondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-textSecondary mb-1">
                  {t.walkInBarberLabel}
                </label>
                <select
                  value={walkInBarberId}
                  onChange={(e) => setWalkInBarberId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-bgDark border border-cardBorder text-white text-xs outline-none"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.titleRu})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-textSecondary mb-1">
                    {t.walkInTimeLabel}
                  </label>
                  <input
                    type="time"
                    value={walkInTime}
                    onChange={(e) => setWalkInTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-bgDark border border-cardBorder text-white text-xs outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-textSecondary mb-1">
                    {t.walkInDurationLabel}
                  </label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    max="180"
                    value={walkInDuration}
                    onChange={(e) => setWalkInDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-bgDark border border-cardBorder text-white text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary mb-1">
                  Примечание:
                </label>
                <input
                  type="text"
                  value={walkInNotes}
                  onChange={(e) => setWalkInNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-bgDark border border-cardBorder text-white text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-textSecondary text-xs font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submittingWalkIn}
                  className="flex-1 py-2.5 rounded-xl bg-neonPurple hover:bg-neonPurpleHover text-white text-xs font-extrabold shadow-glow-purple disabled:opacity-50"
                >
                  {submittingWalkIn ? 'Блокировка...' : t.walkInBlockConfirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
