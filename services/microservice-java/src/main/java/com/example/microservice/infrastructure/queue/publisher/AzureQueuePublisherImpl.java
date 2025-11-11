package com.example.microservice.infrastructure.queue.publisher;

import com.example.microservice.domain.model.RequestDecision;
import com.example.microservice.domain.port.QueuePublisher;
import org.springframework.stereotype.Component;

@Component
public class AzureQueuePublisherImpl implements QueuePublisher {

    @Override
    public void publishDecision(RequestDecision decision) {
        // TODO: Implement Azure Queue Storage publish
    }

    @Override
    public void publishDecisionAsync(RequestDecision decision) {
        // TODO: Implement async publish with retry logic
    }
}
