package com.stockcheck.dto;

import com.stockcheck.entity.StockChangeReason;
import jakarta.validation.constraints.NotNull;

public class StockUpdateRequest {

    /**
     * Target new stock quantity. If provided, new stock becomes this value.
     */
    private Integer newQuantity;

    /**
     * Alternatively, delta adjustment (e.g. +5 or -2).
     */
    private Integer changeAmount;

    @NotNull(message = "Stock change reason is required")
    private StockChangeReason reason;

    private String note;

    public StockUpdateRequest() {
    }

    public StockUpdateRequest(Integer newQuantity, StockChangeReason reason) {
        this.newQuantity = newQuantity;
        this.reason = reason;
    }

    public Integer getNewQuantity() {
        return newQuantity;
    }

    public void setNewQuantity(Integer newQuantity) {
        this.newQuantity = newQuantity;
    }

    public Integer getChangeAmount() {
        return changeAmount;
    }

    public void setChangeAmount(Integer changeAmount) {
        this.changeAmount = changeAmount;
    }

    public StockChangeReason getReason() {
        return reason;
    }

    public void setReason(StockChangeReason reason) {
        this.reason = reason;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
