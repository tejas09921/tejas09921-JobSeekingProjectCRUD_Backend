package com.example.jobportal.JobPoratalProject.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.jobportal.JobPoratalProject.entity.*;
import com.example.jobportal.JobPoratalProject.Service.*;

@RestController
@RequestMapping("/users")
@CrossOrigin("*") // Allow frontend access (React, Angular etc.)
public class UserController {

    @Autowired
    private UserService service;

    // 1. Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    // 2. Get user by email
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return service.getUserByEmail(email);
    }

    // 3. Add new user
    @PostMapping("/add")
    public String addUser(@RequestBody User user) {
        service.saveUser(user);
        return "User registered successfully!";
    }

    // 4. Update user
    @PutMapping("/{id}")
    public String updateUser(@PathVariable Long id, @RequestBody User user) {
        service.updateUser(id, user);
        return "User updated successfully!";
    }

    // 5. Delete user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return "User deleted successfully!";
    }
}

