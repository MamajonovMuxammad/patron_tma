package com.patron.barbershop.controller;

import com.patron.barbershop.entity.ServiceItem;
import com.patron.barbershop.repository.ServiceItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceItemRepository serviceItemRepository;

    @GetMapping
    public ResponseEntity<List<ServiceItem>> getAllServices() {
        return ResponseEntity.ok(serviceItemRepository.findAllByActiveTrue());
    }
}
