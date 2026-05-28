package com.smartqueue.Backend.repository;

import com.smartqueue.Backend.model.QueueEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {

    // Branch-specific queries
    List<QueueEntry> findByBranchCodeAndStatusOrderByPositionAsc(
            String branchCode, QueueEntry.QueueStatus status);

    @Query("SELECT COUNT(q) FROM QueueEntry q WHERE q.branchCode = :branchCode AND q.status = 'WAITING'")
    Integer countWaitingByBranch(@Param("branchCode") String branchCode);

    @Query("SELECT MAX(q.position) FROM QueueEntry q WHERE q.branchCode = :branchCode AND q.status IN ('WAITING', 'SERVING')")
    Integer findMaxPositionByBranch(@Param("branchCode") String branchCode);

    Optional<QueueEntry> findByTokenNumber(String tokenNumber);

    @Query("SELECT q FROM QueueEntry q WHERE q.branchCode = :branchCode AND q.status = 'SERVING'")
    List<QueueEntry> findCurrentlyServingByBranch(@Param("branchCode") String branchCode);

    // Find customers near their turn who haven't been notified yet (position <= 3)
    @Query("SELECT q FROM QueueEntry q WHERE q.branchCode = :branchCode AND q.status = 'WAITING' AND q.position <= :threshold AND q.notifiedNearTurn = false")
    List<QueueEntry> findCustomersNearTurnNotNotified(
            @Param("branchCode") String branchCode,
            @Param("threshold") int threshold);
}