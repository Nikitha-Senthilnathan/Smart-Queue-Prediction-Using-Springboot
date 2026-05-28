package com.smartqueue.Backend.controller;

import com.smartqueue.Backend.model.QueueEntry;
import com.smartqueue.Backend.model.QueueStats;
import com.smartqueue.Backend.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "*")
public class QueueController {

    @Autowired
    private QueueService queueService;

    // GET /api/queue/stats?branch=BR001
    @GetMapping("/stats")
    public ResponseEntity<QueueStats> getStats(@RequestParam String branch) {
        return ResponseEntity.ok(queueService.getCurrentStats(branch));
    }

    // GET /api/queue/waiting?branch=BR001
    @GetMapping("/waiting")
    public ResponseEntity<List<QueueEntry>> getWaiting(@RequestParam String branch) {
        return ResponseEntity.ok(queueService.getWaitingQueue(branch));
    }

    // GET /api/queue/serving?branch=BR001
    @GetMapping("/serving")
    public ResponseEntity<List<QueueEntry>> getServing(@RequestParam String branch) {
        return ResponseEntity.ok(queueService.getCurrentlyServing(branch));
    }

    // POST /api/queue/checkin
    // Body: { customerName, serviceType, branchCode, customerPhone, customerEmail }
    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(@RequestBody Map<String, String> body) {
        String name        = body.get("customerName");
        String serviceType = body.get("serviceType");
        String branchCode  = body.get("branchCode");
        String phone       = body.getOrDefault("customerPhone", "");
        String email       = body.getOrDefault("customerEmail", "");

        if (name == null || name.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Customer name is required"));
        if (serviceType == null || serviceType.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Service type is required"));
        if (branchCode == null || branchCode.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Branch is required"));

        try {
            QueueEntry entry = queueService.checkIn(
                    name.trim(), serviceType.trim(), branchCode.trim(), phone.trim(), email.trim());
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/queue/serve-next?branch=BR001
    @PostMapping("/serve-next")
    public ResponseEntity<?> serveNext(@RequestParam String branch) {
        return queueService.serveNext(branch)
                .map(e -> ResponseEntity.ok((Object) e))
                .orElse(ResponseEntity.ok(Map.of("message", "No customers waiting")));
    }

    // PUT /api/queue/complete/{id}
    @PutMapping("/complete/{id}")
    public ResponseEntity<?> complete(@PathVariable Long id) {
        return queueService.completeService(id)
                .map(e -> ResponseEntity.ok((Object) e))
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/queue/cancel/{token}
    @PutMapping("/cancel/{token}")
    public ResponseEntity<?> cancel(@PathVariable String token) {
        return queueService.cancelByToken(token)
                .map(e -> ResponseEntity.ok((Object) e))
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/queue/status/{token}
    @GetMapping("/status/{token}")
    public ResponseEntity<?> statusByToken(@PathVariable String token) {
        return queueService.checkStatus(token)
                .map(e -> ResponseEntity.ok((Object) e))
                .orElse(ResponseEntity.notFound().build());
    }
}