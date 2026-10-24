package com.patron.barbershop.repository;

import com.patron.barbershop.entity.Booking;
import com.patron.barbershop.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingNumber(String bookingNumber);

    List<Booking> findByBranchIdAndBookingDateOrderByStartTimeAsc(Long branchId, LocalDate bookingDate);

    List<Booking> findByBarberIdAndBookingDateOrderByStartTimeAsc(Long barberId, LocalDate bookingDate);

    List<Booking> findByClientTelegramIdOrderByBookingDateDescStartTimeDesc(Long clientTelegramId);

    @Query("SELECT b FROM Booking b WHERE b.barber.id = :barberId " +
           "AND b.bookingDate = :date " +
           "AND b.status NOT IN (com.patron.barbershop.entity.BookingStatus.CANCELLED, com.patron.barbershop.entity.BookingStatus.NO_SHOW) " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    List<Booking> findOverlappingBookings(@Param("barberId") Long barberId,
                                         @Param("date") LocalDate date,
                                         @Param("startTime") LocalTime startTime,
                                         @Param("endTime") LocalTime endTime);

    @Query("SELECT b FROM Booking b WHERE b.branch.id = :branchId " +
           "AND b.bookingDate = :date " +
           "AND b.status NOT IN (com.patron.barbershop.entity.BookingStatus.CANCELLED, com.patron.barbershop.entity.BookingStatus.NO_SHOW)")
    List<Booking> findActiveBookingsByBranchAndDate(@Param("branchId") Long branchId,
                                                   @Param("date") LocalDate date);

    @Query("SELECT b FROM Booking b WHERE b.bookingDate = :date " +
           "AND b.status = com.patron.barbershop.entity.BookingStatus.PENDING_CONFIRMATION " +
           "AND b.reminderSent = false " +
           "AND b.startTime <= :windowEnd AND b.startTime >= :now " +
           "AND b.clientTelegramId IS NOT NULL")
    List<Booking> findBookingsNeedingReminder(@Param("date") LocalDate date,
                                             @Param("now") LocalTime now,
                                             @Param("windowEnd") LocalTime windowEnd);
}
