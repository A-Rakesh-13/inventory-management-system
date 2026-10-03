package com.stockcheck.controller;

import com.stockcheck.dto.StockHistoryDTO;
import com.stockcheck.service.StockHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stock-history")
public class StockHistoryController {

    private final StockHistoryService stockHistoryService;

    public StockHistoryController(StockHistoryService stockHistoryService) {
        this.stockHistoryService = stockHistoryService;
    }

    @GetMapping
    public ResponseEntity<List<StockHistoryDTO>> getRecentHistory(@RequestParam(defaultValue = "15") int limit) {
        return ResponseEntity.ok(stockHistoryService.getRecentHistory(limit));
    }

    @GetMapping("/all")
    public ResponseEntity<List<StockHistoryDTO>> getAllHistory() {
        return ResponseEntity.ok(stockHistoryService.getAllHistory());
    }
}
