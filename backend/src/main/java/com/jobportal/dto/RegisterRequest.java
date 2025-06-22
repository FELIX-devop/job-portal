package com.jobportal.dto;

import lombok.Data;
import com.jobportal.model.User.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    @NotBlank(message = "Phone number is required")
    private String phone;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private UserRole role;
    
    // Worker specific fields
    private String[] skills;
    private String location;
    private String availability;
    private String experience;
    private Double dailyRate;
    private String description;
    
    // Contractor specific fields
    private String companyName;
    private String businessType;
    private String address;
} 