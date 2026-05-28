package com.smartqueue.Backend.controller;

import com.smartqueue.Backend.model.Branch;
import com.smartqueue.Backend.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchService branchService;

    // GET /api/branches — all active branches (public)
    @GetMapping
    public ResponseEntity<List<Branch>> getActiveBranches() {
        return ResponseEntity.ok(branchService.getAllActiveBranches());
    }

    // GET /api/branches/all — all branches including inactive (admin)
    @GetMapping("/all")
    public ResponseEntity<List<Branch>> getAllBranches() {
        return ResponseEntity.ok(branchService.getAllBranches());
    }

    // POST /api/branches — create a new branch (admin)
    @PostMapping
    public ResponseEntity<?> createBranch(@RequestBody Map<String, String> body) {
        try {
            String code    = body.get("branchCode");
            String name    = body.get("branchName");
            String address = body.get("address");
            String city    = body.get("city");
            String phone   = body.getOrDefault("phone", "");

            if (code == null || name == null || address == null || city == null)
                return ResponseEntity.badRequest().body(Map.of("error", "branchCode, branchName, address and city are required"));

            Branch created = branchService.createBranch(code, name, address, city, phone);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/branches/{id}/toggle — toggle active status
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggle(@PathVariable Long id) {
        return branchService.toggleBranch(id)
                .map(b -> ResponseEntity.ok((Object) b))
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/branches/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseEntity.ok(Map.of("message", "Branch deleted"));
    }
}