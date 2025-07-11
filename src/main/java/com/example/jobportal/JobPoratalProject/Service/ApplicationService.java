package com.example.jobportal.JobPoratalProject.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.jobportal.JobPoratalProject.Dao.*;
import com.example.jobportal.JobPoratalProject.entity.Application;
import com.example.jobportal.JobPoratalProject.entity.Job;
import com.example.jobportal.JobPoratalProject.entity.User;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationDao dao;

    public void saveApplication(Application application) {
        dao.saveApplication(application);
    }

    public List<Application> getAllApplications() {
        return dao.getAllApplications();
    }

    public Application getApplicationById(Long id) {
        return dao.getApplicationById(id);
    }

    public List<Application> getApplicationsByJob(Job job) {
        return dao.getApplicationsByJob(job);
    }

    public List<Application> getApplicationsByApplicant(User user) {
        return dao.getApplicationsByApplicant(user);
    }

    public void updateApplicationStatus(Long id, String newStatus) {
        dao.updateApplicationStatus(id, newStatus);
    }

    public void deleteApplication(Long id) {
        dao.deleteApplication(id);
    }
}

