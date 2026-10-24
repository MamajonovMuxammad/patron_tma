package com.patron.barbershop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingRequest {

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    private Long barberId; // Nullable if "Any available barber" selected

    @NotEmpty(message = "At least one service must be selected")
    private List<Long> serviceIds;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotBlank(message = "Start time is required (e.g. 14:30)")
    private String startTime;

    @NotBlank(message = "Client name is required")
    private String clientName;

    @NotBlank(message = "Phone number is required")
    private String clientPhone;

    private Long clientTelegramId;
    private String clientTelegramUsername;
    private String notes;
}
