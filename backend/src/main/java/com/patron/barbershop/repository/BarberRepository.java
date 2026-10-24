package com.patron.barbershop.repository;

import com.patron.barbershop.entity.Barber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarberRepository extends JpaRepository<Barber, Long> {
    List<Barber> findAllByBranchIdAndActiveTrue(Long branchId);
    List<Barber> findAllByActiveTrue();
}
