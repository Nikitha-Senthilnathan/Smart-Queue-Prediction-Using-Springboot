package com.smartqueue.Backend.repository;

import com.smartqueue.Backend.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByActiveTrue();
    Optional<Branch> findByBranchCode(String branchCode);
    boolean existsByBranchCode(String branchCode);
}