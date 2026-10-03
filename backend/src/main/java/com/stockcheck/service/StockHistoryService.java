package com.stockcheck.service;

import com.stockcheck.dto.StockHistoryDTO;
import com.stockcheck.entity.Product;
import com.stockcheck.entity.StockChangeReason;
import com.stockcheck.entity.StockHistory;
import com.stockcheck.repository.StockHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockHistoryService {

    private final StockHistoryRepository stockHistoryRepository;

    public StockHistoryService(StockHistoryRepository stockHistoryRepository) {
        this.stockHistoryRepository = stockHistoryRepository;
    }

    @Transactional
    public StockHistory recordChange(Product product, int prevQty, int newQty, StockChangeReason reason, String changedBy) {
        int delta = newQty - prevQty;
        StockHistory history = new StockHistory(
                product,
                prevQty,
                newQty,
                delta,
                reason,
                changedBy != null ? changedBy : "System"
        );
        return stockHistoryRepository.save(history);
    }

    public List<StockHistoryDTO> getHistoryForProduct(Long productId) {
        return stockHistoryRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<StockHistoryDTO> getRecentHistory(int limit) {
        return stockHistoryRepository.findTop15ByOrderByCreatedAtDesc().stream()
                .limit(limit)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<StockHistoryDTO> getAllHistory() {
        return stockHistoryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public StockHistoryDTO mapToDTO(StockHistory history) {
        StockHistoryDTO dto = new StockHistoryDTO();
        dto.setId(history.getId());
        dto.setProductId(history.getProduct().getId());
        dto.setProductName(history.getProduct().getName());
        dto.setProductSku(history.getProduct().getSku());
        dto.setPreviousQuantity(history.getPreviousQuantity());
        dto.setNewQuantity(history.getNewQuantity());
        dto.setChangeAmount(history.getChangeAmount());
        dto.setReason(history.getReason());
        dto.setChangedBy(history.getChangedBy());
        dto.setCreatedAt(history.getCreatedAt());
        return dto;
    }
}
