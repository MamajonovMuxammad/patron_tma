package com.patron.barbershop.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchDashboardDto {
    private Long branchId;
    private String branchNameRu;
    private String branchNameUz;
    private LocalDate date;

    private int totalBookings;
    private int confirmedCount;
    private int pendingCount;
    private int completedCount;
    private int noShowCount;
    private int walkInBlockedCount;

    private long expectedRevenueUzs;
    private long actualCompletedRevenueUzs;

    private int availableSlotsCount;
    private String quickAvailableSeatText; // "Свободно через 15 мин у Шохазиза"

    private List<BookingResponse> bookings;
}
