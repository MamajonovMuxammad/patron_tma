package com.patron.barbershop.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "branches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nameRu;

    @Column(nullable = false)
    private String nameUz;

    @Column(nullable = false)
    private String addressRu;

    @Column(nullable = false)
    private String addressUz;

    private String landmarkRu;
    private String landmarkUz;

    @Column(nullable = false)
    private String phone;

    @Builder.Default
    private String openingTime = "09:00";

    @Builder.Default
    private String closingTime = "21:00";

    private String mapUrl2Gis;
    private String mapUrlYandex;

    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("branch")
    @Builder.Default
    private List<Barber> barbers = new ArrayList<>();
}
