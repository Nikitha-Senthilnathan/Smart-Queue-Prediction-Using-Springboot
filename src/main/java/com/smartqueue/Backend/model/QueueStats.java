package com.smartqueue.Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_stats")
public class QueueStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String branchCode;

    @Column(nullable = false)
    private Integer totalInQueue;

    @Column(nullable = false)
    private Integer currentlyServing;

    @Column(nullable = false)
    private String crowdLevel;

    @Column(nullable = false)
    private Integer estimatedWaitMinutes;

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    @Column(nullable = false)
    private Integer avgServiceTimeMinutes;

    // Getters
    public Long getId() { return id; }
    public String getBranchCode() { return branchCode; }
    public Integer getTotalInQueue() { return totalInQueue; }
    public Integer getCurrentlyServing() { return currentlyServing; }
    public String getCrowdLevel() { return crowdLevel; }
    public Integer getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public Integer getAvgServiceTimeMinutes() { return avgServiceTimeMinutes; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setBranchCode(String branchCode) { this.branchCode = branchCode; }
    public void setTotalInQueue(Integer totalInQueue) { this.totalInQueue = totalInQueue; }
    public void setCurrentlyServing(Integer currentlyServing) { this.currentlyServing = currentlyServing; }
    public void setCrowdLevel(String crowdLevel) { this.crowdLevel = crowdLevel; }
    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
    public void setAvgServiceTimeMinutes(Integer avgServiceTimeMinutes) { this.avgServiceTimeMinutes = avgServiceTimeMinutes; }
}