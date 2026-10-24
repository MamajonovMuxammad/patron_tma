package com.patron.barbershop.dto;

import com.patron.barbershop.entity.BookingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private String bookingNumber;

    private Long branchId;
    private String branchNameRu;
    private String branchNameUz;
    private String branchAddressRu;
    private String branchAddressUz;
    private String branchPhone;

    private Long barberId;
    private String barberName;
    private String barberTitleRu;
    private String barberTitleUz;

    private String clientName;
    private String clientPhone;
    private Long clientTelegramId;
    private String clientTelegramUsername;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer totalDurationMinutes;
    private Long totalPriceUzs;

    private BookingStatus status;
    private Boolean isWalkIn;
    private Boolean reminderSent;
    private String notes;

    private List<ServiceItemDto> services;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServiceItemDto {
        private Long id;
        private String nameRu;
        private String nameUz;
        private Integer durationMinutes;
        private Long priceUzs;
    }
}
