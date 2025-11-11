package com.example.microservice.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class RequestDecision {

    private final UUID id;
    private final String requestId;
    private final String ofertantId;
    private final String customerId;
    private final DecisionStatus status;
    private final String reason;
    private final LocalDateTime decidedAt;
    private final String decidedBy;

    public RequestDecision(
            UUID id,
            String requestId,
            String ofertantId,
            String customerId,
            DecisionStatus status,
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

    public UUID getId() {
        return id;
    }

    public String getRequestId() {
        return requestId;
    }

    public String getOfertantId() {
        return ofertantId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public DecisionStatus getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public LocalDateTime getDecidedAt() {
        return decidedAt;
    }

    public String getDecidedBy() {
        return decidedBy;
    }
}
