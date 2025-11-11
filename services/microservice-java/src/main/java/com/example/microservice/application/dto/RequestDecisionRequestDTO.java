package com.example.microservice.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class RequestDecisionRequestDTO {

    @NotBlank(message = "requestId is required")
    @JsonProperty("requestId")
    private String requestId;

    @NotBlank(message = "ofertantId is required")
    @JsonProperty("ofertantId")
    private String ofertantId;

    @NotBlank(message = "customerId is required")
    @JsonProperty("customerId")
    private String customerId;

    @NotBlank(message = "decision is required (ACCEPTED or DENIED)")
    @JsonProperty("decision")
    private String decision;

    @JsonProperty("reason")
    private String reason;

    public RequestDecisionRequestDTO() {
    }

    public RequestDecisionRequestDTO(
            String requestId,
            String ofertantId,
            String customerId,
            String decision,
            String reason) {
        this.requestId = requestId;
        this.ofertantId = ofertantId;
        this.customerId = customerId;
        this.decision = decision;
        this.reason = reason;
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

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
