package com.patron.barbershop.controller;

import com.patron.barbershop.dto.SlotDto;
import com.patron.barbershop.service.SlotAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SlotController {

    private final SlotAvailabilityService slotAvailabilityService;

    @GetMapping
    public ResponseEntity<List<SlotDto>> getSlots(
            @RequestParam Long branchId,
            @RequestParam(required = false) Long barberId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "45") int duration) {

        List<SlotDto> slots = slotAvailabilityService.getAvailableSlots(branchId, barberId, date, duration);
        return ResponseEntity.ok(slots);
    }

    @GetMapping("/quick")
    public ResponseEntity<Map<String, String>> getQuickAvailableSlot(@RequestParam Long branchId) {
        String text = slotAvailabilityService.findQuickAvailableSlotText(branchId)
                .orElse("Свободных окон на сегодня нет");
        return ResponseEntity.ok(Map.of("message", text));
    }
}
