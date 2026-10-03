package com.stockcheck.service;

import com.stockcheck.dto.NotificationRequest;
import com.stockcheck.entity.Product;
import com.stockcheck.entity.StockNotification;
import com.stockcheck.exception.BadRequestException;
import com.stockcheck.exception.ResourceNotFoundException;
import com.stockcheck.repository.ProductRepository;
import com.stockcheck.repository.StockNotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final StockNotificationRepository notificationRepository;
    private final ProductRepository productRepository;

    public NotificationService(StockNotificationRepository notificationRepository, ProductRepository productRepository) {
        this.notificationRepository = notificationRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public void registerNotification(NotificationRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProductId()));

        if (product.getQuantity() > 0) {
            throw new BadRequestException("This product is currently in stock (" + product.getQuantity() + " units available).");
        }

        boolean alreadyRegistered = notificationRepository.existsByProductIdAndEmailAndStatus(
                request.getProductId(),
                request.getEmail().trim().toLowerCase(),
                "PENDING"
        );

        if (alreadyRegistered) {
            return; // Idempotent
        }

        StockNotification notification = new StockNotification(product, request.getEmail().trim().toLowerCase());
        notificationRepository.save(notification);
        logger.info("Registered notification for customer {} on product {}", request.getEmail(), product.getName());
    }

    @Transactional
    public void checkAndTriggerNotifications(Product product) {
        if (product.getQuantity() <= 0) {
            return;
        }

        List<StockNotification> pending = notificationRepository.findByProductIdAndStatus(product.getId(), "PENDING");
        for (StockNotification notif : pending) {
            notif.setStatus("NOTIFIED");
            notif.setNotifiedAt(LocalDateTime.now());
            notificationRepository.save(notif);
            logger.info("Notification triggered for {} - Product '{}' is back in stock with {} units!",
                    notif.getEmail(), product.getName(), product.getQuantity());
        }
    }
}
