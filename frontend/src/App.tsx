import React, { useState, useEffect } from 'react';
import {
  Language,
  TabType,
  Branch,
  Barber,
  ServiceItem,
  Booking,
  BarberAuthUser,
  TelegramUser,
} from './types';
import { api, INITIAL_BRANCHES, INITIAL_SERVICES, INITIAL_BARBERS } from './api/client';
import { Header } from './components/Header';
import { BottomNavbar } from './components/BottomNavbar';
import { HomeScreen } from './components/HomeScreen';
import { BookingWizard } from './components/BookingWizard';
import { ServicesCatalogScreen } from './components/ServicesCatalogScreen';
import { MyAppointmentsView } from './components/MyAppointmentsView';
import { BarberWorkspaceScreen } from './components/BarberWorkspaceScreen';
import { BookingSuccessModal } from './components/BookingSuccessModal';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Telegram User detection
  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);

  // Core Data
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(INITIAL_BRANCHES[0]);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [allBarbers, setAllBarbers] = useState<Record<number, Barber[]>>(INITIAL_BARBERS);

  // Client and Barber Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => api.getAllBookings());
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Barber Authentication State
  const [currentBarberUser, setCurrentBarberUser] = useState<BarberAuthUser | null>(null);

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

  // Fetch branches and services
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

  // Refresh bookings list
  const refreshBookings = () => {
    setBookings([...api.getAllBookings()]);
  };

  // Switch to booking with branch preselected
  const handleStartBooking = (branch?: Branch) => {
    if (branch) {
      setSelectedBranch(branch);
    }
    setActiveTab('booking');
  };

  // Switch to booking from services catalog
  const handleSelectServiceAndBook = (serviceId: number) => {
    setActiveTab('booking');
  };

  // On new booking created by client
  const handleBookingCreated = (newBooking: Booking) => {
    refreshBookings();
    setSuccessBooking(newBooking);
  };

  // Cancel booking by client
  const handleCancelBooking = async (id: number) => {
    await api.updateStatus(id, 'CANCELLED');
    refreshBookings();
  };

  // Update status by barber / admin
  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    await api.updateStatus(bookingId, status);
    refreshBookings();
  };

  // Block walk-in slot by barber
  const handleBlockWalkIn = async (
    barberId: number,
    startTime: string,
    duration: number,
    notes: string
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    await api.blockWalkIn({
      branchId: selectedBranch.id,
      barberId,
      bookingDate: todayStr,
      startTime,
      durationMinutes: duration,
      notes,
    });
    refreshBookings();
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Header */}
      <Header language={language} setLanguage={setLanguage} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-3.5 pb-24">
        {/* TAB 1: Home (Interactive Map & Branches) */}
        {activeTab === 'home' && (
          <HomeScreen
            branches={branches}
            selectedBranch={selectedBranch}
            onSelectBranch={setSelectedBranch}
            onStartBooking={handleStartBooking}
            language={language}
          />
        )}

        {/* TAB 2: Step-by-Step Booking Wizard */}
        {activeTab === 'booking' && (
          <BookingWizard
            branches={branches}
            initialBranch={selectedBranch}
            services={services}
            allBarbers={allBarbers}
            tgUser={tgUser}
            onBookingCreated={handleBookingCreated}
            language={language}
          />
        )}

        {/* TAB 3: Services Catalog / Price List */}
        {activeTab === 'services' && (
          <ServicesCatalogScreen
            services={services}
            onSelectServiceAndBook={handleSelectServiceAndBook}
            language={language}
          />
        )}

        {/* TAB 4: My Appointments */}
        {activeTab === 'my-bookings' && (
          <MyAppointmentsView
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            language={language}
          />
        )}

        {/* TAB 5: Barber Workspace (Personal Accounts & Login) */}
        {activeTab === 'barber' && (
          <BarberWorkspaceScreen
            currentUser={currentBarberUser}
            onLogin={(user) => setCurrentBarberUser(user)}
            onLogout={() => setCurrentBarberUser(null)}
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
            onBlockWalkIn={handleBlockWalkIn}
            language={language}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        language={language}
        myBookingsCount={bookings.filter((b) => b.status !== 'CANCELLED' && b.status !== 'COMPLETED').length}
        isBarberLoggedIn={!!currentBarberUser}
      />

      {/* Booking Success Modal */}
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
