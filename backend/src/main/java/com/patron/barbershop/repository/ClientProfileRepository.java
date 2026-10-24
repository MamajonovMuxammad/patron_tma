package com.patron.barbershop.repository;

import com.patron.barbershop.entity.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {
    Optional<ClientProfile> findByTelegramId(Long telegramId);
    Optional<ClientProfile> findByPhone(String phone);
}
