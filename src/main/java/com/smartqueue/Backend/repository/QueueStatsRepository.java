package com.smartqueue.Backend.repository;

import com.smartqueue.Backend.model.QueueStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QueueStatsRepository extends JpaRepository<QueueStats, Long> {

    @Query("SELECT q FROM QueueStats q WHERE q.branchCode = :branchCode ORDER BY q.recordedAt DESC LIMIT 1")
    Optional<QueueStats> findLatestStatsByBranch(@Param("branchCode") String branchCode);
}