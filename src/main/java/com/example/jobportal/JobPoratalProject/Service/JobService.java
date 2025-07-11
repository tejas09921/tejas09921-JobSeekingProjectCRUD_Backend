package com.example.jobportal.JobPoratalProject.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.jobportal.JobPoratalProject.Dao.*;
import com.example.jobportal.JobPoratalProject.entity.*;

@Service
public class JobService {

    @Autowired
    private JobDao dao;

    public void saveJob(Job job) {
        dao.saveJob(job);
    }

    public List<Job> getAllJobs() {
        return dao.getAllJobs();
    }

    public Job getJobById(Long id) {
        return dao.getJobById(id);
    }

    public void updateJob(Long id, Job job) {
        dao.updateJob(id, job);
    }

    public void deleteJob(Long id) {
        dao.deleteJob(id);
    }

    public List<Job> getJobsByCompany(String company) {
        return dao.getJobsByCompany(company);
    }

    public List<Job> getJobsByLocation(String location) {
        return dao.getJobsByLocation(location);
    }

    public List<Job> searchJobsByTitle(String keyword) {
        return dao.searchJobsByTitle(keyword);
    }

    public List<Job> getJobsByRecruiter(User recruiter) {
        return dao.getJobsByRecruiter(recruiter);
    }
}
