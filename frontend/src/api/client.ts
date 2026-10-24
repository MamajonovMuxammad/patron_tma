import { Branch, Barber, ServiceItem, Slot, Booking, DashboardStats, BarberAuthUser } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 1,
    nameRu: "Филиал «Максим Горький»",
    nameUz: "«Maksim Gorkiy» filiali (Buyuk Ipak Yo'li)",
    addressRu: "ул. Мирзо Улугбека, 49/3",
    addressUz: "Mirzo Ulug'bek ko'chasi, 49/3",
    landmarkRu: "Буюк Ипак Йули, метро в 2 минутах",
    landmarkUz: "Buyuk Ipak Yo'li metrosi yaqinida",
    phone: "+998 95 023 20 00",
    openingTime: "09:00",
    closingTime: "21:00",
    lat: 41.3268,
    lng: 69.3285,
    photoUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80",
    mapUrl2Gis: "https://2gis.uz/tashkent/branches/70000001083921829",
    mapUrlYandex: "https://yandex.uz/maps/10335/tashkent"
  },
  {
    id: 2,
    nameRu: "Филиал «Карасув»",
    nameUz: "«Qorasuv» filiali",
    addressRu: "массив Карасув-1",
    addressUz: "Qorasuv-1 massivi",
    landmarkRu: "Напротив супермаркета Korzinka",
    landmarkUz: "Korzinka supermarketi ro'parasida",
    phone: "+998 99 595 40 00",
    openingTime: "09:00",
    closingTime: "21:00",
    lat: 41.3412,
    lng: 69.3482,
    photoUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80",
    mapUrl2Gis: "https://2gis.uz/tashkent",
    mapUrlYandex: "https://yandex.uz/maps"
  },
  {
    id: 3,
    nameRu: "Филиал «Салом Чайхана»",
    nameUz: "«Salom Choyxona» filiali",
    addressRu: "ул. Шуъала",
    addressUz: "Shu'ala ko'chasi",
    landmarkRu: "Ориентир — Салом чайхана",
    landmarkUz: "Mo'ljal: Salom choyxonasi",
    phone: "+998 70 037 60 00",
    openingTime: "09:00",
    closingTime: "21:00",
    lat: 41.3338,
    lng: 69.3370,
    photoUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80",
    mapUrl2Gis: "https://2gis.uz/tashkent",
    mapUrlYandex: "https://yandex.uz/maps"
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 1,
    nameRu: "Мужская стрижка",
    nameUz: "Erkaklar soch turmagi",
    descriptionRu: "Мытье головы, индивидуальный подбор формы, стрижка ножницами и машинкой, стайлинг",
    descriptionUz: "Bosh yuvish, individual soch turmagi tanlash, qaychi va mashinka bilan qirqish, turmaklash",
    durationMinutes: 45,
    priceUzs: 100000,
    category: "HAIRCUT"
  },
  {
    id: 2,
    nameRu: "Стрижка + Борода (Комплекс)",
    nameUz: "Kompleks: Soch + Soqol",
    descriptionRu: "Модельная стрижка + распаривание горячим полотенцем и моделирование опасной бритвой",
    descriptionUz: "To'liq obraz: soch turmagi + soqol tekislash va maxsus parvarish",
    durationMinutes: 60,
    priceUzs: 140000,
    category: "COMBO"
  },
  {
    id: 3,
    nameRu: "Моделирование бороды",
    nameUz: "Soqol tekislash",
    descriptionRu: "Четкие контуры, стрижка триммером и бритвой, нанесение ухаживающего премиум-масла",
    descriptionUz: "Aniq chiziqlar, trimmer va ustara bilan tekislash, maxsus moy surtish",
    durationMinutes: 30,
    priceUzs: 60000,
    category: "BEARD"
  },
  {
    id: 4,
    nameRu: "Детская стрижка (до 10 лет)",
    nameUz: "Bolalar soch turmagi (10 yoshgacha)",
    descriptionRu: "Бережный подход к юным джентльменам, стильная форма и любимые мультфильмы",
    descriptionUz: "Yosh jentlmenlar uchun zamonaviy va chiroyli soch turmagi",
    durationMinutes: 30,
    priceUzs: 70000,
    category: "KIDS"
  },
  {
    id: 5,
    nameRu: "Чистка лица Black Mask + Воск",
    nameUz: "Yuz tozalash (Black Mask + Mum)",
    descriptionRu: "Глубокое очищение пор черной маской, удаление волос из носа и ушей воском",
    descriptionUz: "Qora niqob bilan yuzni chuqur tozalash, quloq va burun tuklarini mum bilan tozalash",
    durationMinutes: 30,
    priceUzs: 60000,
    category: "SPA"
  }
];

export const INITIAL_BARBERS: Record<number, Barber[]> = {
  1: [
    {
      id: 101,
      name: "Шохазиз",
      titleRu: "Top Barber",
      titleUz: "Bosh Sartarosh",
      rating: 5.0,
      reviewsCount: 184,
      specialtiesRu: "Skin Fade, Оформление бороды",
      specialtiesUz: "Skin Fade, Soqol tekislash",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      branchId: 1,
      username: "shohaziz"
    },
    {
      id: 102,
      name: "Сайфулла",
      titleRu: "Senior Barber",
      titleUz: "Katta Sartarosh",
      rating: 4.95,
      reviewsCount: 142,
      specialtiesRu: "Классика, Fade, Уход за кожей",
      specialtiesUz: "Klassika, Fade, Teri parvarishi",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      branchId: 1,
      username: "sayfulla"
    },
    {
      id: 103,
      name: "Сардор",
      titleRu: "Barber",
      titleUz: "Sartarosh",
      rating: 4.9,
      reviewsCount: 98,
      specialtiesRu: "Мужские стрижки, Детская",
      specialtiesUz: "Erkaklar soch turmagi, Bolalar",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      branchId: 1,
      username: "sardor"
    }
  ],
  2: [
    {
      id: 201,
      name: "Жавохир",
      titleRu: "Top Barber",
      titleUz: "Bosh Sartarosh",
      rating: 5.0,
      reviewsCount: 162,
      specialtiesRu: "Fade, Борода, Black Mask",
      specialtiesUz: "Fade, Soqol, Black Mask",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
      branchId: 2,
      username: "zhavohir"
    },
    {
      id: 202,
      name: "Достон",
      titleRu: "Senior Barber",
      titleUz: "Katta Sartarosh",
      rating: 4.9,
      reviewsCount: 120,
      specialtiesRu: "Классика, Текстура",
      specialtiesUz: "Klassika, Tekstura",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80",
      branchId: 2,
      username: "doston"
    },
    {
      id: 203,
      name: "Бекзод",
      titleRu: "Barber",
      titleUz: "Sartarosh",
      rating: 4.85,
      reviewsCount: 84,
      specialtiesRu: "Стрижка, Стайлинг",
      specialtiesUz: "Soch turmagi, Stayling",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
      branchId: 2,
      username: "bekzod"
    }
  ],
  3: [
    {
      id: 301,
      name: "Улугбек",
      titleRu: "Top Barber",
      titleUz: "Bosh Sartarosh",
      rating: 5.0,
      reviewsCount: 210,
      specialtiesRu: "Королевское бритье, Fade",
      specialtiesUz: "Qirollik soqol olishi, Fade",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
      branchId: 3,
      username: "ulugbek"
    },
    {
      id: 302,
      name: "Алишер",
      titleRu: "Senior Barber",
      titleUz: "Katta Sartarosh",
      rating: 4.92,
      reviewsCount: 134,
      specialtiesRu: "Борода, Классика",
      specialtiesUz: "Soqol, Klassika",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      branchId: 3,
      username: "alisher"
    },
    {
      id: 303,
      name: "Тимур",
      titleRu: "Barber",
      titleUz: "Sartarosh",
      rating: 4.88,
      reviewsCount: 95,
      specialtiesRu: "Модельные стрижки, Укладка",
      specialtiesUz: "Model soch turmagi, Turmak",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      branchId: 3,
      username: "timur"
    }
  ]
};

// Initial bookings for local mock/demo
const STORAGE_KEY = 'patron_mock_bookings_v3';
function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  const today = new Date().toISOString().split('T')[0];
  const initial: Booking[] = [
    {
      id: 1,
      bookingNumber: "PT-8421",
      branchId: 1,
      branchNameRu: "Филиал «Максим Горький»",
      branchNameUz: "«Maksim Gorkiy» filiali",
      branchAddressRu: "ул. Мирзо Улугбека, 49/3",
      branchAddressUz: "Mirzo Ulug'bek ko'chasi, 49/3",
      branchPhone: "+998 95 023 20 00",
      barberId: 101,
      barberName: "Шохазиз",
      barberTitleRu: "Top Barber",
      clientName: "Азизбек Каримов",
      clientPhone: "+998 90 123 45 67",
      clientTelegramUsername: "aziz_karim",
      clientTelegramId: 582194012,
      bookingDate: today,
      startTime: "10:00",
      endTime: "11:00",
      totalDurationMinutes: 60,
      totalPriceUzs: 140000,
      status: "CONFIRMED",
      isWalkIn: false,
      reminderSent: true,
      notes: "Классический Fade + масло для бороды"
    },
    {
      id: 2,
      bookingNumber: "PT-9104",
      branchId: 1,
      branchNameRu: "Филиал «Максим Горький»",
      branchNameUz: "«Maksim Gorkiy» filiali",
      branchAddressRu: "ул. Мирзо Улугбека, 49/3",
      branchAddressUz: "Mirzo Ulug'bek ko'chasi, 49/3",
      branchPhone: "+998 95 023 20 00",
      barberId: 102,
      barberName: "Сайфулла",
      barberTitleRu: "Senior Barber",
      clientName: "Жамшид Рахимов",
      clientPhone: "+998 93 888 12 34",
      clientTelegramUsername: "jamshid_r",
      clientTelegramId: 942104921,
      bookingDate: today,
      startTime: "11:30",
      endTime: "12:15",
      totalDurationMinutes: 45,
      totalPriceUzs: 100000,
      status: "PENDING_CONFIRMATION",
      isWalkIn: false,
      reminderSent: false
    },
    {
      id: 3,
      bookingNumber: "WALK-302",
      branchId: 1,
      branchNameRu: "Филиал «Максим Горький»",
      branchNameUz: "«Maksim Gorkiy» filiali",
      branchAddressRu: "ул. Мирзо Улугбека, 49/3",
      branchAddressUz: "Mirzo Ulug'bek ko'chasi, 49/3",
      branchPhone: "+998 95 023 20 00",
      barberId: 101,
      barberName: "Шохазиз",
      barberTitleRu: "Top Barber",
      clientName: "Живая очередь (Клиент с улицы)",
      clientPhone: "+998 00 000 00 00",
      bookingDate: today,
      startTime: "14:00",
      endTime: "14:45",
      totalDurationMinutes: 45,
      totalPriceUzs: 100000,
      status: "WALK_IN_BLOCKED",
      isWalkIn: true,
      reminderSent: true,
      notes: "Заблокировано барбером: зашел клиент с улицы"
    },
    {
      id: 4,
      bookingNumber: "PT-7719",
      branchId: 1,
      branchNameRu: "Филиал «Максим Горький»",
      branchNameUz: "«Maksim Gorkiy» filiali",
      branchAddressRu: "ул. Мирзо Улугбека, 49/3",
      branchAddressUz: "Mirzo Ulug'bek ko'chasi, 49/3",
      branchPhone: "+998 95 023 20 00",
      barberId: 103,
      barberName: "Сардор",
      barberTitleRu: "Barber",
      clientName: "Фарход Умаров",
      clientPhone: "+998 97 777 55 44",
      bookingDate: today,
      startTime: "16:00",
      endTime: "16:45",
      totalDurationMinutes: 45,
      totalPriceUzs: 100000,
      status: "CONFIRMED",
      isWalkIn: false,
      reminderSent: true
    }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveStoredBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export const api = {
  async getBranches(): Promise<Branch[]> {
    try {
      const res = await fetch(`${API_BASE}/branches`);
      if (res.ok) {
        const data = await res.json();
        // Merge coordinates and photos
        return data.map((b: any) => {
          const match = INITIAL_BRANCHES.find(x => x.id === b.id);
          return {
            ...b,
            lat: match?.lat || 41.3268,
            lng: match?.lng || 69.3285,
            photoUrl: match?.photoUrl || INITIAL_BRANCHES[0].photoUrl
          };
        });
      }
    } catch {}
    return INITIAL_BRANCHES;
  },

  async getBarbers(branchId: number): Promise<Barber[]> {
    try {
      const res = await fetch(`${API_BASE}/branches/${branchId}/barbers`);
      if (res.ok) return await res.json();
    } catch {}
    return INITIAL_BARBERS[branchId] || INITIAL_BARBERS[1];
  },

  async getServices(): Promise<ServiceItem[]> {
    try {
      const res = await fetch(`${API_BASE}/services`);
      if (res.ok) return await res.json();
    } catch {}
    return INITIAL_SERVICES;
  },

  async getSlots(branchId: number, barberId: number | null, date: string, duration: number): Promise<Slot[]> {
    try {
      const url = `${API_BASE}/slots?branchId=${branchId}&date=${date}&duration=${duration}${barberId ? `&barberId=${barberId}` : ''}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}

    // Accurate interval math fallback
    const slots: Slot[] = [];
    const barbers = barberId
      ? (INITIAL_BARBERS[branchId] || INITIAL_BARBERS[1]).filter(b => b.id === barberId)
      : (INITIAL_BARBERS[branchId] || INITIAL_BARBERS[1]);

    const bookings = getStoredBookings().filter(b => b.branchId === branchId && b.bookingDate === date && b.status !== 'CANCELLED' && b.status !== 'NO_SHOW');

    for (let h = 9; h < 21; h++) {
      for (const m of [0, 30]) {
        const totalStartMin = h * 60 + m;
        if (totalStartMin + duration > 21 * 60) continue;

        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const slotEndMin = totalStartMin + duration;

        let freeBarber: Barber | undefined;
        for (const barber of barbers) {
          const hasConflict = bookings.some(b => {
            if (b.barberId && b.barberId !== barber.id) return false;
            const [bh, bm] = b.startTime.split(':').map(Number);
            const [eh, em] = b.endTime.split(':').map(Number);
            const bStart = bh * 60 + bm;
            const bEnd = eh * 60 + em;
            return totalStartMin < bEnd && slotEndMin > bStart;
          });

          if (!hasConflict) {
            freeBarber = barber;
            break;
          }
        }

        slots.push({
          time: timeStr,
          available: !!freeBarber,
          barberId: freeBarber?.id,
          barberName: freeBarber?.name,
          reason: freeBarber ? undefined : 'Все мастера заняты'
        });
      }
    }
    return slots;
  },

  async createBooking(data: {
    branchId: number;
    barberId?: number | null;
    serviceIds: number[];
    bookingDate: string;
    startTime: string;
    clientName: string;
    clientPhone: string;
    clientTelegramId?: number;
    clientTelegramUsername?: string;
    notes?: string;
  }): Promise<Booking> {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {}

    const branch = INITIAL_BRANCHES.find(b => b.id === data.branchId) || INITIAL_BRANCHES[0];
    const barbers = INITIAL_BARBERS[branch.id] || INITIAL_BARBERS[1];
    const barber = data.barberId ? barbers.find(b => b.id === data.barberId) : barbers[0];
    const services = INITIAL_SERVICES.filter(s => data.serviceIds.includes(s.id));
    const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0) || 45;
    const totalPrice = services.reduce((acc, s) => acc + s.priceUzs, 0) || 100000;

    const [sh, sm] = data.startTime.split(':').map(Number);
    const endTotalMin = sh * 60 + sm + totalDuration;
    const eh = Math.floor(endTotalMin / 60);
    const em = endTotalMin % 60;
    const endTime = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;

    const newBooking: Booking = {
      id: Date.now(),
      bookingNumber: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      branchId: branch.id,
      branchNameRu: branch.nameRu,
      branchNameUz: branch.nameUz,
      branchAddressRu: branch.addressRu,
      branchAddressUz: branch.addressUz,
      branchPhone: branch.phone,
      barberId: barber?.id,
      barberName: barber ? barber.name : "Любой мастер",
      barberTitleRu: barber?.titleRu,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientTelegramId: data.clientTelegramId,
      clientTelegramUsername: data.clientTelegramUsername,
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime,
      totalDurationMinutes: totalDuration,
      totalPriceUzs: totalPrice,
      status: "PENDING_CONFIRMATION",
      isWalkIn: false,
      reminderSent: false,
      notes: data.notes,
      services
    };

    const current = getStoredBookings();
    current.unshift(newBooking);
    saveStoredBookings(current);
    return newBooking;
  },

  async blockWalkIn(data: {
    branchId: number;
    barberId: number;
    bookingDate: string;
    startTime: string;
    durationMinutes?: number;
    notes?: string;
  }): Promise<Booking> {
    try {
      const res = await fetch(`${API_BASE}/admin/bookings/walk-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {}

    const branch = INITIAL_BRANCHES.find(b => b.id === data.branchId) || INITIAL_BRANCHES[0];
    const barbers = INITIAL_BARBERS[branch.id] || INITIAL_BARBERS[1];
    const barber = barbers.find(b => b.id === data.barberId) || barbers[0];
    const duration = data.durationMinutes || 45;

    const [sh, sm] = data.startTime.split(':').map(Number);
    const endTotalMin = sh * 60 + sm + duration;
    const eh = Math.floor(endTotalMin / 60);
    const em = endTotalMin % 60;
    const endTime = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;

    const walkInBooking: Booking = {
      id: Date.now(),
      bookingNumber: `WALK-${Math.floor(100 + Math.random() * 900)}`,
      branchId: branch.id,
      branchNameRu: branch.nameRu,
      branchNameUz: branch.nameUz,
      branchAddressRu: branch.addressRu,
      branchAddressUz: branch.addressUz,
      branchPhone: branch.phone,
      barberId: barber.id,
      barberName: barber.name,
      barberTitleRu: barber.titleRu,
      clientName: "Клиент с улицы (Живая очередь)",
      clientPhone: "+998 00 000 00 00",
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime,
      totalDurationMinutes: duration,
      totalPriceUzs: 100000,
      status: "WALK_IN_BLOCKED",
      isWalkIn: true,
      reminderSent: true,
      notes: data.notes || "Живая очередь"
    };

    const current = getStoredBookings();
    current.unshift(walkInBooking);
    saveStoredBookings(current);
    return walkInBooking;
  },

  async updateStatus(bookingId: number, status: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/admin/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {}

    const current = getStoredBookings();
    const idx = current.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      current[idx].status = status as any;
      saveStoredBookings(current);
    }
  },

  async getDashboard(branchId: number, date: string, barberId?: number): Promise<DashboardStats> {
    const branch = INITIAL_BRANCHES.find(b => b.id === branchId) || INITIAL_BRANCHES[0];
    let bookings = getStoredBookings().filter(b => b.branchId === branchId && b.bookingDate === date);

    if (barberId) {
      bookings = bookings.filter(b => b.barberId === barberId);
    }

    let confirmed = 0;
    let pending = 0;
    let completed = 0;
    let noShow = 0;
    let walkIn = 0;
    let expectedRev = 0;
    let actualRev = 0;

    for (const b of bookings) {
      if (b.status === 'CONFIRMED') confirmed++;
      else if (b.status === 'PENDING_CONFIRMATION') pending++;
      else if (b.status === 'COMPLETED') {
        completed++;
        actualRev += b.totalPriceUzs;
      } else if (b.status === 'NO_SHOW') noShow++;
      else if (b.status === 'WALK_IN_BLOCKED') walkIn++;

      if (b.status !== 'CANCELLED' && b.status !== 'NO_SHOW') {
        expectedRev += b.totalPriceUzs;
      }
    }

    return {
      branchId: branch.id,
      branchNameRu: branch.nameRu,
      branchNameUz: branch.nameUz,
      date,
      totalBookings: bookings.length,
      confirmedCount: confirmed,
      pendingCount: pending,
      completedCount: completed,
      noShowCount: noShow,
      walkInBlockedCount: walkIn,
      expectedRevenueUzs: expectedRev,
      actualCompletedRevenueUzs: actualRev,
      availableSlotsCount: Math.max(0, 24 - bookings.length * 2),
      quickAvailableSeatText: "Максим Горький: через 15 мин у барбера Шохазиза",
      bookings
    };
  },

  getAllBookings(): Booking[] {
    return getStoredBookings();
  }
};
