package com.patron.barbershop.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.patron.barbershop.entity.Booking;
import com.patron.barbershop.entity.BookingStatus;
import com.patron.barbershop.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.NumberFormat;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
public class TelegramBotService {

    private final String botToken;
    private final String adminChatId;
    private final String miniAppUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final BookingRepository bookingRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public TelegramBotService(
            @Value("${patron.telegram.bot-token:}") String botToken,
            @Value("${patron.telegram.admin-chat-id:0}") String adminChatId,
            @Value("${patron.telegram.miniapp-url:http://localhost:5173}") String miniAppUrl,
            BookingRepository bookingRepository) {
        this.botToken = botToken;
        this.adminChatId = adminChatId;
        this.miniAppUrl = miniAppUrl;
        this.bookingRepository = bookingRepository;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Checks if Telegram Bot is configured with a real token.
     */
    public boolean isConfigured() {
        return botToken != null && !botToken.isBlank() && !botToken.startsWith("test_token");
    }

    /**
     * Sends booking confirmation message to client with cancellation button.
     */
    public void notifyClientNewBooking(Booking booking) {
        if (booking.getClientTelegramId() == null) {
            log.info("Client has no Telegram ID, skipping TG message for booking {}", booking.getBookingNumber());
            return;
        }

        String priceStr = NumberFormat.getInstance(new Locale("ru", "RU")).format(booking.getTotalPriceUzs());

        String message = String.format("""
                💈 <b>Вы записаны в Barbershop «PATRON»!</b>
                
                📍 <b>Филиал:</b> %s
                🏠 <b>Адрес:</b> %s
                ✂️ <b>Мастер:</b> %s
                📅 <b>Дата:</b> %s
                ⏰ <b>Время:</b> %s – %s
                💰 <b>Сумма:</b> %s сум
                🔢 <b>Номер брони:</b> #%s
                
                <i>Ждем вас! Пожалуйста, приходите за 5 минут до начала. За 2 часа до визита мы пришлем напоминание.</i>
                """,
                booking.getBranch().getNameRu(),
                booking.getBranch().getAddressRu(),
                booking.getBarber() != null ? booking.getBarber().getName() : "Любой мастер",
                booking.getBookingDate().format(DATE_FMT),
                booking.getStartTime().format(TIME_FMT),
                booking.getEndTime().format(TIME_FMT),
                priceStr,
                booking.getBookingNumber()
        );

        // Inline keyboard with Cancel button
        Map<String, Object> replyMarkup = Map.of(
                "inline_keyboard", List.of(
                        List.of(
                                Map.of("text", "❌ Отменить запись", "callback_data", "cancel_booking_" + booking.getId())
                        )
                )
        );

        sendMessage(booking.getClientTelegramId().toString(), message, replyMarkup);
    }

    /**
     * Sends notification to barber / branch admin chat.
     */
    public void notifyAdminNewBooking(Booking booking) {
        if (adminChatId == null || adminChatId.equals("0")) {
            log.info("Admin chat ID not set, skipping admin push for booking {}", booking.getBookingNumber());
            return;
        }

        String priceStr = NumberFormat.getInstance(new Locale("ru", "RU")).format(booking.getTotalPriceUzs());
        String clientHandle = booking.getClientTelegramUsername() != null ?
                "@" + booking.getClientTelegramUsername() : "нет username";

        String message = String.format("""
                🔥 <b>НОВАЯ ОНЛАЙН-ЗАПИСЬ В PATRON!</b>
                
                📍 <b>Филиал:</b> %s
                ✂️ <b>Барбер:</b> %s
                👤 <b>Клиент:</b> %s (%s)
                📞 <b>Тел:</b> %s
                📅 <b>Когда:</b> %s в %s
                ⏱ <b>Длительность:</b> %d мин
                💰 <b>Сумма:</b> %s сум
                """,
                booking.getBranch().getNameRu(),
                booking.getBarber() != null ? booking.getBarber().getName() : "Любой",
                booking.getClientName(),
                clientHandle,
                booking.getClientPhone(),
                booking.getBookingDate().format(DATE_FMT),
                booking.getStartTime().format(TIME_FMT),
                booking.getTotalDurationMinutes(),
                priceStr
        );

        sendMessage(adminChatId, message, null);
    }

    /**
     * Sends 2-hour pre-appointment reminder to client with interactive confirmation buttons.
     */
    public void sendPreAppointmentReminder(Booking booking) {
        if (booking.getClientTelegramId() == null) {
            return;
        }

        String message = String.format("""
                ⏰ <b>Напоминание о стрижке в «PATRON»!</b>
                
                У вас запись сегодня в <b>%s</b> у мастера <b>%s</b>.
                📍 Филиал: %s (%s)
                
                <b>Подтвердите, пожалуйста, ваш визит:</b>
                """,
                booking.getStartTime().format(TIME_FMT),
                booking.getBarber() != null ? booking.getBarber().getName() : "Мастер",
                booking.getBranch().getNameRu(),
                booking.getBranch().getAddressRu()
        );

        Map<String, Object> replyMarkup = Map.of(
                "inline_keyboard", List.of(
                        List.of(
                                Map.of("text", "✅ Точно приду! (Tasdiqlash)", "callback_data", "confirm_booking_" + booking.getId()),
                                Map.of("text", "❌ Не смогу прийти (Bekor)", "callback_data", "cancel_booking_" + booking.getId())
                        )
                )
        );

        sendMessage(booking.getClientTelegramId().toString(), message, replyMarkup);
    }

    /**
     * Handles /start message with Mini App WebApp button.
     */
    public void sendWelcomeMessage(String chatId, String firstName) {
        String welcome = String.format("""
                Салом, %s! 💈 Добро пожаловать в <b>Barbershop «PATRON» (Ташкент)</b>.
                
                Премиальные мужские стрижки, моделирование бороды и уход.
                Запишитесь в 3 клика без очередей и звонков:
                """, firstName != null ? firstName : "друг");

        Map<String, Object> replyMarkup = Map.of(
                "inline_keyboard", List.of(
                        List.of(
                                Map.of(
                                        "text", "💈 Записаться в PATRON (Открыть Mini App)",
                                        "web_app", Map.of("url", miniAppUrl)
                                )
                        )
                )
        );

        sendMessage(chatId, welcome, replyMarkup);
    }

    /**
     * Processes Telegram Webhook Update (messages, commands, callback queries).
     */
    public void processUpdate(String updateJson) {
        try {
            JsonNode root = objectMapper.readTree(updateJson);

            // Handle callback query (button clicks)
            if (root.has("callback_query")) {
                JsonNode cb = root.get("callback_query");
                String callbackId = cb.path("id").asText();
                String data = cb.path("data").asText();
                String fromChatId = cb.path("from").path("id").asText();

                handleCallbackQuery(callbackId, fromChatId, data);
                return;
            }

            // Handle incoming message (e.g. /start)
            if (root.has("message")) {
                JsonNode message = root.get("message");
                String text = message.path("text").asText("");
                String chatId = message.path("chat").path("id").asText();
                String firstName = message.path("from").path("first_name").asText("друг");

                if (text.startsWith("/start")) {
                    sendWelcomeMessage(chatId, firstName);
                }
            }
        } catch (Exception e) {
            log.error("Error processing Telegram update: {}", e.getMessage(), e);
        }
    }

    private void handleCallbackQuery(String callbackQueryId, String chatId, String data) {
        answerCallbackQuery(callbackQueryId, "Обрабатываем ваш выбор...");

        if (data.startsWith("confirm_booking_")) {
            Long bookingId = Long.parseLong(data.substring("confirm_booking_".length()));
            bookingRepository.findById(bookingId).ifPresent(booking -> {
                booking.setStatus(BookingStatus.CONFIRMED);
                bookingRepository.save(booking);

                sendMessage(chatId, "✅ <b>Отлично! Ваш визит подтвержден.</b> Мастер ждет вас к "
                        + booking.getStartTime().format(TIME_FMT) + "!", null);

                // Notify admin that client confirmed
                if (adminChatId != null && !adminChatId.equals("0")) {
                    sendMessage(adminChatId, "✅ <b>Клиент подтвердил визит!</b> Бронь #" + booking.getBookingNumber()
                            + " (" + booking.getClientName() + ", " + booking.getStartTime().format(TIME_FMT) + ")", null);
                }
            });
        } else if (data.startsWith("cancel_booking_")) {
            Long bookingId = Long.parseLong(data.substring("cancel_booking_".length()));
            bookingRepository.findById(bookingId).ifPresent(booking -> {
                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);

                sendMessage(chatId, "❌ <b>Запись успешно отменена.</b> Слот освобожден. Вы всегда можете записаться снова через Mini App!", null);

                // Notify admin that client cancelled
                if (adminChatId != null && !adminChatId.equals("0")) {
                    sendMessage(adminChatId, "⚠️ <b>Клиент отменил запись!</b> Слот в " + booking.getStartTime().format(TIME_FMT)
                            + " у мастера " + (booking.getBarber() != null ? booking.getBarber().getName() : "")
                            + " теперь свободен!", null);
                }
            });
        }
    }

    private void answerCallbackQuery(String callbackQueryId, String text) {
        if (!isConfigured()) return;
        try {
            Map<String, Object> body = Map.of(
                    "callback_query_id", callbackQueryId,
                    "text", text
            );
            executeTelegramPost("answerCallbackQuery", body);
        } catch (Exception e) {
            log.error("Failed to answer callback query: {}", e.getMessage());
        }
    }

    public void sendMessage(String chatId, String htmlText, Map<String, Object> replyMarkup) {
        if (!isConfigured()) {
            log.info("[MOCK TELEGRAM BOT] To: {}, Text: {}", chatId, htmlText.replaceAll("<[^>]*>", ""));
            return;
        }

        try {
            Map<String, Object> body = new HashMap<>();
            body.put("chat_id", chatId);
            body.put("text", htmlText);
            body.put("parse_mode", "HTML");
            if (replyMarkup != null) {
                body.put("reply_markup", replyMarkup);
            }

            executeTelegramPost("sendMessage", body);
        } catch (Exception e) {
            log.error("Failed to send Telegram message to {}: {}", chatId, e.getMessage());
        }
    }

    private void executeTelegramPost(String method, Map<String, Object> body) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/" + method;
            String jsonBody = objectMapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(res -> {
                        if (res.statusCode() >= 400) {
                            log.warn("Telegram API error {} for method {}: {}", res.statusCode(), method, res.body());
                        }
                    });
        } catch (Exception e) {
            log.error("Error invoking Telegram API {}: {}", method, e.getMessage());
        }
    }
}
