package com.patron.barbershop.service;

import com.patron.barbershop.entity.Booking;
import com.patron.barbershop.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingReminderScheduler {

    private final BookingRepository bookingRepository;
    private final TelegramBotService telegramBotService;

    /**
     * Runs every 5 minutes (300,000 ms) to search for bookings within 2 hours of appointment time.
     */
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void runAntiNoShowReminders() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        LocalTime windowEnd = now.plusHours(2);

        log.debug("Checking anti-no-show reminders for {} between {} and {}", today, now, windowEnd);

        List<Booking> needingReminder = bookingRepository.findBookingsNeedingReminder(today, now, windowEnd);

        if (!needingReminder.isEmpty()) {
            log.info("Found {} bookings needing 2-hour pre-visit reminder", needingReminder.size());
            for (Booking booking : needingReminder) {
                try {
                    telegramBotService.sendPreAppointmentReminder(booking);
                    booking.setReminderSent(true);
                    bookingRepository.save(booking);
                    log.info("Successfully sent reminder for booking #{}", booking.getBookingNumber());
                } catch (Exception e) {
                    log.error("Failed to send reminder for booking #{}: {}", booking.getBookingNumber(), e.getMessage());
                }
            }
        }
    }
}
