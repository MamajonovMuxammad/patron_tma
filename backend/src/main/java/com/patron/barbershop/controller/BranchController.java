package com.patron.barbershop.controller;

import com.patron.barbershop.entity.Barber;
import com.patron.barbershop.entity.Branch;
import com.patron.barbershop.repository.BarberRepository;
import com.patron.barbershop.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BranchController {

    private final BranchRepository branchRepository;
    private final BarberRepository barberRepository;

    @GetMapping
    public ResponseEntity<List<Branch>> getAllBranches() {
        return ResponseEntity.ok(branchRepository.findAllByActiveTrue());
    }

    @GetMapping("/{id}/barbers")
    public ResponseEntity<List<Barber>> getBarbersByBranch(@PathVariable Long id) {
        return ResponseEntity.ok(barberRepository.findAllByBranchIdAndActiveTrue(id));
    }
}
