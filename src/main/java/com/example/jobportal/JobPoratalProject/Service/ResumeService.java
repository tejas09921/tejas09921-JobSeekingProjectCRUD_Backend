package com.example.jobportal.JobPoratalProject.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.jobportal.JobPoratalProject.Dao.*;
import com.example.jobportal.JobPoratalProject.entity.Resume;
import com.example.jobportal.JobPoratalProject.entity.User;


@Service
public class ResumeService {

    @Autowired
    private ResumeDao dao;

    public void saveResume(Resume resume) {
        dao.saveResume(resume);
    }

    public Resume getResumeByUser(User user) {
        return dao.getResumeByUser(user);
    }

    public void updateResume(Long id, Resume resume) {
        dao.updateResume(id, resume);
    }

    public void deleteResume(Long id) {
        dao.deleteResume(id);
    }
}
