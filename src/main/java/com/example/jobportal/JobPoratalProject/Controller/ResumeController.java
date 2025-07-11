package com.example.jobportal.JobPoratalProject.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.jobportal.JobPoratalProject.Service.ResumeService;
import com.example.jobportal.JobPoratalProject.entity.*;

@RestController
@RequestMapping("/resumes")
@CrossOrigin("*")
public class ResumeController {

    @Autowired
    private ResumeService service;

    // 1. Add new resume
    @PostMapping("/add")
    public String addResume(@RequestBody Resume resume) {
        service.saveResume(resume);
        return "Resume uploaded successfully!";
    }

    // 2. Get resume by userId
    @GetMapping("/user/{userId}")
    public Resume getResumeByUser(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        return service.getResumeByUser(user);
    }

    // 3. Update resume
    @PutMapping("/{id}")
    public String updateResume(@PathVariable Long id, @RequestBody Resume resume) {
        service.updateResume(id, resume);
        return "Resume updated successfully!";
    }

    // 4. Delete resume
    @DeleteMapping("/{id}")
    public String deleteResume(@PathVariable Long id) {
        service.deleteResume(id);
        return "Resume deleted successfully!";
    }
}
