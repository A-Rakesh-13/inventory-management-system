package com.stockcheck.controller;

import com.stockcheck.dto.NotificationRequest;
import com.stockcheck.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<?> registerNotification(@Valid @RequestBody NotificationRequest request) {
        notificationService.registerNotification(request);
        return ResponseEntity.ok(Map.of("message", "We will notify you at " + request.getEmail() + " when this product is back in stock."));
    }
}
