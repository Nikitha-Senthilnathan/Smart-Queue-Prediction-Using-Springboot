package com.smartqueue.Backend.controller;

import com.smartqueue.Backend.model.User;
import com.smartqueue.Backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/login
     * Body: { "username": "admin", "password": "admin123" }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username and password are required"));
        }

        return authService.login(username.trim(), password)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", user.getId());
                    response.put("username", user.getUsername());
                    response.put("fullName", user.getFullName());
                    response.put("email", user.getEmail());
                    response.put("role", user.getRole().name());
                    response.put("message", "Login successful");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401)
                        .body(Map.of("error", "Invalid username or password")));
    }

    /**
     * GET /api/auth/staff
     * Get all staff users (admin only)
     */
    @GetMapping("/staff")
    public ResponseEntity<List<User>> getAllStaff() {
        return ResponseEntity.ok(authService.getAllStaff());
    }

    /**
     * GET /api/auth/users
     * Get all users (admin only)
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    /**
     * POST /api/auth/staff/create
     * Create new staff account (admin only)
     * Body: { "username": "...", "password": "...", "fullName": "...", "email": "..." }
     */
    @PostMapping("/staff/create")
    public ResponseEntity<?> createStaff(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String password = body.get("password");
            String fullName = body.get("fullName");
            String email    = body.get("email");

            if (username == null || password == null || fullName == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "username, password and fullName are required"));
            }

            User created = authService.createStaff(
                    username.trim(), password, fullName.trim(),
                    email != null ? email.trim() : "");
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/auth/users/{id}/toggle
     * Toggle active status of a user
     */
    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        return authService.toggleUserStatus(id)
                .map(u -> ResponseEntity.ok((Object) Map.of(
                        "id", u.getId(),
                        "active", u.isActive(),
                        "message", u.isActive() ? "User activated" : "User deactivated"
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/auth/users/{id}
     * Delete a user
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}