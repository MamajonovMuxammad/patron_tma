package com.patron.barbershop.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "barbers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Barber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String titleRu; // Top Barber, Senior Barber, Barber
    private String titleUz;

    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private Integer reviewsCount = 120;

    private String specialtiesRu; // Skin Fade, Борода, Классика
    private String specialtiesUz;

    private String avatarUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @JsonIgnoreProperties("barbers")
    private Branch branch;

    @Builder.Default
    private Boolean active = true;
}
