package com.patron.barbershop.entity;

public enum BookingStatus {
    PENDING_CONFIRMATION, // Ожидает авто-подтверждения / создана
    CONFIRMED,            // Клиент подтвердил визит (кнопка в боте или админ)
    COMPLETED,            // Стрижка завершена, оплачено
    CANCELLED,            // Отменена клиентом или барбером
    NO_SHOW,              // Клиент не пришел
    WALK_IN_BLOCKED       // Заблокировано для клиента из живой очереди
}
