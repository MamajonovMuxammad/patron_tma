package com.patron.barbershop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PatronApplication {

    public static void main(String[] args) {
        SpringApplication.run(PatronApplication.class, args);
    }
}
