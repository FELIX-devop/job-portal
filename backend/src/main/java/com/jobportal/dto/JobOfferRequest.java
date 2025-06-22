package com.jobportal.dto;

import lombok.Data;
import com.jobportal.model.JobOffer.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class JobOfferRequest {
    @NotBlank(message = "Worker ID is required")
    private String workerId;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private String jobDetails;
    private Double offeredRate;
    private String location;
    private String duration;
    
    @NotNull(message = "Notification type is required")
    private NotificationType sentVia;
} 