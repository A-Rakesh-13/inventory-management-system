package com.stockcheck.repository;

import com.stockcheck.entity.StockHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {
    List<StockHistory> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<StockHistory> findTop15ByOrderByCreatedAtDesc();
    List<StockHistory> findAllByOrderByCreatedAtDesc();
}
