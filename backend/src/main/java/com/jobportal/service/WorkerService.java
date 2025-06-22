package com.jobportal.service;

import com.jobportal.model.Worker;
import com.jobportal.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkerService {
    
    private final WorkerRepository workerRepository;
    
    public List<Worker> getAllWorkers() {
        return workerRepository.findByAvailableTrue();
    }
    
    public List<Worker> searchWorkersBySkill(String skill) {
        return workerRepository.findBySkillsContainingIgnoreCase(skill);
    }
    
    public List<Worker> searchWorkersByLocation(String location) {
        return workerRepository.findByLocationContainingIgnoreCase(location);
    }
    
    public List<Worker> searchWorkersBySkillAndLocation(String skill, String location) {
        return workerRepository.findBySkillsAndLocationAndAvailable(skill, location);
    }
    
    public List<Worker> searchWorkersBySkills(List<String> skills) {
        return workerRepository.findBySkillsInAndAvailable(skills);
    }
    
    public Optional<Worker> getWorkerById(String id) {
        return workerRepository.findById(id);
    }
    
    public Worker updateWorker(String id, Worker workerDetails) {
        Optional<Worker> workerOpt = workerRepository.findById(id);
        if (workerOpt.isPresent()) {
            Worker worker = workerOpt.get();
            worker.setName(workerDetails.getName());
            worker.setPhone(workerDetails.getPhone());
            worker.setSkills(workerDetails.getSkills());
            worker.setLocation(workerDetails.getLocation());
            worker.setAvailability(workerDetails.getAvailability());
            worker.setExperience(workerDetails.getExperience());
            worker.setDailyRate(workerDetails.getDailyRate());
            worker.setDescription(workerDetails.getDescription());
            worker.setAvailable(workerDetails.isAvailable());
            worker.setUpdatedAt(LocalDateTime.now());
            return workerRepository.save(worker);
        }
        return null;
    }
    
    public boolean updateAvailability(String id, boolean isAvailable) {
        Optional<Worker> workerOpt = workerRepository.findById(id);
        if (workerOpt.isPresent()) {
            Worker worker = workerOpt.get();
            worker.setAvailable(isAvailable);
            worker.setUpdatedAt(LocalDateTime.now());
            workerRepository.save(worker);
            return true;
        }
        return false;
    }
} 