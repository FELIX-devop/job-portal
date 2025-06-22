package com.jobportal.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@EqualsAndHashCode(callSuper = true)
@Document(collection = "contractors")
public class Contractor extends User {
    private String companyName;
    private String businessType;
    private String address;
    private String description;
} 