package com.patron.barbershop.config;

import com.patron.barbershop.entity.*;
import com.patron.barbershop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BranchRepository branchRepository;
    private final BarberRepository barberRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final BookingRepository bookingRepository;

    @Override
    public void run(String... args) {
        if (branchRepository.count() > 0) {
            log.info("Database already initialized with PATRON data.");
            return;
        }

        log.info("Seeding initial data for Barbershop PATRON (Tashkent)...");

        // 1. SERVICES
        ServiceItem s1 = serviceItemRepository.save(ServiceItem.builder()
                .nameRu("Мужская стрижка")
                .nameUz("Erkaklar soch turmagi")
                .descriptionRu("Мытье головы, индивидуальный подбор формы, стрижка, укладка премиум-стайлингом")
                .descriptionUz("Bosh yuvish, individual soch turmagi tanlash, turmaklash")
                .durationMinutes(45)
                .priceUzs(100000L)
                .category("HAIRCUT")
                .active(true)
                .build());

        ServiceItem s2 = serviceItemRepository.save(ServiceItem.builder()
                .nameRu("Стрижка + Борода (Комплекс)")
                .nameUz("Kompleks: Soch + Soqol")
                .descriptionRu("Полный образ: модельная стрижка + распаривание и моделирование бороды опасной бритвой")
                .descriptionUz("To'liq obraz: soch turmagi + soqol tekislash va parvarish")
                .durationMinutes(60)
                .priceUzs(140000L)
                .category("COMBO")
                .active(true)
                .build());

        ServiceItem s3 = serviceItemRepository.save(ServiceItem.builder()
                .nameRu("Моделирование бороды")
                .nameUz("Soqol tekislash")
                .descriptionRu("Четкие контуры, стрижка триммером и бритвой, нанесение ухаживающего масла")
                .descriptionUz("Aniq chiziqlar, trimmer va ustara bilan tekislash, maxsus moy surtish")
                .durationMinutes(30)
                .priceUzs(60000L)
                .category("BEARD")
                .active(true)
                .build());

        ServiceItem s4 = serviceItemRepository.save(ServiceItem.builder()
                .nameRu("Детская стрижка (до 10 лет)")
                .nameUz("Bolalar soch turmagi (10 yoshgacha)")
                .descriptionRu("Бережный подход к юным джентльменам, стильная форма и любимые мультфильмы")
                .descriptionUz("Yosh jentlmenlar uchun zamonaviy va chiroyli soch turmagi")
                .durationMinutes(30)
                .priceUzs(70000L)
                .category("KIDS")
                .active(true)
                .build());

        ServiceItem s5 = serviceItemRepository.save(ServiceItem.builder()
                .nameRu("Чистка лица Black Mask + Воск")
                .nameUz("Yuz tozalash (Black Mask + Mum)")
                .descriptionRu("Глубокое очищение пор черной маской, удаление волос из носа и ушей воском")
                .descriptionUz("Qora niqob bilan yuzni chuqur tozalash, quloq va burun tuklarini mum bilan tozalash")
                .durationMinutes(30)
                .priceUzs(60000L)
                .category("SPA")
                .active(true)
                .build());

        // 2. BRANCHES
        Branch b1 = branchRepository.save(Branch.builder()
                .nameRu("Филиал «Максим Горький»")
                .nameUz("«Maksim Gorkiy» filiali (Buyuk Ipak Yo'li)")
                .addressRu("ул. Мирзо Улугбека, 49/3")
                .addressUz("Mirzo Ulug'bek ko'chasi, 49/3")
                .landmarkRu("Буюк Ипак Йули, рядом с метро")
                .landmarkUz("Buyuk Ipak Yo'li metro yaqinida")
                .phone("+998 95 023 20 00")
                .mapUrl2Gis("https://2gis.uz/tashkent")
                .mapUrlYandex("https://yandex.uz/maps")
                .openingTime("09:00")
                .closingTime("21:00")
                .active(true)
                .build());

        Branch b2 = branchRepository.save(Branch.builder()
                .nameRu("Филиал «Карасув»")
                .nameUz("«Qorasuv» filiali")
                .addressRu("массив Карасув-1")
                .addressUz("Qorasuv-1 massivi")
                .landmarkRu("Напротив супермаркета Korzinka")
                .landmarkUz("Korzinka supermarketi ro'parasida")
                .phone("+998 99 595 40 00")
                .mapUrl2Gis("https://2gis.uz/tashkent")
                .mapUrlYandex("https://yandex.uz/maps")
                .openingTime("09:00")
                .closingTime("21:00")
                .active(true)
                .build());

        Branch b3 = branchRepository.save(Branch.builder()
                .nameRu("Филиал «Салом Чайхана»")
                .nameUz("«Salom Choyxona» filiali")
                .addressRu("ул. Шуъала")
                .addressUz("Shu'ala ko'chasi")
                .landmarkRu("Ориентир — Салом чайхана")
                .landmarkUz("Mo'ljal: Salom choyxonasi")
                .phone("+998 70 037 60 00")
                .mapUrl2Gis("https://2gis.uz/tashkent")
                .mapUrlYandex("https://yandex.uz/maps")
                .openingTime("09:00")
                .closingTime("21:00")
                .active(true)
                .build());

        // 3. BARBERS
        // Branch 1 Barbers
        Barber barberShohaziz = barberRepository.save(Barber.builder()
                .name("Шохазиз")
                .titleRu("Top Barber")
                .titleUz("Bosh Sartarosh (Top)")
                .rating(5.0)
                .reviewsCount(184)
                .specialtiesRu("Skin Fade, Оформление бороды, Классика")
                .specialtiesUz("Skin Fade, Soqol tekislash, Klassika")
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .branch(b1)
                .active(true)
                .build());

        Barber barberSayfulla = barberRepository.save(Barber.builder()
                .name("Сайфулла")
                .titleRu("Senior Barber")
                .titleUz("Katta Sartarosh (Senior)")
                .rating(4.95)
                .reviewsCount(142)
                .specialtiesRu("Классика, Fade, Уход за кожей")
                .specialtiesUz("Klassika, Fade, Teri parvarishi")
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                .branch(b1)
                .active(true)
                .build());

        Barber barberSardor = barberRepository.save(Barber.builder()
                .name("Сардор")
                .titleRu("Barber")
                .titleUz("Sartarosh")
                .rating(4.9)
                .reviewsCount(98)
                .specialtiesRu("Мужские стрижки, Детская стрижка")
                .specialtiesUz("Erkaklar soch turmagi, Bolalar soch turmagi")
                .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
                .branch(b1)
                .active(true)
                .build());

        // Branch 2 Barbers
        barberRepository.save(Barber.builder()
                .name("Жавохир")
                .titleRu("Top Barber")
                .titleUz("Bosh Sartarosh (Top)")
                .rating(5.0)
                .reviewsCount(162)
                .specialtiesRu("Fade, Борода, Black Mask")
                .specialtiesUz("Fade, Soqol, Black Mask")
                .avatarUrl("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80")
                .branch(b2)
                .active(true)
                .build());

        barberRepository.save(Barber.builder()
                .name("Достон")
                .titleRu("Senior Barber")
                .titleUz("Katta Sartarosh")
                .rating(4.9)
                .reviewsCount(120)
                .specialtiesRu("Классика, Текстура")
                .specialtiesUz("Klassika, Tekstura")
                .avatarUrl("https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80")
                .branch(b2)
                .active(true)
                .build());

        barberRepository.save(Barber.builder()
                .name("Бекзод")
                .titleRu("Barber")
                .titleUz("Sartarosh")
                .rating(4.85)
                .reviewsCount(84)
                .specialtiesRu("Стрижка, Стайлинг")
                .specialtiesUz("Soch turmagi, Stayling")
                .avatarUrl("https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80")
                .branch(b2)
                .active(true)
                .build());

        // Branch 3 Barbers
        barberRepository.save(Barber.builder()
                .name("Улугбек")
                .titleRu("Top Barber")
                .titleUz("Bosh Sartarosh (Top)")
                .rating(5.0)
                .reviewsCount(210)
                .specialtiesRu("Королевское бритье, Fade")
                .specialtiesUz("Qirollik soqol olishi, Fade")
                .avatarUrl("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80")
                .branch(b3)
                .active(true)
                .build());

        barberRepository.save(Barber.builder()
                .name("Алишер")
                .titleRu("Senior Barber")
                .titleUz("Katta Sartarosh")
                .rating(4.92)
                .reviewsCount(134)
                .specialtiesRu("Борода, Классика")
                .specialtiesUz("Soqol, Klassika")
                .avatarUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80")
                .branch(b3)
                .active(true)
                .build());

        barberRepository.save(Barber.builder()
                .name("Тимур")
                .titleRu("Barber")
                .titleUz("Sartarosh")
                .rating(4.88)
                .reviewsCount(95)
                .specialtiesRu("Модельные стрижки, Укладка")
                .specialtiesUz("Model soch turmagi, Turmak")
                .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80")
                .branch(b3)
                .active(true)
                .build());

        // 4. SEED SAMPLE BOOKINGS FOR TODAY TO DEMO DASHBOARD
        LocalDate today = LocalDate.now();

        // Booking 1: Confirmed via TG
        bookingRepository.save(Booking.builder()
                .bookingNumber("PT-8421")
                .branch(b1)
                .barber(barberShohaziz)
                .clientName("Азизбек Каримов")
                .clientPhone("+998 90 123 45 67")
                .clientTelegramUsername("aziz_karim")
                .clientTelegramId(582194012L)
                .bookingDate(today)
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(11, 0))
                .totalDurationMinutes(60)
                .totalPriceUzs(140000L)
                .status(BookingStatus.CONFIRMED)
                .isWalkIn(false)
                .reminderSent(true)
                .services(List.of(s2))
                .build());

        // Booking 2: Pending Confirmation
        bookingRepository.save(Booking.builder()
                .bookingNumber("PT-9104")
                .branch(b1)
                .barber(barberSayfulla)
                .clientName("Жамшид Рахимов")
                .clientPhone("+998 93 888 12 34")
                .clientTelegramUsername("jamshid_r")
                .clientTelegramId(942104921L)
                .bookingDate(today)
                .startTime(LocalTime.of(11, 30))
                .endTime(LocalTime.of(12, 15))
                .totalDurationMinutes(45)
                .totalPriceUzs(100000L)
                .status(BookingStatus.PENDING_CONFIRMATION)
                .isWalkIn(false)
                .reminderSent(false)
                .services(List.of(s1))
                .build());

        // Booking 3: Completed
        bookingRepository.save(Booking.builder()
                .bookingNumber("PT-7123")
                .branch(b1)
                .barber(barberSardor)
                .clientName("Фарход Умаров")
                .clientPhone("+998 97 777 55 44")
                .bookingDate(today)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(9, 45))
                .totalDurationMinutes(45)
                .totalPriceUzs(100000L)
                .status(BookingStatus.COMPLETED)
                .isWalkIn(false)
                .reminderSent(true)
                .services(List.of(s1))
                .build());

        // Booking 4: Walk-in locked slot
        bookingRepository.save(Booking.builder()
                .bookingNumber("WALK-302")
                .branch(b1)
                .barber(barberShohaziz)
                .clientName("Живая очередь (Клиент с улицы)")
                .clientPhone("+998 00 000 00 00")
                .bookingDate(today)
                .startTime(LocalTime.of(14, 0))
                .endTime(LocalTime.of(14, 45))
                .totalDurationMinutes(45)
                .totalPriceUzs(100000L)
                .status(BookingStatus.WALK_IN_BLOCKED)
                .isWalkIn(true)
                .reminderSent(true)
                .notes("Заблокировано барбером: зашел клиент с улицы")
                .build());

        log.info("PATRON Barbershop seed data successfully populated: 3 branches, 9 barbers, 5 services, 4 sample bookings.");
    }
}
