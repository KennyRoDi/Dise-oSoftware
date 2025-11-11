package com.example.microservice.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.UUID;

public class RequestDecisionResponseDTO {

    @JsonProperty("id")
    private UUID id;

    @JsonProperty("requestId")
    private String requestId;

    @JsonProperty("ofertantId")
    private String ofertantId;

    @JsonProperty("customerId")
    private String customerId;

    @JsonProperty("status")
    private String status;

    @JsonProperty("reason")
    private String reason;

    @JsonProperty("decidedAt")
    private LocalDateTime decidedAt;

    @JsonProperty("decidedBy")
    private String decidedBy;

    public RequestDecisionResponseDTO() {
    }

    public RequestDecisionResponseDTO(
            UUID id,
            String requestId,
            String ofertantId,
            String customerId,
            String status,
            String reason,
            LocalDateTime decidedAt,
            String decidedBy) {
        this.id = id;
        this.requestId = requestId;
        this.ofertantId = ofertantId;
        this.customerId = customerId;
        this.status = status;
        this.reason = reason;
        this.decidedAt = decidedAt;
        this.decidedBy = decidedBy;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getOfertantId() {
        return ofertantId;
    }

    public void setOfertantId(String ofertantId) {
        this.ofertantId = ofertantId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getDecidedAt() {
        return decidedAt;
    }

    public void setDecidedAt(LocalDateTime decidedAt) {
        this.decidedAt = decidedAt;
    }

    public String getDecidedBy() {
        return decidedBy;
    }

    public void setDecidedBy(String decidedBy) {
        this.decidedBy = decidedBy;
    }
}
