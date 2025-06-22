package com.jobportal.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Document(collection = "workers")
public class Worker extends User {
    private List<String> skills;
    private String location;
    private String availability; // "Available", "Busy", "Part-time"
    private String experience;
    private Double dailyRate;
    private String description;
    private boolean available = true;
} 