import React, { useState, useMemo, useEffect } from 'react';
import { Branch, Barber, ServiceItem, Slot, Booking, Language, TelegramUser } from '../types';
import { translations } from '../locales/translations';
import { api } from '../api/client';
import { BranchSelector } from './BranchSelector';
import { ServiceSelector } from './ServiceSelector';
import { BarberSelector } from './BarberSelector';
import { TimeSlotPicker } from './TimeSlotPicker';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Clock,
  MapPin,
  User,
  Scissors,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface BookingWizardProps {
  branches: Branch[];
  initialBranch: Branch;
  services: ServiceItem[];
  allBarbers: Record<number, Barber[]>;
  tgUser: TelegramUser | null;
  onBookingCreated: (booking: Booking) => void;
  language: Language;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  branches,
  initialBranch,
  services,
  allBarbers,
  tgUser,
  onBookingCreated,
  language,
}) => {
  const t = translations[language];

  // Steps: 1: Branch, 2: Services, 3: Barber, 4: DateTime, 5: ClientDetails
  const [step, setStep] = useState<number>(1);

  const [selectedBranch, setSelectedBranch] = useState<Branch>(initialBranch);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([1]); // default: Мужская стрижка
  const [barbersList, setBarbersList] = useState<Barber[]>(allBarbers[initialBranch.id] || allBarbers[1] || []);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>('14:30');
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Client form
  const [clientName, setClientName] = useState<string>(tgUser?.first_name || '');
  const [clientPhone, setClientPhone] = useState<string>('+998 ');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Update barbers when branch changes
  useEffect(() => {
    api.getBarbers(selectedBranch.id).then((bList) => {
      setBarbersList(bList);
      setSelectedBarber(null);
    });
  }, [selectedBranch]);

  // Calculations
  const selectedServices = useMemo(() => {
    return services.filter((s) => selectedServiceIds.includes(s.id));
  }, [services, selectedServiceIds]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((acc, curr) => acc + curr.durationMinutes, 0) || 45;
  }, [selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((acc, curr) => acc + curr.priceUzs, 0) || 100000;
  }, [selectedServices]);

  // Load slots when on step 4 or parameters change
  useEffect(() => {
    if (step >= 4) {
      setLoadingSlots(true);
      api.getSlots(selectedBranch.id, selectedBarber?.id || null, selectedDate, totalDuration)
        .then((res) => {
          setSlots(res);
          const currentValid = res.find((s) => s.time === selectedSlotTime && s.available);
          if (!currentValid) {
            const firstAvailable = res.find((s) => s.available);
            setSelectedSlotTime(firstAvailable ? firstAvailable.time : null);
          }
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [step, selectedBranch, selectedBarber, selectedDate, totalDuration]);

  // Haptic feedback
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
    } catch {}
  };

  const handleToggleService = (id: number) => {
    triggerHaptic('light');
    setSelectedServiceIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Phone input mask +998 (__) ___-__-__
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    let formatted = '+998';
    if (digits.length <= 3) {
      setClientPhone('+998 ');
      return;
    }
    const rest = digits.startsWith('998') ? digits.slice(3) : digits;
    if (rest.length > 0) formatted += ' (' + rest.slice(0, 2);
    if (rest.length >= 2) formatted += ') ' + rest.slice(2, 5);
    if (rest.length >= 5) formatted += '-' + rest.slice(5, 7);
    if (rest.length >= 7) formatted += '-' + rest.slice(7, 9);
    setClientPhone(formatted);
  };

  // Handle final submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMessage(language === 'ru' ? 'Введите ваше имя' : 'Ismingizni kiriting');
      return;
    }
    if (clientPhone.replace(/\D/g, '').length < 12) {
      setErrorMessage(
        language === 'ru' ? 'Введите номер телефона в формате +998 (XX) XXX-XX-XX' : 'Telefon raqamini to\'liq kiriting'
      );
      return;
    }
    if (!selectedSlotTime) {
      setErrorMessage(language === 'ru' ? 'Выберите свободное время' : 'Vaqtni tanlang');
      return;
    }

    triggerHaptic('heavy');
    setSubmitting(true);
    setErrorMessage('');

    try {
      const created = await api.createBooking({
        branchId: selectedBranch.id,
        barberId: selectedBarber?.id || null,
        serviceIds: selectedServiceIds,
        bookingDate: selectedDate,
        startTime: selectedSlotTime,
        clientName,
        clientPhone,
        clientTelegramId: tgUser?.id,
        clientTelegramUsername: tgUser?.username,
        notes,
      });

      onBookingCreated(created);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ошибка бронирования');
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = [
    { num: 1, label: language === 'ru' ? 'Филиал' : 'Filial' },
    { num: 2, label: language === 'ru' ? 'Услуги' : 'Xizmatlar' },
    { num: 3, label: language === 'ru' ? 'Мастер' : 'Usta' },
    { num: 4, label: language === 'ru' ? 'Время' : 'Vaqt' },
    { num: 5, label: language === 'ru' ? 'Детали' : 'Tasdiq' },
  ];

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Top Step Progress Bar */}
      <div className="rounded-2xl bg-[#141418] border border-purple-500/20 p-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          {stepTitles.map((item, idx) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;

            return (
              <React.Fragment key={item.num}>
                <div
                  onClick={() => {
                    if (isCompleted) {
                      triggerHaptic('light');
                      setStep(item.num);
                    }
                  }}
                  className={`flex items-center gap-1.5 cursor-pointer ${
                    isCompleted ? 'opacity-80 hover:opacity-100' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-black'
                        : isCurrent
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400/50 shadow-md shadow-purple-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : item.num}
                  </div>
                  <span
                    className={`text-[10px] font-bold hidden sm:inline ${
                      isCurrent ? 'text-white' : 'text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < stepTitles.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${
                      step > item.num ? 'bg-emerald-500/70' : 'bg-zinc-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Navigation Header for Step */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => {
            if (step > 1) {
              triggerHaptic('light');
              setStep((s) => s - 1);
            }
          }}
          disabled={step === 1}
          className={`flex items-center gap-1 text-xs font-bold transition-all ${
            step > 1 ? 'text-purple-400 hover:text-white' : 'text-transparent pointer-events-none'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ru' ? 'Назад' : 'Orqaga'}</span>
        </button>

        <span className="text-xs font-black uppercase tracking-wider text-purple-400">
          Шаг {step} из 5
        </span>
      </div>

      {/* STEP 1: Branch Selection */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <BranchSelector
            branches={branches}
            selectedBranch={selectedBranch}
            onSelect={(b) => {
              triggerHaptic('light');
              setSelectedBranch(b);
            }}
            language={language}
          />

          <button
            onClick={() => {
              triggerHaptic('medium');
              setStep(2);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>{language === 'ru' ? 'Далее: Выбрать услуги' : 'Keyingisi: Xizmatlar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Service Selection */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <ServiceSelector
            services={services}
            selectedServiceIds={selectedServiceIds}
            onToggleService={handleToggleService}
            language={language}
          />

          {/* Sticky Summary Card */}
          <div className="p-3.5 rounded-2xl bg-[#141418] border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">
                {language === 'ru' ? 'Выбрано услуг:' : 'Tanlangan:'} {selectedServiceIds.length}
              </span>
              <div className="text-base font-black text-white">
                {totalPrice.toLocaleString('ru-RU')} {t.sum}
                <span className="text-xs text-zinc-400 font-normal ml-1">
                  ({totalDuration} {t.min})
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('medium');
                setStep(3);
              }}
              className="py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>{language === 'ru' ? 'Далее' : 'Keyingisi'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Barber Selection */}
      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <BarberSelector
            barbers={barbersList}
            selectedBarber={selectedBarber}
            onSelect={(b) => {
              triggerHaptic('light');
              setSelectedBarber(b);
            }}
            language={language}
          />

          <button
            onClick={() => {
              triggerHaptic('medium');
              setStep(4);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>{language === 'ru' ? 'Далее: Выбрать дату и время' : 'Keyingisi: Sana va vaqt'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: Date & Time Slots */}
      {step === 4 && (
        <div className="space-y-4 animate-fadeIn">
          <TimeSlotPicker
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              triggerHaptic('light');
              setSelectedDate(d);
            }}
            slots={slots}
            selectedSlotTime={selectedSlotTime}
            onSelectSlot={(slot) => {
              triggerHaptic('medium');
              setSelectedSlotTime(slot);
            }}
            language={language}
            loadingSlots={loadingSlots}
          />

          <button
            disabled={!selectedSlotTime}
            onClick={() => {
              triggerHaptic('medium');
              setStep(5);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>{language === 'ru' ? 'Далее: Контакты' : 'Keyingisi: Aloqa'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 5: Details & Confirmation */}
      {step === 5 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Summary Checklist */}
          <div className="rounded-3xl bg-[#141418] border border-purple-500/30 p-4 space-y-3 shadow-xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{language === 'ru' ? 'Проверьте детали визита' : 'Tashrif ma\'lumotlari'}</span>
            </h3>

            <div className="space-y-2 text-xs divide-y divide-white/5">
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Филиал:</span>
                <span className="font-bold text-white text-right">
                  {language === 'ru' ? selectedBranch.nameRu : selectedBranch.nameUz}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Мастер:</span>
                <span className="font-bold text-purple-300">
                  {selectedBarber ? selectedBarber.name : t.anyBarber}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Дата и время:</span>
                <span className="font-bold text-emerald-400">
                  {selectedDate} в {selectedSlotTime} ({totalDuration} {t.min})
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Услуги:</span>
                <span className="font-medium text-white text-right truncate max-w-[200px]">
                  {selectedServices.map((s) => (language === 'ru' ? s.nameRu : s.nameUz)).join(', ')}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-xs font-black uppercase text-zinc-300">ИТОГО К ОПЛАТЕ:</span>
                <span className="text-base font-black text-white">
                  {totalPrice.toLocaleString('ru-RU')} {t.sum}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFinalSubmit} className="space-y-3">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
                ⚠️ {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                {t.nameLabel}
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-[#09090B] border border-zinc-800 focus:border-purple-500 text-white text-sm outline-none transition-all placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                {t.phoneLabel}
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+998 (90) 123-45-67"
                className="w-full px-4 py-3 rounded-xl bg-[#09090B] border border-zinc-800 focus:border-purple-500 text-white text-sm font-mono outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                {t.notesLabel}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-[#09090B] border border-zinc-800 focus:border-purple-500 text-white text-sm outline-none transition-all placeholder:text-zinc-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-2xl shadow-purple-600/40 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Бронирование...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {t.bookBtn} • {totalPrice.toLocaleString('ru-RU')} {t.sum}
                    </span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-zinc-400 mt-2">
                🔒 Запись подтверждается мгновенно в Telegram-боте без платных SMS
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
