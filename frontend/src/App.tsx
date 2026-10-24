import React, { useState, useEffect, useMemo } from 'react';
import {
  Language,
  AppMode,
  Branch,
  Barber,
  ServiceItem,
  Slot,
  Booking,
  DashboardStats,
  TelegramUser,
} from './types';
import { translations } from './locales/translations';
import { api, INITIAL_BRANCHES, INITIAL_SERVICES, INITIAL_BARBERS } from './api/client';
import { Header } from './components/Header';
import { QuickSeatBanner } from './components/QuickSeatBanner';
import { BranchSelector } from './components/BranchSelector';
import { BarberSelector } from './components/BarberSelector';
import { ServiceSelector } from './components/ServiceSelector';
import { TimeSlotPicker } from './components/TimeSlotPicker';
import { BookingConfirmDrawer } from './components/BookingConfirmDrawer';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { MyAppointmentsView } from './components/MyAppointmentsView';
import { AdminDashboard } from './components/AdminDashboard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const [mode, setMode] = useState<AppMode>('client');
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings'>('book');

  // Telegram User detection
  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);

  // Entities state
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(INITIAL_BRANCHES[0]);

  const [barbers, setBarbers] = useState<Barber[]>(INITIAL_BARBERS[1]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([1]); // default: Мужская стрижка

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>('14:30');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Modals & client bookings
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  // Admin dashboard state
  const [adminBranchId, setAdminBranchId] = useState<number>(1);
  const [adminStats, setAdminStats] = useState<DashboardStats | null>(null);

  const t = translations[language];

  // Initialize Telegram WebApp SDK
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        if (tg.initDataUnsafe?.user) {
          setTgUser(tg.initDataUnsafe.user);
          if (tg.initDataUnsafe.user.language_code?.toLowerCase().includes('uz')) {
            setLanguage('uz');
          }
        }
      }
    } catch (e) {
      console.error('Failed to init Telegram WebApp SDK', e);
    }
  }, []);

  // Fetch branches on mount
  useEffect(() => {
    api.getBranches().then((b) => {
      if (b.length > 0) {
        setBranches(b);
        setSelectedBranch(b[0]);
      }
    });
    api.getServices().then((s) => {
      if (s.length > 0) setServices(s);
    });
  }, []);

  // When branch changes, update barbers
  useEffect(() => {
    if (!selectedBranch) return;
    api.getBarbers(selectedBranch.id).then((bList) => {
      setBarbers(bList);
      setSelectedBarber(null); // default to "Any"
    });
  }, [selectedBranch]);

  // Calculations for total duration and price
  const totalDuration = useMemo(() => {
    return services
      .filter((s) => selectedServiceIds.includes(s.id))
      .reduce((acc, curr) => acc + curr.durationMinutes, 0) || 45;
  }, [services, selectedServiceIds]);

  const totalPrice = useMemo(() => {
    return services
      .filter((s) => selectedServiceIds.includes(s.id))
      .reduce((acc, curr) => acc + curr.priceUzs, 0) || 100000;
  }, [services, selectedServiceIds]);

  // Load available slots whenever branch, barber, date or totalDuration changes
  useEffect(() => {
    if (!selectedBranch) return;
    setLoadingSlots(true);
    api.getSlots(selectedBranch.id, selectedBarber?.id || null, selectedDate, totalDuration)
      .then((res) => {
        setSlots(res);
        // If current selected slot is not free, auto-pick first available
        const currentSlotObj = res.find((s) => s.time === selectedSlotTime);
        if (!currentSlotObj || !currentSlotObj.available) {
          const firstFree = res.find((s) => s.available);
          setSelectedSlotTime(firstFree ? firstFree.time : null);
        }
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedBranch, selectedBarber, selectedDate, totalDuration]);

  // Load Admin Dashboard
  const refreshAdminDashboard = () => {
    api.getDashboard(adminBranchId, todayStr).then((d) => setAdminStats(d));
  };

  useEffect(() => {
    if (mode === 'admin') {
      refreshAdminDashboard();
    }
  }, [mode, adminBranchId]);

  // Toggle service selection
  const handleToggleService = (id: number) => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    } catch {}

    setSelectedServiceIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Quick 1-tap booking ("Кто свободен прямо сейчас")
  const handleQuickBook = () => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    } catch {}

    // Select Branch 1
    const b1 = branches[0];
    if (b1) setSelectedBranch(b1);
    // Select Shohaziz
    const barberShohaziz = barbers.find((b) => b.name.includes('Шохазиз')) || barbers[0];
    if (barberShohaziz) setSelectedBarber(barberShohaziz);
    // Default service 1
    setSelectedServiceIds([1]);
    setSelectedDate(todayStr);

    setIsDrawerOpen(true);
  };

  // Handle final booking creation
  const handleConfirmBooking = async (name: string, phone: string, notes: string) => {
    if (!selectedSlotTime) {
      throw new Error(language === 'ru' ? 'Выберите свободное время' : 'Vaqtni tanlang');
    }

    const newBooking = await api.createBooking({
      branchId: selectedBranch.id,
      barberId: selectedBarber?.id || null,
      serviceIds: selectedServiceIds,
      bookingDate: selectedDate,
      startTime: selectedSlotTime,
      clientName: name,
      clientPhone: phone,
      clientTelegramId: tgUser?.id,
      clientTelegramUsername: tgUser?.username,
      notes,
    });

    setMyBookings((prev) => [newBooking, ...prev]);
    setIsDrawerOpen(false);
    setSuccessBooking(newBooking);

    // Refresh slots
    api.getSlots(selectedBranch.id, selectedBarber?.id || null, selectedDate, totalDuration)
      .then((res) => setSlots(res));
  };

  // Cancel booking
  const handleCancelBooking = async (id: number) => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('heavy');
    } catch {}

    await api.updateStatus(id, 'CANCELLED');
    setMyBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b))
    );
  };

  // Admin walk-in block
  const handleBlockWalkIn = async (barberId: number, startTime: string, duration: number, notes: string) => {
    await api.blockWalkIn({
      branchId: adminBranchId,
      barberId,
      bookingDate: todayStr,
      startTime,
      durationMinutes: duration,
      notes,
    });
    refreshAdminDashboard();
  };

  // Admin status update
  const handleUpdateStatus = async (bookingId: number, status: string) => {
    await api.updateStatus(bookingId, status);
    refreshAdminDashboard();
  };

  return (
    <div className="min-h-screen bg-bgDark text-textPrimary pb-28">
      {/* Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        mode={mode}
        setMode={setMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingsCount={myBookings.filter((b) => b.status !== 'CANCELLED').length}
      />

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-5">
        {mode === 'client' ? (
          activeTab === 'book' ? (
            <>
              {/* Quick Seat Banner ("Кто свободен прямо сейчас?") */}
              <QuickSeatBanner language={language} onQuickBook={handleQuickBook} />

              {/* Step 1: Branch Selector */}
              <BranchSelector
                branches={branches}
                selectedBranch={selectedBranch}
                onSelect={(b) => {
                  try {
                    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                  } catch {}
                  setSelectedBranch(b);
                }}
                language={language}
              />

              {/* Step 2: Barber Selector */}
              <BarberSelector
                barbers={barbers}
                selectedBarber={selectedBarber}
                onSelect={(b) => {
                  try {
                    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                  } catch {}
                  setSelectedBarber(b);
                }}
                language={language}
              />

              {/* Step 3: Service Selector (Multi-select) */}
              <ServiceSelector
                services={services}
                selectedServiceIds={selectedServiceIds}
                onToggleService={handleToggleService}
                language={language}
              />

              {/* Step 4: Date & Time Slot Picker */}
              <TimeSlotPicker
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  try {
                    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                  } catch {}
                  setSelectedDate(d);
                }}
                slots={slots}
                selectedSlotTime={selectedSlotTime}
                onSelectSlot={(time) => {
                  try {
                    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
                  } catch {}
                  setSelectedSlotTime(time);
                }}
                language={language}
                loadingSlots={loadingSlots}
              />
            </>
          ) : (
            /* My Appointments View */
            <MyAppointmentsView
              bookings={myBookings}
              onCancelBooking={handleCancelBooking}
              language={language}
            />
          )
        ) : (
          /* Admin / Barber Panel */
          adminStats && (
            <AdminDashboard
              stats={adminStats}
              branches={branches}
              selectedBranchId={adminBranchId}
              onSelectBranch={(id) => setAdminBranchId(id)}
              barbers={INITIAL_BARBERS[adminBranchId] || INITIAL_BARBERS[1]}
              onBlockWalkIn={handleBlockWalkIn}
              onUpdateStatus={handleUpdateStatus}
              language={language}
            />
          )
        )}
      </main>

      {/* Floating Bottom Bar for Instant Booking (Client Mode) */}
      {mode === 'client' && activeTab === 'book' && selectedSlotTime && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-bgDark/95 backdrop-blur-lg border-t border-cardBorder/80 px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-textSecondary">
                <span>{selectedDate}</span>
                <span>•</span>
                <span className="font-bold text-statusGreen">{selectedSlotTime}</span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-white">
                  {totalPrice.toLocaleString('ru-RU')}
                </span>
                <span className="text-[11px] text-textSecondary uppercase font-medium">
                  {t.sum}
                </span>
                <span className="text-xs text-textMuted ml-1">
                  ({totalDuration} {t.min})
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                try {
                  (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
                } catch {}
                setIsDrawerOpen(true);
              }}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-neonPurple to-purple-600 hover:from-purple-600 hover:to-neonPurple text-white font-extrabold text-xs shadow-glow-purple flex items-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Продолжить</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Booking Confirmation Drawer */}
      {isDrawerOpen && selectedSlotTime && (
        <BookingConfirmDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          branch={selectedBranch}
          barber={selectedBarber}
          services={services.filter((s) => selectedServiceIds.includes(s.id))}
          date={selectedDate}
          time={selectedSlotTime}
          totalDuration={totalDuration}
          totalPrice={totalPrice}
          initialName={tgUser?.first_name || ''}
          initialPhone=""
          onConfirm={handleConfirmBooking}
          language={language}
        />
      )}

      {/* Success Notification Modal */}
      {successBooking && (
        <BookingSuccessModal
          booking={successBooking}
          onClose={() => {
            setSuccessBooking(null);
            setActiveTab('my-bookings');
          }}
          language={language}
        />
      )}
    </div>
  );
};
export default App;
