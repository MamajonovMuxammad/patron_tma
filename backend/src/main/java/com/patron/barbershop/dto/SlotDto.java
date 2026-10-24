package com.patron.barbershop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlotDto {
    private String time; // "09:00", "09:30"
    private boolean available;
    private Long barberId;
    private String barberName;
    private String reason; // if not available
}
