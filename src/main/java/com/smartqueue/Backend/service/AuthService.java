package com.smartqueue.Backend.service;

import com.smartqueue.Backend.model.User;
import com.smartqueue.Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Called on startup to create default accounts if none exist
    public void createDefaultUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");  // plain text for simplicity
            admin.setFullName("System Administrator");
            admin.setEmail("admin@smartqueue.com");
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("✅ Default ADMIN created: username=admin, password=admin123");
        }

        if (!userRepository.existsByUsername("staff")) {
            User staff = new User();
            staff.setUsername("staff");
            staff.setPassword("staff123");  // plain text for simplicity
            staff.setFullName("Bank Staff");
            staff.setEmail("staff@smartqueue.com");
            staff.setRole(User.Role.STAFF);
            staff.setActive(true);
            staff.setCreatedAt(LocalDateTime.now());
            userRepository.save(staff);
            System.out.println("✅ Default STAFF created: username=staff, password=staff123");
        }
    }

    // Login: check username + password + active
    public Optional<User> login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password) && u.isActive());
    }

    // Get all staff users (for admin panel)
    public List<User> getAllStaff() {
        return userRepository.findByRole(User.Role.STAFF);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Create a new staff user (admin only)
    public User createStaff(String username, String password, String fullName, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        User staff = new User();
        staff.setUsername(username);
        staff.setPassword(password);
        staff.setFullName(fullName);
        staff.setEmail(email);
        staff.setRole(User.Role.STAFF);
        staff.setActive(true);
        staff.setCreatedAt(LocalDateTime.now());
        return userRepository.save(staff);
    }

    // Toggle user active status
    public Optional<User> toggleUserStatus(Long id) {
        return userRepository.findById(id).map(user -> {
            user.setActive(!user.isActive());
            return userRepository.save(user);
        });
    }

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}