package com.jobportal.controller;

import com.jobportal.model.Worker;
import com.jobportal.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WorkerController {
    
    private final WorkerService workerService;
    
    @GetMapping
    public ResponseEntity<List<Worker>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }
    
    @GetMapping("/search/skill/{skill}")
    public ResponseEntity<List<Worker>> searchBySkill(@PathVariable String skill) {
        return ResponseEntity.ok(workerService.searchWorkersBySkill(skill));
    }
    
    @GetMapping("/search/location/{location}")
    public ResponseEntity<List<Worker>> searchByLocation(@PathVariable String location) {
        return ResponseEntity.ok(workerService.searchWorkersByLocation(location));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Worker>> searchBySkillAndLocation(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String location) {
        
        if (skill != null && location != null) {
            return ResponseEntity.ok(workerService.searchWorkersBySkillAndLocation(skill, location));
        } else if (skill != null) {
            return ResponseEntity.ok(workerService.searchWorkersBySkill(skill));
        } else if (location != null) {
            return ResponseEntity.ok(workerService.searchWorkersByLocation(location));
        } else {
            return ResponseEntity.ok(workerService.getAllWorkers());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorkerById(@PathVariable String id) {
        Optional<Worker> worker = workerService.getWorkerById(id);
        return worker.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Worker> updateWorker(@PathVariable String id, @RequestBody Worker workerDetails) {
        Worker updatedWorker = workerService.updateWorker(id, workerDetails);
        if (updatedWorker != null) {
            return ResponseEntity.ok(updatedWorker);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/availability")
    public ResponseEntity<Boolean> updateAvailability(@PathVariable String id, @RequestParam boolean isAvailable) {
        boolean updated = workerService.updateAvailability(id, isAvailable);
        return ResponseEntity.ok(updated);
    }
} 