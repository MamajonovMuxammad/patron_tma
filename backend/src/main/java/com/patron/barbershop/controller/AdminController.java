package com.patron.barbershop.controller;

import com.patron.barbershop.dto.AdminWalkInBlockRequest;
import com.patron.barbershop.dto.BookingResponse;
import com.patron.barbershop.dto.BranchDashboardDto;
import com.patron.barbershop.entity.BookingStatus;
import com.patron.barbershop.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final BookingService bookingService;

    @GetMapping("/dashboard")
    public ResponseEntity<BranchDashboardDto> getDashboard(
            @RequestParam Long branchId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDate targetDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(bookingService.getBranchDashboard(branchId, targetDate));
    }

    @PostMapping("/bookings/walk-in")
    public ResponseEntity<BookingResponse> blockWalkInSlot(@Valid @RequestBody AdminWalkInBlockRequest request) {
        return ResponseEntity.ok(bookingService.blockWalkInSlot(request));
    }

    @PostMapping("/bookings/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String statusStr = body.get("status");
        if (statusStr == null) {
            throw new IllegalArgumentException("Status is required");
        }
        BookingStatus status = BookingStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }
}
