package com.jobportal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
public class Message {
    @Id
    private String id;
    private String fromUserId;
    private String fromUserName;
    private String toUserId;
    private String toUserName;
    private String content;
    private MessageType type;
    private boolean isRead = false;
    private LocalDateTime createdAt;
    
    public enum MessageType {
        JOB_OFFER, CHAT, NOTIFICATION
    }
} 