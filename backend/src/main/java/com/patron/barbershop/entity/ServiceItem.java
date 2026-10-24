package com.patron.barbershop.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nameRu;

    @Column(nullable = false)
    private String nameUz;

    private String descriptionRu;
    private String descriptionUz;

    @Column(nullable = false)
    private Integer durationMinutes; // 45, 60, 30

    @Column(nullable = false)
    private Long priceUzs; // 100000, 140000, 60000

    @Builder.Default
    private String category = "GENERAL";

    @Builder.Default
    private Boolean active = true;
}
