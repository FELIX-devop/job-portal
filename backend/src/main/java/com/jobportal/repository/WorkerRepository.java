package com.jobportal.repository;

import com.jobportal.model.Worker;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends MongoRepository<Worker, String> {
    Optional<Worker> findByEmail(String email);
    List<Worker> findBySkillsContainingIgnoreCase(String skill);
    List<Worker> findByLocationContainingIgnoreCase(String location);
    List<Worker> findByAvailableTrue();
    
    @Query("{'$and': [{'skills': {'$regex': ?0, '$options': 'i'}}, {'location': {'$regex': ?1, '$options': 'i'}}, {'available': true}]}")
    List<Worker> findBySkillsAndLocationAndAvailable(String skill, String location);
    
    @Query("{'$and': [{'skills': {'$in': ?0}}, {'available': true}]}")
    List<Worker> findBySkillsInAndAvailable(List<String> skills);
} 