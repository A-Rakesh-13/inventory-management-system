package com.stockcheck.service;

import com.stockcheck.dto.DashboardStatsDTO;
import com.stockcheck.dto.ProductDTO;
import com.stockcheck.dto.StockHistoryDTO;
import com.stockcheck.repository.CategoryRepository;
import com.stockcheck.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockHistoryService stockHistoryService;
    private final ProductService productService;

    public DashboardService(ProductRepository productRepository,
                            CategoryRepository categoryRepository,
                            StockHistoryService stockHistoryService,
                            ProductService productService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.stockHistoryService = stockHistoryService;
        this.productService = productService;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        long total = productRepository.count();
        long inStock = productRepository.countByQuantityGreaterThan(5);
        long lowStock = productRepository.countByQuantityBetween(1, 5);
        long outOfStock = productRepository.countByQuantityEquals(0);
        long totalCategories = categoryRepository.count();

        List<StockHistoryDTO> recentUpdates = stockHistoryService.getRecentHistory(10);
        List<ProductDTO> lowStockProducts = productService.getLowStockProducts();

        stats.setTotalProducts(total);
        stats.setInStockCount(inStock);
        stats.setLowStockCount(lowStock);
        stats.setOutOfStockCount(outOfStock);
        stats.setTotalCategories(totalCategories);
        stats.setRecentStockUpdates(recentUpdates);
        stats.setLowStockProducts(lowStockProducts);

        return stats;
    }
}
