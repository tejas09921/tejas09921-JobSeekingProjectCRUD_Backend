package com.example.jobportal.JobPoratalProject.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resumeLink;
    private String status; // APPLIED / REJECTED / SELECTED

    @Temporal(TemporalType.DATE)
    private Date appliedDate;

    // Many applications by one user
    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private User applicant;

    // One application belongs to one job
    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getResumeLink() {
		return resumeLink;
	}

	public void setResumeLink(String resumeLink) {
		this.resumeLink = resumeLink;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getAppliedDate() {
		return appliedDate;
	}

	public void setAppliedDate(Date appliedDate) {
		this.appliedDate = appliedDate;
	}

	public User getApplicant() {
		return applicant;
	}

	public void setApplicant(User applicant) {
		this.applicant = applicant;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

    // Getters & Setters
    
    
}

