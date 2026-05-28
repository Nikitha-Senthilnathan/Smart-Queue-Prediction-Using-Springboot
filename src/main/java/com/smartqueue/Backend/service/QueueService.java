package com.smartqueue.Backend.service;

import com.smartqueue.Backend.model.Branch;
import com.smartqueue.Backend.model.QueueEntry;
import com.smartqueue.Backend.model.QueueStats;
import com.smartqueue.Backend.repository.BranchRepository;
import com.smartqueue.Backend.repository.QueueEntryRepository;
import com.smartqueue.Backend.repository.QueueStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class QueueService {

    private static final int AVG_SERVICE_TIME_MINUTES = 5;
    private static final int LOW_THRESHOLD            = 5;
    private static final int MEDIUM_THRESHOLD         = 10;
    private static final int NOTIFY_WHEN_POSITION_LTE = 3; // notify when 3 or fewer ahead

    @Autowired private QueueEntryRepository queueEntryRepository;
    @Autowired private QueueStatsRepository queueStatsRepository;
    @Autowired private BranchRepository     branchRepository;
    @Autowired private NotificationService  notificationService;

    /**
     * Customer check-in with branch and optional contact info
     */
    @Transactional
    public QueueEntry checkIn(String customerName, String serviceType,
                              String branchCode, String customerPhone, String customerEmail) {

        Branch branch = branchRepository.findByBranchCode(branchCode)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branchCode));

        Integer maxPos = queueEntryRepository.findMaxPositionByBranch(branchCode);
        int nextPosition = (maxPos == null) ? 1 : maxPos + 1;

        QueueEntry entry = new QueueEntry();
        entry.setCustomerName(customerName);
        entry.setTokenNumber(branchCode + "-" + String.format("%04d", nextPosition));
        entry.setServiceType(serviceType);
        entry.setBranchCode(branchCode);
        entry.setBranchName(branch.getBranchName());
        entry.setCustomerPhone(customerPhone);
        entry.setCustomerEmail(customerEmail);
        entry.setStatus(QueueEntry.QueueStatus.WAITING);
        entry.setCheckInTime(LocalDateTime.now());
        entry.setPosition(nextPosition);
        entry.setNotifiedNearTurn(false);

        QueueEntry saved = queueEntryRepository.save(entry);
        updateStats(branchCode);
        return saved;
    }

    /**
     * Get queue stats for a specific branch
     */
    public QueueStats getCurrentStats(String branchCode) {
        updateStats(branchCode);
        return queueStatsRepository.findLatestStatsByBranch(branchCode)
                .orElseGet(() -> createDefaultStats(branchCode));
    }

    /**
     * Get waiting queue for a branch
     */
    public List<QueueEntry> getWaitingQueue(String branchCode) {
        return queueEntryRepository.findByBranchCodeAndStatusOrderByPositionAsc(
                branchCode, QueueEntry.QueueStatus.WAITING);
    }

    /**
     * Get currently serving for a branch
     */
    public List<QueueEntry> getCurrentlyServing(String branchCode) {
        return queueEntryRepository.findCurrentlyServingByBranch(branchCode);
    }

    /**
     * Serve next customer — also sends notification to customer behind
     */
    @Transactional
    public Optional<QueueEntry> serveNext(String branchCode) {
        List<QueueEntry> waiting = queueEntryRepository
                .findByBranchCodeAndStatusOrderByPositionAsc(branchCode, QueueEntry.QueueStatus.WAITING);

        if (waiting.isEmpty()) return Optional.empty();

        QueueEntry next = waiting.get(0);
        next.setStatus(QueueEntry.QueueStatus.SERVING);
        QueueEntry updated = queueEntryRepository.save(next);

        // Send "now serving" email notification
        notificationService.sendServingEmail(updated);

        // Notify customers near their turn
        checkAndNotifyNearTurn(branchCode);

        updateStats(branchCode);
        return Optional.of(updated);
    }

    /**
     * Complete service
     */
    @Transactional
    public Optional<QueueEntry> completeService(Long id) {
        return queueEntryRepository.findById(id).map(entry -> {
            entry.setStatus(QueueEntry.QueueStatus.COMPLETED);
            entry.setServedTime(LocalDateTime.now());
            QueueEntry updated = queueEntryRepository.save(entry);
            checkAndNotifyNearTurn(entry.getBranchCode());
            updateStats(entry.getBranchCode());
            return updated;
        });
    }

    /**
     * Cancel by token
     */
    @Transactional
    public Optional<QueueEntry> cancelByToken(String token) {
        return queueEntryRepository.findByTokenNumber(token).map(entry -> {
            if (entry.getStatus() == QueueEntry.QueueStatus.WAITING) {
                entry.setStatus(QueueEntry.QueueStatus.CANCELLED);
                QueueEntry updated = queueEntryRepository.save(entry);
                updateStats(entry.getBranchCode());
                return updated;
            }
            return entry;
        });
    }

    /**
     * Check status by token
     */
    public Optional<QueueEntry> checkStatus(String token) {
        return queueEntryRepository.findByTokenNumber(token);
    }

    /**
     * Find customers near their turn and send notifications
     */
    private void checkAndNotifyNearTurn(String branchCode) {
        List<QueueEntry> nearTurn = queueEntryRepository
                .findCustomersNearTurnNotNotified(branchCode, NOTIFY_WHEN_POSITION_LTE);

        for (QueueEntry entry : nearTurn) {
            notificationService.sendNearTurnEmail(entry);
            entry.setNotifiedNearTurn(true);
            queueEntryRepository.save(entry);
        }
    }

    /**
     * Update stats for a branch
     */
    private void updateStats(String branchCode) {
        Integer waitingCount = queueEntryRepository.countWaitingByBranch(branchCode);
        if (waitingCount == null) waitingCount = 0;

        List<QueueEntry> serving = queueEntryRepository.findCurrentlyServingByBranch(branchCode);
        int servingCount = serving.size();

        String crowdLevel;
        if (waitingCount <= LOW_THRESHOLD)         crowdLevel = "LOW";
        else if (waitingCount <= MEDIUM_THRESHOLD) crowdLevel = "MEDIUM";
        else                                       crowdLevel = "HIGH";

        QueueStats stats = new QueueStats();
        stats.setBranchCode(branchCode);
        stats.setTotalInQueue(waitingCount + servingCount);
        stats.setCurrentlyServing(servingCount);
        stats.setCrowdLevel(crowdLevel);
        stats.setEstimatedWaitMinutes(waitingCount * AVG_SERVICE_TIME_MINUTES);
        stats.setRecordedAt(LocalDateTime.now());
        stats.setAvgServiceTimeMinutes(AVG_SERVICE_TIME_MINUTES);

        queueStatsRepository.save(stats);
    }

    private QueueStats createDefaultStats(String branchCode) {
        QueueStats s = new QueueStats();
        s.setBranchCode(branchCode);
        s.setTotalInQueue(0);
        s.setCurrentlyServing(0);
        s.setCrowdLevel("LOW");
        s.setEstimatedWaitMinutes(0);
        s.setRecordedAt(LocalDateTime.now());
        s.setAvgServiceTimeMinutes(AVG_SERVICE_TIME_MINUTES);
        return s;
    }
}