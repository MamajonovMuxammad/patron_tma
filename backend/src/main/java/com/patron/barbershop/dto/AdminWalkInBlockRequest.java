package com.patron.barbershop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminWalkInBlockRequest {

    @NotNull
    private Long branchId;

    @NotNull
    private Long barberId;

    @NotNull
    private LocalDate bookingDate;

    @NotNull
    private String startTime; // "14:00"

    @Builder.Default
    private Integer durationMinutes = 45;

    @Builder.Default
    private String notes = "Клиент с улицы (Живая очередь)";
}
