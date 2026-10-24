import React, { useState, useMemo } from 'react';
import { BarberAuthUser, Booking, Language } from '../types';
import { translations } from '../locales/translations';
import { api, INITIAL_BRANCHES } from '../api/client';
import {
  UserCheck,
  Lock,
  LogOut,
  Calendar,
  Clock,
  DollarSign,
  Phone,
  CheckCircle,
  XCircle,
  Zap,
  ShieldCheck,
  Star,
  Users,
  X
} from 'lucide-react';

interface BarberWorkspaceScreenProps {
  currentUser: BarberAuthUser | null;
  onLogin: (user: BarberAuthUser) => void;
  onLogout: () => void;
  bookings: Booking[];
  onUpdateStatus: (bookingId: number, status: string) => Promise<void>;
  onBlockWalkIn: (barberId: number, startTime: string, duration: number, notes: string) => Promise<void>;
  language: Language;
}

export const BarberWorkspaceScreen: React.FC<BarberWorkspaceScreenProps> = ({
  currentUser,
  onLogin,
  onLogout,
  bookings,
  onUpdateStatus,
  onBlockWalkIn,
  language,
}) => {
  const t = translations[language];

  // Auth Form State
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Walk-in modal
  const [showWalkInModal, setShowWalkInModal] = useState<boolean>(false);
  const [walkInTime, setWalkInTime] = useState<string>('15:00');
  const [walkInDuration, setWalkInDuration] = useState<number>(45);
  const [walkInNotes, setWalkInNotes] = useState<string>('Клиент с улицы (живая очередь)');
  const [submittingWalkIn, setSubmittingWalkIn] = useState<boolean>(false);

  // Demo Accounts Database
  const demoAccounts: {
    username: string;
    pass: string;
    user: BarberAuthUser;
  }[] = [
    {
      username: 'shohaziz',
      pass: 'patron2026',
      user: {
        id: 1,
        barberId: 101,
        name: 'Шохазиз',
        titleRu: 'Top Barber',
        titleUz: 'Bosh Sartarosh',
        branchId: 1,
        branchNameRu: 'Максим Горький',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        rating: 5.0,
        role: 'barber',
      },
    },
    {
      username: 'sayfulla',
      pass: 'patron2026',
      user: {
        id: 2,
        barberId: 102,
        name: 'Сайфулла',
        titleRu: 'Senior Barber',
        titleUz: 'Katta Sartarosh',
        branchId: 1,
        branchNameRu: 'Максим Горький',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        rating: 4.95,
        role: 'barber',
      },
    },
    {
      username: 'sardor',
      pass: 'patron2026',
      user: {
        id: 3,
        barberId: 103,
        name: 'Сардор',
        titleRu: 'Barber',
        titleUz: 'Sartarosh',
        branchId: 1,
        branchNameRu: 'Максим Горький',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        rating: 4.9,
        role: 'barber',
      },
    },
    {
      username: 'zhavohir',
      pass: 'patron2026',
      user: {
        id: 4,
        barberId: 201,
        name: 'Жавохир',
        titleRu: 'Top Barber',
        titleUz: 'Bosh Sartarosh',
        branchId: 2,
        branchNameRu: 'Карасув',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        rating: 5.0,
        role: 'barber',
      },
    },
    {
      username: 'admin',
      pass: 'patron2026',
      user: {
        id: 99,
        barberId: 0,
        name: 'Главный Администратор',
        titleRu: 'Администратор сети',
        titleUz: 'Bosh Administrator',
        branchId: 1,
        branchNameRu: 'Все филиалы PATRON',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        rating: 5.0,
        role: 'admin',
      },
    },
  ];

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = demoAccounts.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.pass === password
    );

    if (found) {
      setAuthError('');
      onLogin(found.user);
    } else {
      setAuthError(language === 'ru' ? 'Неверный логин или пароль (тестовый: patron2026)' : 'Login yoki parol noto\'g\'ri');
    }
  };

  const handleQuickDemoLogin = (acc: typeof demoAccounts[0]) => {
    onLogin(acc.user);
  };

  // Filter bookings strictly for the logged-in barber
  const barberBookings = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') {
      return bookings;
    }
    return bookings.filter(
      (b) => b.barberId === currentUser.barberId || (b.barberName && b.barberName.includes(currentUser.name))
    );
  }, [currentUser, bookings]);

  // Personal statistics
  const stats = useMemo(() => {
    let completedRev = 0;
    let expectedRev = 0;
    let completed = 0;
    let confirmed = 0;
    let noShows = 0;

    barberBookings.forEach((b) => {
      if (b.status === 'COMPLETED') {
        completed++;
        completedRev += b.totalPriceUzs;
      } else if (b.status === 'CONFIRMED') {
        confirmed++;
      } else if (b.status === 'NO_SHOW') {
        noShows++;
      }
      if (b.status !== 'CANCELLED' && b.status !== 'NO_SHOW') {
        expectedRev += b.totalPriceUzs;
      }
    });

    return {
      total: barberBookings.length,
      completedRev,
      expectedRev,
      confirmed,
      completed,
      noShows,
    };
  }, [barberBookings]);

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmittingWalkIn(true);
    try {
      const bId = currentUser.barberId || 101;
      await onBlockWalkIn(bId, walkInTime, walkInDuration, walkInNotes);
      setShowWalkInModal(false);
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Подтвердил в ТГ</span>
          </span>
        );
      case 'PENDING_CONFIRMATION':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Ожидает</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-purple-400" />
            <span>Завершено</span>
          </span>
        );
      case 'NO_SHOW':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>Не явился</span>
          </span>
        );
      case 'WALK_IN_BLOCKED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-extrabold flex items-center gap-1">
            <Zap className="w-3 h-3 text-orange-400 fill-orange-400" />
            <span>Живая очередь</span>
          </span>
        );
      default:
        return null;
    }
  };

  // If user NOT logged in: Show Login Form + 1-Tap Demo Buttons
  if (!currentUser) {
    return (
      <div className="space-y-5 animate-fadeIn pb-16">
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-purple-600/30 text-white">
            <UserCheck className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-white">Вход для мастеров PATRON</h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Личный график, персональные заявки клиентов и управление живой очередью
          </p>
        </div>

        {/* 1-Tap Quick Demo Logins */}
        <div className="rounded-3xl bg-[#141418] border border-purple-500/30 p-4 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-purple-400">
              Быстрый вход для проверки (в 1 клик):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.username}
                onClick={() => handleQuickDemoLogin(acc)}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#1A1A20] hover:bg-purple-950/40 border border-zinc-800 hover:border-purple-500/50 transition-all text-left group"
              >
                <img
                  src={acc.user.avatarUrl}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-purple-500/30 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300">
                      {acc.user.name}
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-400">5.0★</span>
                  </div>
                  <span className="block text-[10px] text-zinc-400 truncate">
                    {acc.user.titleRu} • {acc.user.branchNameRu}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleManualLogin} className="rounded-3xl bg-[#141418] border border-zinc-800 p-4 space-y-3 shadow-xl">
          <span className="block text-xs font-bold text-zinc-400">
            Или введите логин и пароль:
          </span>

          {authError && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
              ⚠️ {authError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Логин барбера:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Например: shohaziz"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 focus:border-purple-500 text-white text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="patron2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 focus:border-purple-500 text-white text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            Войти в рабочий кабинет
          </button>
        </form>
      </div>
    );
  }

  // If user IS logged in: Show Barber Personal Dashboard
  return (
    <div className="space-y-4 animate-fadeIn pb-16">
      {/* Barber Profile Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/50 via-[#18181D] to-[#141418] border border-purple-500/40 p-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-purple-500 shadow-md"
                style={{ width: '52px', height: '52px' }}
              />
              <span className="absolute -bottom-1 -right-1 flex items-center px-1 rounded-md bg-[#09090B] border border-amber-500/40 text-[9px] font-bold text-amber-400">
                <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                {currentUser.rating}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{currentUser.name}</h3>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                  {currentUser.titleRu}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{currentUser.branchNameRu}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all"
            title="Выйти"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Walk-in Blocker Button specifically for THIS barber */}
      <button
        onClick={() => setShowWalkInModal(true)}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 border border-purple-400/40"
      >
        <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
        <span>⚡ Закрыть окно (Сел клиент из живой очереди)</span>
      </button>

      {/* Personal Barber Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-[#141418] border border-zinc-800 p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Клиенты</span>
          <p className="text-lg font-black text-white">{stats.total}</p>
          <span className="text-[9px] text-emerald-400 font-semibold">{stats.confirmed} подтвержд.</span>
        </div>

        <div className="rounded-2xl bg-[#141418] border border-zinc-800 p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Касса</span>
          <p className="text-sm font-black text-purple-300 truncate">
            {stats.expectedRev.toLocaleString('ru-RU')}
          </p>
          <span className="text-[9px] text-zinc-400">сум за смену</span>
        </div>

        <div className="rounded-2xl bg-[#141418] border border-zinc-800 p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Неявки</span>
          <p className="text-lg font-black text-emerald-400">{stats.noShows}</p>
          <span className="text-[9px] text-zinc-400 font-semibold">Anti-No-Show</span>
        </div>
      </div>

      {/* Barber's Bookings Feed */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
            Заявки к мастеру ({barberBookings.length}):
          </h4>
          <span className="text-[11px] font-mono text-purple-400">Сегодня</span>
        </div>

        {barberBookings.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#141418] border border-zinc-800 text-center text-xs text-zinc-400 space-y-1">
            <Calendar className="w-6 h-6 mx-auto text-zinc-500 mb-2" />
            <p className="font-bold text-white">У вас пока нет записей на сегодня</p>
            <p>Новые онлайн-заявки от клиентов появятся здесь автоматически</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {barberBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl bg-[#141418] border border-zinc-800 hover:border-purple-500/40 p-4 space-y-3 shadow-xl transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white">
                        {booking.startTime} – {booking.endTime}
                      </span>
                      <span className="text-[10px] font-mono text-purple-400 font-bold">
                        #{booking.bookingNumber}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-zinc-200 mt-0.5">
                      {booking.clientName}
                    </h5>

                    {booking.clientPhone && (
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">
                        {booking.clientPhone}
                      </p>
                    )}
                  </div>

                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-zinc-400">Стоимость:</span>
                  <span className="font-black text-white">
                    {booking.totalPriceUzs.toLocaleString('ru-RU')} сум
                  </span>
                </div>

                {booking.notes && (
                  <div className="text-[11px] text-amber-300 bg-amber-950/20 p-2 rounded-xl border border-amber-500/20">
                    💬 {booking.notes}
                  </div>
                )}

                {/* Barber Action Buttons */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                  {booking.clientPhone && !booking.isWalkIn && (
                    <a
                      href={`tel:${booking.clientPhone.replace(/\s+/g, '')}`}
                      className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:border-purple-500 transition-all"
                      title="Позвонить клиенту"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {booking.status !== 'COMPLETED' && (
                    <button
                      onClick={() => onUpdateStatus(booking.id, 'COMPLETED')}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                      <span>Пришел / Завершить</span>
                    </button>
                  )}

                  {booking.status !== 'NO_SHOW' && booking.status !== 'COMPLETED' && (
                    <button
                      onClick={() => onUpdateStatus(booking.id, 'NO_SHOW')}
                      className="py-2 px-3 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Не явился</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Walk-in Blocker Modal for this Barber */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#141418] border border-purple-500/40 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h4 className="text-sm font-black text-white">
                  Закрыть слот (Клиент с улицы)
                </h4>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-3">
              <p className="text-xs text-zinc-300">
                Мастер: <strong className="text-purple-300">{currentUser.name}</strong>
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Время начала:
                  </label>
                  <input
                    type="time"
                    value={walkInTime}
                    onChange={(e) => setWalkInTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-xs outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Минут:
                  </label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    max="180"
                    value={walkInDuration}
                    onChange={(e) => setWalkInDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Примечание:
                </label>
                <input
                  type="text"
                  value={walkInNotes}
                  onChange={(e) => setWalkInNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={submittingWalkIn}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 disabled:opacity-50"
                >
                  {submittingWalkIn ? 'Блокировка...' : 'Заблокировать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
