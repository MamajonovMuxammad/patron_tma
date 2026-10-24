package com.patron.barbershop.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TelegramWebAppAuthValidator {

    private final String botToken;
    private final ObjectMapper objectMapper;

    public TelegramWebAppAuthValidator(@Value("${patron.telegram.bot-token:}") String botToken) {
        this.botToken = botToken;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Validates Telegram WebApp initData string using HMAC-SHA256.
     * Returns true if valid or if in local development mode without token.
     */
    public boolean validateInitData(String initData) {
        if (initData == null || initData.isBlank()) {
            return false;
        }

        // Allow bypassing in local dev if token is default test token
        if (botToken == null || botToken.isBlank() || botToken.startsWith("test_token")) {
            log.debug("Skipping Telegram HMAC validation in dev mode");
            return true;
        }

        try {
            Map<String, String> params = parseQueryString(initData);
            String hash = params.get("hash");
            if (hash == null) {
                return false;
            }

            // Check auth_date freshness (e.g. max 24 hours)
            String authDateStr = params.get("auth_date");
            if (authDateStr != null) {
                long authDate = Long.parseLong(authDateStr);
                long now = Instant.now().getEpochSecond();
                if (now - authDate > 86400) {
                    log.warn("Telegram initData expired. authDate: {}, now: {}", authDate, now);
                    return false;
                }
            }

            // Construct data check string
            String dataCheckString = params.entrySet().stream()
                    .filter(e -> !e.getKey().equals("hash"))
                    .sorted(Map.Entry.comparingByKey())
                    .map(e -> e.getKey() + "=" + e.getValue())
                    .collect(Collectors.joining("\n"));

            // 1. secret_key = HMAC_SHA256("WebAppData", botToken)
            byte[] secretKey = hmacSha256("WebAppData".getBytes(StandardCharsets.UTF_8), botToken.getBytes(StandardCharsets.UTF_8));

            // 2. data_hash = Hex(HMAC_SHA256(secret_key, dataCheckString))
            byte[] calculatedHashBytes = hmacSha256(secretKey, dataCheckString.getBytes(StandardCharsets.UTF_8));
            String calculatedHashHex = bytesToHex(calculatedHashBytes);

            return calculatedHashHex.equalsIgnoreCase(hash);
        } catch (Exception e) {
            log.error("Failed to validate Telegram WebApp initData: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extracts user object from initData query string.
     */
    public JsonNode extractUser(String initData) {
        try {
            Map<String, String> params = parseQueryString(initData);
            String userJson = params.get("user");
            if (userJson != null) {
                return objectMapper.readTree(userJson);
            }
        } catch (Exception e) {
            log.error("Error parsing user from initData: {}", e.getMessage());
        }
        return null;
    }

    private Map<String, String> parseQueryString(String queryString) {
        Map<String, String> map = new HashMap<>();
        String[] pairs = queryString.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
                map.put(key, value);
            }
        }
        return map;
    }

    private byte[] hmacSha256(byte[] key, byte[] data) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key, "HmacSHA256");
        mac.init(secretKeySpec);
        return mac.doFinal(data);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
