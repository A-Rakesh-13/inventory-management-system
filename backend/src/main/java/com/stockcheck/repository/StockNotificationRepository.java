package com.stockcheck.repository;

import com.stockcheck.entity.StockNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockNotificationRepository extends JpaRepository<StockNotification, Long> {
    List<StockNotification> findByProductIdAndStatus(Long productId, String status);
    boolean existsByProductIdAndEmailAndStatus(Long productId, String email, String status);
}
