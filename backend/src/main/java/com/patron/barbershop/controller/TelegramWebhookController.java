package com.patron.barbershop.controller;

import com.patron.barbershop.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/telegram")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TelegramWebhookController {

    private final TelegramBotService telegramBotService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleTelegramWebhook(@RequestBody String updateJson) {
        log.debug("Received Telegram webhook update");
        telegramBotService.processUpdate(updateJson);
        return ResponseEntity.ok("OK");
    }
}
