package com.smartqueue.Backend.service;

import com.smartqueue.Backend.model.Branch;
import com.smartqueue.Backend.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    // Create default branches on startup
    public void createDefaultBranches() {
        if (branchRepository.count() == 0) {
            createBranch("BR001", "Main Branch",      "123 MG Road, Chennai Central",  "Chennai", "044-12345001");
            createBranch("BR002", "Anna Nagar Branch","45 2nd Avenue, Anna Nagar",     "Chennai", "044-12345002");
            createBranch("BR003", "T Nagar Branch",   "78 Usman Road, T Nagar",        "Chennai", "044-12345003");
            createBranch("BR004", "Velachery Branch", "12 100 Feet Road, Velachery",   "Chennai", "044-12345004");
            System.out.println("✅ Default branches created");
        }
    }

    public List<Branch> getAllActiveBranches() {
        return branchRepository.findByActiveTrue();
    }

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public Optional<Branch> getBranchByCode(String code) {
        return branchRepository.findByBranchCode(code);
    }

    public Branch createBranch(String code, String name, String address, String city, String phone) {
        Branch b = new Branch();
        b.setBranchCode(code);
        b.setBranchName(name);
        b.setAddress(address);
        b.setCity(city);
        b.setPhone(phone);
        b.setActive(true);
        b.setCreatedAt(LocalDateTime.now());
        return branchRepository.save(b);
    }

    public Optional<Branch> toggleBranch(Long id) {
        return branchRepository.findById(id).map(b -> {
            b.setActive(!b.isActive());
            return branchRepository.save(b);
        });
    }

    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }
}