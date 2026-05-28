package com.smartqueue.Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_entries")
public class QueueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String tokenNumber;

    @Column(nullable = false)
    private String serviceType;

    // Contact info for notifications
    private String customerPhone;
    private String customerEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QueueStatus status;

    @Column(nullable = false)
    private LocalDateTime checkInTime;

    private LocalDateTime servedTime;

    @Column(nullable = false)
    private Integer position;

    // Branch support
    @Column(nullable = false)
    private String branchCode;

    @Column(nullable = false)
    private String branchName;

    // Notification tracking
    private boolean notifiedNearTurn = false;

    public enum QueueStatus {
        WAITING, SERVING, COMPLETED, CANCELLED
    }

    // Getters
    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getTokenNumber() { return tokenNumber; }
    public String getServiceType() { return serviceType; }
    public String getCustomerPhone() { return customerPhone; }
    public String getCustomerEmail() { return customerEmail; }
    public QueueStatus getStatus() { return status; }
    public LocalDateTime getCheckInTime() { return checkInTime; }
    public LocalDateTime getServedTime() { return servedTime; }
    public Integer getPosition() { return position; }
    public String getBranchCode() { return branchCode; }
    public String getBranchName() { return branchName; }
    public boolean isNotifiedNearTurn() { return notifiedNearTurn; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public void setStatus(QueueStatus status) { this.status = status; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }
    public void setServedTime(LocalDateTime servedTime) { this.servedTime = servedTime; }
    public void setPosition(Integer position) { this.position = position; }
    public void setBranchCode(String branchCode) { this.branchCode = branchCode; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public void setNotifiedNearTurn(boolean notifiedNearTurn) { this.notifiedNearTurn = notifiedNearTurn; }
}