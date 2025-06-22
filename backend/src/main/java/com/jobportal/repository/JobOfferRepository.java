package com.jobportal.repository;

import com.jobportal.model.JobOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOfferRepository extends MongoRepository<JobOffer, String> {
    List<JobOffer> findByWorkerId(String workerId);
    List<JobOffer> findByContractorId(String contractorId);
    List<JobOffer> findByWorkerIdAndStatus(String workerId, JobOffer.JobOfferStatus status);
    List<JobOffer> findByContractorIdAndStatus(String contractorId, JobOffer.JobOfferStatus status);
} 