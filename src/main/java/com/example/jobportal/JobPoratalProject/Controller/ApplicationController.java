package com.example.jobportal.JobPoratalProject.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.jobportal.JobPoratalProject.Service.ApplicationService;
import com.example.jobportal.JobPoratalProject.entity.*;

@RestController
@RequestMapping("/applications")
@CrossOrigin("*")
public class ApplicationController {

	@Autowired
	private ApplicationService service;

	// 1. Get all applications
	@GetMapping
	public List<Application> getAllApplications() {
		return service.getAllApplications();
	}

	// 2. Get application by ID
	@GetMapping("/{id}")
	public Application getApplicationById(@PathVariable Long id) {
		return service.getApplicationById(id);
	}

	// 3. Get applications by job (jobId)
	@GetMapping("/job/{jobId}")
	public List<Application> getByJob(@PathVariable Long jobId) {
		Job job = new Job();
		job.setId(jobId);
		return service.getApplicationsByJob(job);
	}

	// 4. Get applications by user (applicantId)
	@GetMapping("/applicant/{userId}")
	public List<Application> getByApplicant(@PathVariable Long userId) {
		User user = new User();
		user.setId(userId);
		return service.getApplicationsByApplicant(user);
	}

	// 5. Apply to job
	@PostMapping("/apply")
	public String apply(@RequestBody Application application) {
		service.saveApplication(application);
		return "Application submitted successfully!";
	}

	// 6. Update application status
	@PutMapping("/status/{id}")
	public String updateStatus(@PathVariable Long id, @RequestBody String status) {
		service.updateApplicationStatus(id, status);
		return "Application status updated!";
	}

	// 7. Delete application
	@DeleteMapping("/{id}")
	public String deleteApplication(@PathVariable Long id) {
		service.deleteApplication(id);
		return "Application deleted!";
	}
}
