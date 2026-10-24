export type Language = 'ru' | 'uz';

export type TabType = 'home' | 'booking' | 'services' | 'my-bookings' | 'barber';

export type BookingStatus =
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'WALK_IN_BLOCKED';

export interface Branch {
  id: number;
  nameRu: string;
  nameUz: string;
  addressRu: string;
  addressUz: string;
  landmarkRu: string;
  landmarkUz: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  lat: number;
  lng: number;
  photoUrl: string;
  mapUrl2Gis?: string;
  mapUrlYandex?: string;
}

export interface Barber {
  id: number;
  name: string;
  titleRu: string;
  titleUz: string;
  rating: number;
  reviewsCount: number;
  specialtiesRu: string;
  specialtiesUz: string;
  avatarUrl: string;
  branchId: number;
  username?: string;
}

export interface ServiceItem {
  id: number;
  nameRu: string;
  nameUz: string;
  descriptionRu: string;
  descriptionUz: string;
  durationMinutes: number;
  priceUzs: number;
  category: string;
}

export interface Slot {
  time: string;
  available: boolean;
  barberId?: number;
  barberName?: string;
  reason?: string;
}

export interface Booking {
  id: number;
  bookingNumber: string;
  branchId: number;
  branchNameRu: string;
  branchNameUz: string;
  branchAddressRu: string;
  branchAddressUz: string;
  branchPhone: string;
  barberId?: number;
  barberName: string;
  barberTitleRu?: string;
  barberTitleUz?: string;
  clientName: string;
  clientPhone: string;
  clientTelegramId?: number;
  clientTelegramUsername?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalDurationMinutes: number;
  totalPriceUzs: number;
  status: BookingStatus;
  isWalkIn: boolean;
  reminderSent: boolean;
  notes?: string;
  services?: {
    id: number;
    nameRu: string;
    nameUz: string;
    durationMinutes: number;
    priceUzs: number;
  }[];
}

export interface DashboardStats {
  branchId: number;
  branchNameRu: string;
  branchNameUz: string;
  date: string;
  totalBookings: number;
  confirmedCount: number;
  pendingCount: number;
  completedCount: number;
  noShowCount: number;
  walkInBlockedCount: number;
  expectedRevenueUzs: number;
  actualCompletedRevenueUzs: number;
  availableSlotsCount: number;
  quickAvailableSeatText: string;
  bookings: Booking[];
}

export interface BarberAuthUser {
  id: number;
  barberId: number;
  name: string;
  titleRu: string;
  titleUz: string;
  branchId: number;
  branchNameRu: string;
  avatarUrl: string;
  rating: number;
  role: 'barber' | 'admin';
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}
