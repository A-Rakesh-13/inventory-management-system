package com.stockcheck.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class NotificationRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    public NotificationRequest() {
    }

    public NotificationRequest(Long productId, String email) {
        this.productId = productId;
        this.email = email;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
