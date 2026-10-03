package com.stockcheck.entity;

public enum AvailabilityStatus {
    IN_STOCK,
    LOW_STOCK,
    OUT_OF_STOCK;

    public static AvailabilityStatus fromQuantity(int quantity) {
        if (quantity <= 0) {
            return OUT_OF_STOCK;
        } else if (quantity <= 5) {
            return LOW_STOCK;
        } else {
            return IN_STOCK;
        }
    }
}
