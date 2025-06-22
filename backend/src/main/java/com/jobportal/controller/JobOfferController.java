package com.jobportal.controller;

import com.jobportal.dto.JobOfferRequest;
import com.jobportal.model.JobOffer;
import com.jobportal.service.JobOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/job-offers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JobOfferController {
    
    private final JobOfferService jobOfferService;
    
    @PostMapping("/send")
    public ResponseEntity<JobOffer> sendJobOffer(
            @RequestParam String contractorId,
            @Valid @RequestBody JobOfferRequest request) {
        try {
            JobOffer jobOffer = jobOfferService.sendJobOffer(contractorId, request);
            return ResponseEntity.ok(jobOffer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{offerId}/status")
    public ResponseEntity<JobOffer> updateJobOfferStatus(
            @PathVariable String offerId,
            @RequestParam JobOffer.JobOfferStatus status) {
        JobOffer updatedOffer = jobOfferService.updateJobOfferStatus(offerId, status);
        if (updatedOffer != null) {
            return ResponseEntity.ok(updatedOffer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<JobOffer>> getJobOffersByWorker(@PathVariable String workerId) {
        return ResponseEntity.ok(jobOfferService.getJobOffersByWorker(workerId));
    }
    
    @GetMapping("/contractor/{contractorId}")
    public ResponseEntity<List<JobOffer>> getJobOffersByContractor(@PathVariable String contractorId) {
        return ResponseEntity.ok(jobOfferService.getJobOffersByContractor(contractorId));
    }
    
    @GetMapping("/worker/{workerId}/pending")
    public ResponseEntity<List<JobOffer>> getPendingJobOffersByWorker(@PathVariable String workerId) {
        return ResponseEntity.ok(jobOfferService.getPendingJobOffersByWorker(workerId));
    }
    
    @GetMapping("/{offerId}")
    public ResponseEntity<JobOffer> getJobOfferById(@PathVariable String offerId) {
        Optional<JobOffer> jobOffer = jobOfferService.getJobOfferById(offerId);
        return jobOffer.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 