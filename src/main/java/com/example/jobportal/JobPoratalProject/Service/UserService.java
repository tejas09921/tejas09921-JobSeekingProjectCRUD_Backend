package com.example.jobportal.JobPoratalProject.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.jobportal.JobPoratalProject.Dao.*;
import com.example.jobportal.JobPoratalProject.entity.*;

@Service
public class UserService {

    @Autowired
    private UserDao dao;

    // 1. Save user
    public void saveUser(User user) {
        dao.saveUser(user);
    }

    // 2. Get all users
    public List<User> getAllUsers() {
        return dao.getAllUsers();
    }

    // 3. Get user by email
    public User getUserByEmail(String email) {
        return dao.getUserByEmail(email);
    }

    // 4. Update user
    public void updateUser(Long id, User user) {
        dao.updateUser(id, user);
    }

    // 5. Delete user
    public void deleteUser(Long id) {
        dao.deleteUser(id);
    }
}
