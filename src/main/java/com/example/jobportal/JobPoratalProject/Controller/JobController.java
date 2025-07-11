package com.example.jobportal.JobPoratalProject.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.jobportal.JobPoratalProject.Service.JobService;
import com.example.jobportal.JobPoratalProject.entity.*;

@RestController
@RequestMapping("/jobs")
@CrossOrigin("*")
public class JobController {

    @Autowired
    private JobService service;

    // 1. Get all jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return service.getAllJobs();
    }

    // 2. Get job by ID
    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return service.getJobById(id);
    }

    // 3. Get jobs by company
    @GetMapping("/company/{company}")
    public List<Job> getByCompany(@PathVariable String company) {
        return service.getJobsByCompany(company);
    }

    // 4. Get jobs by location
    @GetMapping("/location/{location}")
    public List<Job> getByLocation(@PathVariable String location) {
        return service.getJobsByLocation(location);
    }

    // 5. Search jobs by title
    @GetMapping("/search/{keyword}")
    public List<Job> searchByTitle(@PathVariable String keyword) {
        return service.searchJobsByTitle(keyword);
    }

    // 6. Post a new job
    @PostMapping("/add")
    public String addJob(@RequestBody Job job) {
        service.saveJob(job);
        return "Job posted successfully!";
    }

    // 7. Update job by ID
    @PutMapping("/{id}")
    public String updateJob(@PathVariable Long id, @RequestBody Job job) {
        service.updateJob(id, job);
        return "Job updated successfully!";
    }

    // 8. Delete job by ID
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {
        service.deleteJob(id);
        return "Job deleted successfully!";
    }
}

