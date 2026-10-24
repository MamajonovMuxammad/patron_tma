package com.patron.barbershop.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "client_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ClientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long telegramId;

    private String username;

    private String firstName;

    private String lastName;

    private String phone;

    @Builder.Default
    private Boolean isBlocked = false;

    @Builder.Default
    private Integer totalVisits = 0;

    @Builder.Default
    private Integer noShowCount = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
