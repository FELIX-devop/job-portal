package com.jobportal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "job_offers")
public class JobOffer {
    @Id
    private String id;
    private String contractorId;
    private String workerId;
    private String contractorName;
    private String workerName;
    private String message;
    private String jobDetails;
    private Double offeredRate;
    private String location;
    private String duration;
    private JobOfferStatus status;
    private NotificationType sentVia;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum JobOfferStatus {
        PENDING, ACCEPTED, REJECTED, COMPLETED
    }
    
    public enum NotificationType {
        PORTAL, SMS, BOTH
    }
} 