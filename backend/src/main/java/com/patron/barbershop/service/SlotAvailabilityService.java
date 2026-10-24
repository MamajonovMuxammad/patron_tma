package com.patron.barbershop.service;

import com.patron.barbershop.dto.SlotDto;
import com.patron.barbershop.entity.Barber;
import com.patron.barbershop.entity.Booking;
import com.patron.barbershop.entity.BookingStatus;
import com.patron.barbershop.repository.BarberRepository;
import com.patron.barbershop.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlotAvailabilityService {

    private final BarberRepository barberRepository;
    private final BookingRepository bookingRepository;

    private static final LocalTime WORK_START = LocalTime.of(9, 0);
    private static final LocalTime WORK_END = LocalTime.of(21, 0);
    private static final int GRID_STEP_MINUTES = 30;
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Calculates available time slots for a branch, optional barber, date, and required service duration.
     */
    public List<SlotDto> getAvailableSlots(Long branchId, Long barberId, LocalDate date, int durationMinutes) {
        List<Barber> barbers;
        if (barberId != null) {
            barberRepository.findById(barberId).ifPresent(b -> {
                if (!b.getActive()) {
                    throw new IllegalArgumentException("Barber is inactive");
                }
            });
            barbers = barberRepository.findById(barberId).map(List::of).orElse(Collections.emptyList());
        } else {
            barbers = barberRepository.findAllByBranchIdAndActiveTrue(branchId);
        }

        if (barbers.isEmpty()) {
            return Collections.emptyList();
        }

        // Fetch all active bookings on that date for relevant barbers
        List<Booking> existingBookings = bookingRepository.findActiveBookingsByBranchAndDate(branchId, date);

        // Map existing bookings by barberId
        Map<Long, List<Booking>> bookingsByBarber = new HashMap<>();
        for (Barber barber : barbers) {
            bookingsByBarber.put(barber.getId(), new ArrayList<>());
        }
        for (Booking b : existingBookings) {
            if (b.getBarber() != null && bookingsByBarber.containsKey(b.getBarber().getId())) {
                bookingsByBarber.get(b.getBarber().getId()).add(b);
            }
        }

        List<SlotDto> slots = new ArrayList<>();
        LocalTime current = WORK_START;
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        while (!current.isAfter(WORK_END.minusMinutes(durationMinutes))) {
            LocalTime slotStart = current;
            LocalTime slotEnd = slotStart.plusMinutes(durationMinutes);
            String timeStr = slotStart.format(TIME_FORMAT);

            // If requested date is today, slot must be in the future (at least 10 min from now)
            boolean isPast = date.isBefore(today) || (date.isEqual(today) && slotStart.isBefore(now.plusMinutes(10)));

            if (isPast) {
                slots.add(SlotDto.builder()
                        .time(timeStr)
                        .available(false)
                        .reason("Время уже прошло")
                        .build());
            } else {
                // Find if there is any barber available for [slotStart, slotEnd)
                Optional<Barber> freeBarber = findFreeBarber(barbers, bookingsByBarber, slotStart, slotEnd);

                if (freeBarber.isPresent()) {
                    slots.add(SlotDto.builder()
                            .time(timeStr)
                            .available(true)
                            .barberId(freeBarber.get().getId())
                            .barberName(freeBarber.get().getName())
                            .build());
                } else {
                    slots.add(SlotDto.builder()
                            .time(timeStr)
                            .available(false)
                            .reason("Все мастера заняты")
                            .build());
                }
            }

            current = current.plusMinutes(GRID_STEP_MINUTES);
        }

        return slots;
    }

    /**
     * Checks if a given time interval has any collision for the specified barber.
     */
    public boolean isIntervalFree(Long barberId, LocalDate date, LocalTime start, LocalTime end) {
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(barberId, date, start, end);
        return overlaps.isEmpty();
    }

    /**
     * Finds the first available barber who has no overlapping bookings in [slotStart, slotEnd).
     */
    private Optional<Barber> findFreeBarber(List<Barber> barbers, Map<Long, List<Booking>> bookingsByBarber,
                                           LocalTime start, LocalTime end) {
        for (Barber barber : barbers) {
            List<Booking> barberBookings = bookingsByBarber.getOrDefault(barber.getId(), Collections.emptyList());
            boolean overlaps = barberBookings.stream().anyMatch(b ->
                    b.getStatus() != BookingStatus.CANCELLED &&
                    b.getStatus() != BookingStatus.NO_SHOW &&
                    isOverlapping(start, end, b.getStartTime(), b.getEndTime())
            );

            if (!overlaps) {
                return Optional.of(barber);
            }
        }
        return Optional.empty();
    }

    /**
     * Strict interval overlap check:
     * Two intervals [s1, e1) and [s2, e2) overlap if s1 < e2 AND e1 > s2.
     */
    private boolean isOverlapping(LocalTime s1, LocalTime e1, LocalTime s2, LocalTime e2) {
        return s1.isBefore(e2) && e1.isAfter(s2);
    }

    /**
     * Quick "Свободно прямо сейчас": finds next available 45-min slot today.
     */
    public Optional<String> findQuickAvailableSlotText(Long branchId) {
        LocalDate today = LocalDate.now();
        List<SlotDto> slots = getAvailableSlots(branchId, null, today, 45);
        for (SlotDto slot : slots) {
            if (slot.isAvailable()) {
                return Optional.of("Ближайшее свободное кресло в " + slot.getTime() +
                        (slot.getBarberName() != null ? " (Мастер: " + slot.getBarberName() + ")" : ""));
            }
        }
        return Optional.of("На сегодня все окна заняты — запишитесь на завтра");
    }
}
