package com.patron.barbershop.service;

import com.patron.barbershop.dto.*;
import com.patron.barbershop.entity.*;
import com.patron.barbershop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BranchRepository branchRepository;
    private final BarberRepository barberRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final SlotAvailabilityService slotAvailabilityService;
    private final TelegramBotService telegramBotService;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new IllegalArgumentException("Филиал не найден"));

        List<ServiceItem> services = serviceItemRepository.findAllById(request.getServiceIds());
        if (services.isEmpty()) {
            throw new IllegalArgumentException("Не выбрана ни одна услуга");
        }

        int totalDuration = services.stream().mapToInt(ServiceItem::getDurationMinutes).sum();
        long totalPrice = services.stream().mapToLong(ServiceItem::getPriceUzs).sum();

        LocalTime startTime = LocalTime.parse(request.getStartTime(), TIME_FMT);
        LocalTime endTime = startTime.plusMinutes(totalDuration);

        // Check closing time
        LocalTime closingTime = LocalTime.parse(branch.getClosingTime(), TIME_FMT);
        if (endTime.isAfter(closingTime)) {
            throw new IllegalStateException("Время стрижки выходит за рамки работы филиала (" + branch.getClosingTime() + ")");
        }

        // Determine Barber: if null, find first free barber in this branch
        Barber barber;
        if (request.getBarberId() != null) {
            barber = barberRepository.findById(request.getBarberId())
                    .orElseThrow(() -> new IllegalArgumentException("Мастер не найден"));
            if (!slotAvailabilityService.isIntervalFree(barber.getId(), request.getBookingDate(), startTime, endTime)) {
                throw new IllegalStateException("Выбранное время уже занято у мастера " + barber.getName() + ". Пожалуйста, выберите другой слот.");
            }
        } else {
            List<Barber> branchBarbers = barberRepository.findAllByBranchIdAndActiveTrue(branch.getId());
            barber = branchBarbers.stream()
                    .filter(b -> slotAvailabilityService.isIntervalFree(b.getId(), request.getBookingDate(), startTime, endTime))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("На это время нет свободных мастеров. Пожалуйста, выберите другое время."));
        }

        // Save or update Client Profile
        ClientProfile client = null;
        if (request.getClientTelegramId() != null) {
            client = clientProfileRepository.findByTelegramId(request.getClientTelegramId())
                    .orElseGet(() -> ClientProfile.builder()
                            .telegramId(request.getClientTelegramId())
                            .username(request.getClientTelegramUsername())
                            .firstName(request.getClientName())
                            .phone(request.getClientPhone())
                            .build());
            client.setPhone(request.getClientPhone());
            client = clientProfileRepository.save(client);
        }

        String bookingNumber = "PT-" + (1000 + RANDOM.nextInt(9000));

        Booking booking = Booking.builder()
                .bookingNumber(bookingNumber)
                .branch(branch)
                .barber(barber)
                .client(client)
                .clientName(request.getClientName())
                .clientPhone(request.getClientPhone())
                .clientTelegramId(request.getClientTelegramId())
                .clientTelegramUsername(request.getClientTelegramUsername())
                .bookingDate(request.getBookingDate())
                .startTime(startTime)
                .endTime(endTime)
                .totalDurationMinutes(totalDuration)
                .totalPriceUzs(totalPrice)
                .status(BookingStatus.PENDING_CONFIRMATION)
                .isWalkIn(false)
                .reminderSent(false)
                .notes(request.getNotes())
                .services(services)
                .build();

        Booking saved = bookingRepository.save(booking);

        // Send Telegram notifications (100% free via bot)
        try {
            telegramBotService.notifyClientNewBooking(saved);
            telegramBotService.notifyAdminNewBooking(saved);
        } catch (Exception e) {
            log.error("Failed to send Telegram notifications for booking #{}: {}", saved.getBookingNumber(), e.getMessage());
        }

        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponse blockWalkInSlot(AdminWalkInBlockRequest req) {
        Branch branch = branchRepository.findById(req.getBranchId())
                .orElseThrow(() -> new IllegalArgumentException("Филиал не найден"));
        Barber barber = barberRepository.findById(req.getBarberId())
                .orElseThrow(() -> new IllegalArgumentException("Мастер не найден"));

        LocalTime start = LocalTime.parse(req.getStartTime(), TIME_FMT);
        int duration = req.getDurationMinutes() != null ? req.getDurationMinutes() : 45;
        LocalTime end = start.plusMinutes(duration);

        if (!slotAvailabilityService.isIntervalFree(barber.getId(), req.getBookingDate(), start, end)) {
            throw new IllegalStateException("Этот слот уже занят!");
        }

        String bookingNumber = "WALK-" + (100 + RANDOM.nextInt(900));

        Booking booking = Booking.builder()
                .bookingNumber(bookingNumber)
                .branch(branch)
                .barber(barber)
                .clientName("Живая очередь / Гость")
                .clientPhone("+998 00 000-00-00")
                .bookingDate(req.getBookingDate())
                .startTime(start)
                .endTime(end)
                .totalDurationMinutes(duration)
                .totalPriceUzs(100000L) // Default walk-in estimation
                .status(BookingStatus.WALK_IN_BLOCKED)
                .isWalkIn(true)
                .reminderSent(true)
                .notes(req.getNotes() != null ? req.getNotes() : "Клиент с улицы")
                .build();

        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponse updateStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Запись не найдена"));

        booking.setStatus(newStatus);
        if (newStatus == BookingStatus.COMPLETED && booking.getClient() != null) {
            booking.getClient().setTotalVisits(booking.getClient().getTotalVisits() + 1);
        } else if (newStatus == BookingStatus.NO_SHOW && booking.getClient() != null) {
            booking.getClient().setNoShowCount(booking.getClient().getNoShowCount() + 1);
        }

        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long telegramId) {
        if (telegramId == null) return Collections.emptyList();
        return bookingRepository.findByClientTelegramIdOrderByBookingDateDescStartTimeDesc(telegramId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BranchDashboardDto getBranchDashboard(Long branchId, LocalDate date) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("Филиал не найден"));

        List<Booking> bookings = bookingRepository.findByBranchIdAndBookingDateOrderByStartTimeAsc(branchId, date);

        int total = bookings.size();
        int confirmed = 0;
        int pending = 0;
        int completed = 0;
        int noShow = 0;
        int walkIn = 0;
        long expectedRev = 0;
        long actualRev = 0;

        for (Booking b : bookings) {
            if (b.getStatus() == BookingStatus.CONFIRMED) confirmed++;
            else if (b.getStatus() == BookingStatus.PENDING_CONFIRMATION) pending++;
            else if (b.getStatus() == BookingStatus.COMPLETED) {
                completed++;
                actualRev += b.getTotalPriceUzs();
            } else if (b.getStatus() == BookingStatus.NO_SHOW) noShow++;
            else if (b.getStatus() == BookingStatus.WALK_IN_BLOCKED) walkIn++;

            if (b.getStatus() != BookingStatus.CANCELLED && b.getStatus() != BookingStatus.NO_SHOW) {
                expectedRev += b.getTotalPriceUzs();
            }
        }

        // Available slots count
        List<SlotDto> slots = slotAvailabilityService.getAvailableSlots(branchId, null, date, 45);
        int availableSlotsCount = (int) slots.stream().filter(SlotDto::isAvailable).count();
        String quickSeat = slotAvailabilityService.findQuickAvailableSlotText(branchId).orElse("Все мастера заняты");

        return BranchDashboardDto.builder()
                .branchId(branch.getId())
                .branchNameRu(branch.getNameRu())
                .branchNameUz(branch.getNameUz())
                .date(date)
                .totalBookings(total)
                .confirmedCount(confirmed)
                .pendingCount(pending)
                .completedCount(completed)
                .noShowCount(noShow)
                .walkInBlockedCount(walkIn)
                .expectedRevenueUzs(expectedRev)
                .actualCompletedRevenueUzs(actualRev)
                .availableSlotsCount(availableSlotsCount)
                .quickAvailableSeatText(quickSeat)
                .bookings(bookings.stream().map(this::mapToResponse).collect(Collectors.toList()))
                .build();
    }

    public BookingResponse mapToResponse(Booking b) {
        List<BookingResponse.ServiceItemDto> serviceDtos = b.getServices().stream()
                .map(s -> BookingResponse.ServiceItemDto.builder()
                        .id(s.getId())
                        .nameRu(s.getNameRu())
                        .nameUz(s.getNameUz())
                        .durationMinutes(s.getDurationMinutes())
                        .priceUzs(s.getPriceUzs())
                        .build())
                .collect(Collectors.toList());

        return BookingResponse.builder()
                .id(b.getId())
                .bookingNumber(b.getBookingNumber())
                .branchId(b.getBranch().getId())
                .branchNameRu(b.getBranch().getNameRu())
                .branchNameUz(b.getBranch().getNameUz())
                .branchAddressRu(b.getBranch().getAddressRu())
                .branchAddressUz(b.getBranch().getAddressUz())
                .branchPhone(b.getBranch().getPhone())
                .barberId(b.getBarber() != null ? b.getBarber().getId() : null)
                .barberName(b.getBarber() != null ? b.getBarber().getName() : "Любой мастер")
                .barberTitleRu(b.getBarber() != null ? b.getBarber().getTitleRu() : "")
                .barberTitleUz(b.getBarber() != null ? b.getBarber().getTitleUz() : "")
                .clientName(b.getClientName())
                .clientPhone(b.getClientPhone())
                .clientTelegramId(b.getClientTelegramId())
                .clientTelegramUsername(b.getClientTelegramUsername())
                .bookingDate(b.getBookingDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .totalDurationMinutes(b.getTotalDurationMinutes())
                .totalPriceUzs(b.getTotalPriceUzs())
                .status(b.getStatus())
                .isWalkIn(b.getIsWalkIn())
                .reminderSent(b.getReminderSent())
                .notes(b.getNotes())
                .services(serviceDtos)
                .build();
    }
}
