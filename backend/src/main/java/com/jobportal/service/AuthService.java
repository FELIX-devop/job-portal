package com.jobportal.service;

import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.model.Contractor;
import com.jobportal.model.User;
import com.jobportal.model.Worker;
import com.jobportal.repository.UserRepository;
import com.jobportal.repository.WorkerRepository;
import com.jobportal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public Map<String, Object> register(RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }
        
        if (userRepository.existsByPhone(request.getPhone())) {
            response.put("success", false);
            response.put("message", "Phone number already registered");
            return response;
        }
        
        try {
            if (request.getRole() == User.UserRole.WORKER) {
                Worker worker = new Worker();
                worker.setName(request.getName());
                worker.setEmail(request.getEmail());
                worker.setPhone(request.getPhone());
                worker.setPassword(passwordEncoder.encode(request.getPassword()));
                worker.setRole(User.UserRole.WORKER);
                worker.setSkills(request.getSkills() != null ? java.util.Arrays.asList(request.getSkills()) : null);
                worker.setLocation(request.getLocation());
                worker.setAvailability(request.getAvailability());
                worker.setExperience(request.getExperience());
                worker.setDailyRate(request.getDailyRate());
                worker.setDescription(request.getDescription());
                worker.setCreatedAt(LocalDateTime.now());
                worker.setUpdatedAt(LocalDateTime.now());
                
                Worker savedWorker = workerRepository.save(worker);
                String token = jwtUtil.generateToken(savedWorker.getEmail(), savedWorker.getRole().name());
                
                response.put("success", true);
                response.put("token", token);
                response.put("user", savedWorker);
                response.put("message", "Worker registered successfully");
                
            } else {
                Contractor contractor = new Contractor();
                contractor.setName(request.getName());
                contractor.setEmail(request.getEmail());
                contractor.setPhone(request.getPhone());
                contractor.setPassword(passwordEncoder.encode(request.getPassword()));
                contractor.setRole(User.UserRole.CONTRACTOR);
                contractor.setCompanyName(request.getCompanyName());
                contractor.setBusinessType(request.getBusinessType());
                contractor.setAddress(request.getAddress());
                contractor.setDescription(request.getDescription());
                contractor.setCreatedAt(LocalDateTime.now());
                contractor.setUpdatedAt(LocalDateTime.now());
                
                Contractor savedContractor = userRepository.save(contractor);
                String token = jwtUtil.generateToken(savedContractor.getEmail(), savedContractor.getRole().name());
                
                response.put("success", true);
                response.put("token", token);
                response.put("user", savedContractor);
                response.put("message", "Contractor registered successfully");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> login(LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String role = request.getRole();
            if ("CONTRACTOR".equalsIgnoreCase(role)) {
                // Only check UserRepository
                User user = userRepository.findByEmail(request.getEmail()).orElse(null);
                if (user != null && passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
                    response.put("success", true);
                    response.put("token", token);
                    response.put("user", user);
                    response.put("message", "Login successful");
                    return response;
                }
            } else if ("WORKER".equalsIgnoreCase(role)) {
                // Only check WorkerRepository
                Worker worker = workerRepository.findByEmail(request.getEmail()).orElse(null);
                if (worker != null && passwordEncoder.matches(request.getPassword(), worker.getPassword())) {
                    String token = jwtUtil.generateToken(worker.getEmail(), worker.getRole().name());
                    response.put("success", true);
                    response.put("token", token);
                    response.put("user", worker);
                    response.put("message", "Login successful");
                    return response;
                }
            } else {
                response.put("success", false);
                response.put("message", "Invalid role selected");
                return response;
            }
            response.put("success", false);
            response.put("message", "Invalid email or password");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
        }
        return response;
    }
} 