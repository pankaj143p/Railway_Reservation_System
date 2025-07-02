package com.microservices.dto;

import lombok.Data;

@Data
public class CancellationResponseDTO {
    private String message;
    private boolean refundProcessed;
    private String refundId;
    private double refundAmount;
    private double originalAmount;
    private double cancellationFee;
    private String refundStatus;
    private String expectedRefundTime;

    public CancellationResponseDTO(String message, boolean refundProcessed, String refundId, 
                                 double refundAmount, double originalAmount, double cancellationFee,
                                 String refundStatus, String expectedRefundTime) {
        this.message = message;
        this.refundProcessed = refundProcessed;
        this.refundId = refundId;
        this.refundAmount = refundAmount;
        this.originalAmount = originalAmount;
        this.cancellationFee = cancellationFee;
        this.refundStatus = refundStatus;
        this.expectedRefundTime = expectedRefundTime;
    }

    public CancellationResponseDTO(String message) {
        this.message = message;
        this.refundProcessed = false;
    }
}
