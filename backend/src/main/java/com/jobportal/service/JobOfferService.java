package com.jobportal.service;

import com.jobportal.dto.JobOfferRequest;
import com.jobportal.model.JobOffer;
import com.jobportal.model.Message;
import com.jobportal.model.User;
import com.jobportal.model.Worker;
import com.jobportal.repository.JobOfferRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobOfferService {
    
    private final JobOfferRepository jobOfferRepository;
    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final SmsService smsService;
    
    public JobOffer sendJobOffer(String contractorId, JobOfferRequest request) {
        Optional<User> contractorOpt = userRepository.findById(contractorId);
        Optional<Worker> workerOpt = workerRepository.findById(request.getWorkerId());
        
        if (contractorOpt.isEmpty() || workerOpt.isEmpty()) {
            throw new RuntimeException("Contractor or Worker not found");
        }
        
        User contractor = contractorOpt.get();
        Worker worker = workerOpt.get();
        
        JobOffer jobOffer = new JobOffer();
        jobOffer.setContractorId(contractorId);
        jobOffer.setWorkerId(request.getWorkerId());
        jobOffer.setContractorName(contractor.getName());
        jobOffer.setWorkerName(worker.getName());
        jobOffer.setMessage(request.getMessage());
        jobOffer.setJobDetails(request.getJobDetails());
        jobOffer.setOfferedRate(request.getOfferedRate());
        jobOffer.setLocation(request.getLocation());
        jobOffer.setDuration(request.getDuration());
        jobOffer.setStatus(JobOffer.JobOfferStatus.PENDING);
        jobOffer.setSentVia(request.getSentVia());
        jobOffer.setCreatedAt(LocalDateTime.now());
        jobOffer.setUpdatedAt(LocalDateTime.now());
        
        JobOffer savedOffer = jobOfferRepository.save(jobOffer);
        
        // Send SMS if requested
        if (request.getSentVia() == JobOffer.NotificationType.SMS || 
            request.getSentVia() == JobOffer.NotificationType.BOTH) {
            
            String smsMessage = smsService.createJobOfferMessage(
                contractor.getName(),
                request.getJobDetails(),
                request.getLocation(),
                request.getOfferedRate()
            );
            
            smsService.sendSms(worker.getPhone(), smsMessage);
        }
        
        // Add message to worker's inbox
        Message inboxMessage = new Message();
        inboxMessage.setId(java.util.UUID.randomUUID().toString());
        inboxMessage.setFromUserId(contractorId);
        inboxMessage.setFromUserName(contractor.getName());
        inboxMessage.setToUserId(request.getWorkerId());
        inboxMessage.setToUserName(worker.getName());
        inboxMessage.setContent(request.getMessage());
        inboxMessage.setType(Message.MessageType.JOB_OFFER);
        inboxMessage.setCreatedAt(LocalDateTime.now());
        
        worker.getInbox().add(inboxMessage);
        workerRepository.save(worker);
        
        return savedOffer;
    }
    
    public JobOffer updateJobOfferStatus(String offerId, JobOffer.JobOfferStatus status) {
        Optional<JobOffer> offerOpt = jobOfferRepository.findById(offerId);
        if (offerOpt.isPresent()) {
            JobOffer offer = offerOpt.get();
            offer.setStatus(status);
            offer.setUpdatedAt(LocalDateTime.now());
            
            // If accepted, send SMS to contractor
            if (status == JobOffer.JobOfferStatus.ACCEPTED) {
                Optional<User> contractorOpt = userRepository.findById(offer.getContractorId());
                if (contractorOpt.isPresent()) {
                    String smsMessage = smsService.createJobAcceptanceMessage(
                        offer.getWorkerName(),
                        offer.getJobDetails()
                    );
                    smsService.sendSms(contractorOpt.get().getPhone(), smsMessage);
                }
            }
            
            return jobOfferRepository.save(offer);
        }
        return null;
    }
    
    public List<JobOffer> getJobOffersByWorker(String workerId) {
        return jobOfferRepository.findByWorkerId(workerId);
    }
    
    public List<JobOffer> getJobOffersByContractor(String contractorId) {
        return jobOfferRepository.findByContractorId(contractorId);
    }
    
    public List<JobOffer> getPendingJobOffersByWorker(String workerId) {
        return jobOfferRepository.findByWorkerIdAndStatus(workerId, JobOffer.JobOfferStatus.PENDING);
    }
    
    public Optional<JobOffer> getJobOfferById(String offerId) {
        return jobOfferRepository.findById(offerId);
    }
} 