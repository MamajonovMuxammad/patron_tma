import React from 'react';
import { TabType, Language } from '../types';
import { MapPin, Scissors, Sparkles, Calendar, UserCheck } from 'lucide-react';

interface BottomNavbarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  language: Language;
  myBookingsCount: number;
  isBarberLoggedIn: boolean;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  onChangeTab,
  language,
  myBookingsCount,
  isBarberLoggedIn,
}) => {
  const triggerHaptic = () => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    } catch {}
  };

  const tabs: { id: TabType; labelRu: string; labelUz: string; icon: any }[] = [
    {
      id: 'home',
      labelRu: 'Филиалы',
      labelUz: 'Filiallar',
      icon: MapPin,
    },
    {
      id: 'services',
      labelRu: 'Услуги',
      labelUz: 'Xizmatlar',
      icon: Sparkles,
    },
    {
      id: 'booking',
      labelRu: 'Запись',
      labelUz: 'Yozilish',
      icon: Scissors,
    },
    {
      id: 'my-bookings',
      labelRu: 'Мои визиты',
      labelUz: 'Tashriflarim',
      icon: Calendar,
    },
    {
      id: 'barber',
      labelRu: isBarberLoggedIn ? 'Кабинет' : 'Барбер',
      labelUz: isBarberLoggedIn ? 'Kabinet' : 'Sartarosh',
      icon: UserCheck,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#09090B]/95 backdrop-blur-xl border-t border-purple-500/20 px-2 py-2 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isBooking = tab.id === 'booking';

          if (isBooking) {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic();
                  onChangeTab(tab.id);
                }}
                className="relative -top-3 flex flex-col items-center group"
              >
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-fuchsia-500 text-white shadow-purple-600/50 scale-105 ring-4 ring-purple-500/20'
                      : 'bg-[#18181D] text-purple-400 hover:text-white border border-purple-500/30 hover:border-purple-500'
                  }`}
                  style={{ width: '52px', height: '52px' }}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] font-extrabold mt-1 tracking-tight transition-colors ${
                    isActive ? 'text-purple-400 font-black' : 'text-zinc-400'
                  }`}
                >
                  {language === 'ru' ? tab.labelRu : tab.labelUz}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic();
                onChangeTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.id === 'my-bookings' && myBookingsCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-purple-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-[#09090B]">
                    {myBookingsCount}
                  </span>
                )}
                {tab.id === 'barber' && isBarberLoggedIn && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#09090B] animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 transition-all ${
                  isActive ? 'font-black text-white' : 'font-medium'
                }`}
              >
                {language === 'ru' ? tab.labelRu : tab.labelUz}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-purple-500 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
