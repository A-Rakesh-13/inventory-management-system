package com.stockcheck.dto;

import java.util.List;

public class DashboardStatsDTO {
    private long totalProducts;
    private long inStockCount;
    private long lowStockCount;
    private long outOfStockCount;
    private long totalCategories;
    private List<StockHistoryDTO> recentStockUpdates;
    private List<ProductDTO> lowStockProducts;

    public DashboardStatsDTO() {
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getInStockCount() {
        return inStockCount;
    }

    public void setInStockCount(long inStockCount) {
        this.inStockCount = inStockCount;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getOutOfStockCount() {
        return outOfStockCount;
    }

    public void setOutOfStockCount(long outOfStockCount) {
        this.outOfStockCount = outOfStockCount;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public List<StockHistoryDTO> getRecentStockUpdates() {
        return recentStockUpdates;
    }

    public void setRecentStockUpdates(List<StockHistoryDTO> recentStockUpdates) {
        this.recentStockUpdates = recentStockUpdates;
    }

    public List<ProductDTO> getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(List<ProductDTO> lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }
}
