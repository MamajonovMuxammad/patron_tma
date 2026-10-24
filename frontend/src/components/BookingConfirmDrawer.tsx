import React, { useState } from 'react';
import { Branch, Barber, ServiceItem, Language } from '../types';
import { translations } from '../locales/translations';
import { X, Calendar, Clock, MapPin, User, Scissors, ShieldAlert } from 'lucide-react';

interface BookingConfirmDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch;
  barber: Barber | null;
  services: ServiceItem[];
  date: string;
  time: string;
  totalDuration: number;
  totalPrice: number;
  initialName: string;
  initialPhone: string;
  onConfirm: (clientName: string, clientPhone: string, notes: string) => Promise<void>;
  language: Language;
}

export const BookingConfirmDrawer: React.FC<BookingConfirmDrawerProps> = ({
  isOpen,
  onClose,
  branch,
  barber,
  services,
  date,
  time,
  totalDuration,
  totalPrice,
  initialName,
  initialPhone,
  onConfirm,
  language,
}) => {
  const t = translations[language];
  const [name, setName] = useState(initialName || '');
  const [phone, setPhone] = useState(initialPhone || '+998 ');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Uzbekistan Phone Formatter: +998 (90) 123-45-67
  const handlePhoneChange = (val: string) => {
    // Keep digits only
    const digits = val.replace(/\D/g, '');
    let formatted = '+998';

    if (digits.length <= 3) {
      setPhone('+998 ');
      return;
    }

    const rest = digits.startsWith('998') ? digits.slice(3) : digits;

    if (rest.length > 0) {
      formatted += ' (' + rest.slice(0, 2);
    }
    if (rest.length >= 2) {
      formatted += ') ' + rest.slice(2, 5);
    }
    if (rest.length >= 5) {
      formatted += '-' + rest.slice(5, 7);
    }
    if (rest.length >= 7) {
      formatted += '-' + rest.slice(7, 9);
    }

    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(language === 'ru' ? 'Пожалуйста, введите ваше имя' : 'Iltimos, ismingizni kiriting');
      return;
    }
    if (phone.replace(/\D/g, '').length < 12) {
      setError(language === 'ru' ? 'Введите корректный номер: +998 (XX) XXX-XX-XX' : 'Telefon raqamini to\'liq kiriting');
      return;
    }

    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    } catch {}

    setLoading(true);
    setError('');
    try {
      await onConfirm(name, phone, notes);
    } catch (err: any) {
      setError(err?.message || 'Ошибка записи');
    } finally {
      setLoading(false);
    }
  };

  const branchName = language === 'ru' ? branch.nameRu : branch.nameUz;
  const branchAddress = language === 'ru' ? branch.addressRu : branch.addressUz;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-cardDark border border-cardBorder rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neonPurple/20 border border-neonPurple/40 flex items-center justify-center text-neonPurpleLight">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{t.step5Title}</h3>
              <p className="text-[11px] text-textSecondary">Barbershop «PATRON»</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-textSecondary hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Appointment Card Summary */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cardBorder space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-textSecondary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neonPurpleLight" />
              <span>{branchName}</span>
            </span>
            <span className="text-textMuted">{branchAddress}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
            <span className="text-textSecondary flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neonPurpleLight" />
              <span>Мастер:</span>
            </span>
            <span className="font-bold text-white">
              {barber ? barber.name : t.anyBarber}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
            <span className="text-textSecondary flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neonPurpleLight" />
              <span>Дата и время:</span>
            </span>
            <span className="font-bold text-statusGreen">
              {date} в {time} ({totalDuration} {t.min})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
            <span className="text-textSecondary">Услуги:</span>
            <span className="text-white font-medium truncate max-w-[200px]">
              {services.map((s) => (language === 'ru' ? s.nameRu : s.nameUz)).join(' + ')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">
              {t.totalPrice}
            </span>
            <span className="text-base font-black text-white">
              {totalPrice.toLocaleString('ru-RU')} {t.sum}
            </span>
          </div>
        </div>

        {/* Client details form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-textSecondary mb-1">
              {t.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bgDark border border-cardBorder focus:border-neonPurple text-white text-sm outline-none transition-all placeholder:text-textMuted"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-textSecondary mb-1">
              {t.phoneLabel}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bgDark border border-cardBorder focus:border-neonPurple text-white text-sm font-mono outline-none transition-all placeholder:text-textMuted"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-textSecondary mb-1">
              {t.notesLabel}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bgDark border border-cardBorder focus:border-neonPurple text-white text-sm outline-none transition-all placeholder:text-textMuted"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-neonPurple to-purple-700 hover:from-purple-600 hover:to-neonPurple text-white font-extrabold text-sm shadow-glow-purple transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Бронирование...</span>
                </>
              ) : (
                <>
                  <span>
                    {t.bookBtn} • {totalPrice.toLocaleString('ru-RU')} {t.sum}
                  </span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-textMuted mt-2">
              🔒 Без предоплаты и SMS • Мгновенное подтверждение в Telegram
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
