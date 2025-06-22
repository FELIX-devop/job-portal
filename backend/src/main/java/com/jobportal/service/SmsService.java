package com.jobportal.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {
    
    @Value("${twilio.account.sid}")
    private String accountSid;
    
    @Value("${twilio.auth.token}")
    private String authToken;
    
    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;
    
    public boolean sendSms(String toPhoneNumber, String messageBody) {
        try {
            Twilio.init(accountSid, authToken);
            
            Message message = Message.creator(
                    new PhoneNumber("+91" + toPhoneNumber), // Assuming Indian numbers
                    new PhoneNumber(fromPhoneNumber),
                    messageBody
            ).create();
            
            log.info("SMS sent successfully. SID: {}", message.getSid());
            return true;
        } catch (Exception e) {
            log.error("Failed to send SMS: {}", e.getMessage());
            return false;
        }
    }
    
    public String createJobOfferMessage(String contractorName, String jobDetails, String location, Double rate) {
        return String.format(
            "Job Offer from %s\n\nJob: %s\nLocation: %s\nRate: ₹%.0f/day\n\nReply YES to accept or call for details.",
            contractorName, jobDetails, location, rate
        );
    }
    
    public String createJobAcceptanceMessage(String workerName, String jobDetails) {
        return String.format(
            "Great! %s has accepted your job offer for: %s\n\nContact them directly for further coordination.",
            workerName, jobDetails
        );
    }
} 