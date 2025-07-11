package com.example.jobportal.JobPoratalProject.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@Column(unique = true, nullable = false)
	private String email;

	private String password;

	private String role; // JOB_SEEKER or RECRUITER

	private String mobile;

	// One Recruiter can post many jobs
	@OneToMany(mappedBy = "postedBy", cascade = CascadeType.ALL)
	private List<Job> postedJobs = new ArrayList<>();

	// One Job Seeker can apply to many jobs
	@OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL)
	private List<Application> applications = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public List<Job> getPostedJobs() {
		return postedJobs;
	}

	public void setPostedJobs(List<Job> postedJobs) {
		this.postedJobs = postedJobs;
	}

	public List<Application> getApplications() {
		return applications;
	}

	public void setApplications(List<Application> applications) {
		this.applications = applications;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", role=" + role
				+ ", mobile=" + mobile + ", postedJobs=" + postedJobs + ", applications=" + applications + "]";
	}

	public User(Long id, String name, String email, String password, String role, String mobile, List<Job> postedJobs,
			List<Application> applications) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.role = role;
		this.mobile = mobile;
		this.postedJobs = postedJobs;
		this.applications = applications;
	}

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}

	// Getters & Setters

}
