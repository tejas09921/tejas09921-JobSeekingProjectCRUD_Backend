package com.example.jobportal.JobPoratalProject.Dao;

import com.example.jobportal.JobPoratalProject.entity.*;
import jakarta.persistence.criteria.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class JobDao {

    @Autowired
    private SessionFactory factory;

    // 🔹 Add new Job
    public void saveJob(Job job) {
        Session session = factory.openSession();
        session.beginTransaction();
        job.setPostedDate(new Date()); // Set current date
        session.persist(job);
        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Get all Jobs
    public List<Job> getAllJobs() {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Job> cq = cb.createQuery(Job.class);
            Root<Job> root = cq.from(Job.class);
            cq.select(root);
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Get Job by ID
    public Job getJobById(Long id) {
        try (Session session = factory.openSession()) {
            return session.get(Job.class, id);
        }
    }

    // 🔹 Update Job
    public void updateJob(Long id, Job updatedJob) {
        Session session = factory.openSession();
        session.beginTransaction();

        Job existing = session.get(Job.class, id);
        if (existing != null) {
            existing.setTitle(updatedJob.getTitle());
            existing.setDescription(updatedJob.getDescription());
            existing.setCompany(updatedJob.getCompany());
            existing.setLocation(updatedJob.getLocation());
            existing.setSalary(updatedJob.getSalary());
            existing.setJobType(updatedJob.getJobType());
            session.merge(existing);
        }

        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Delete Job
    public void deleteJob(Long id) {
        Session session = factory.openSession();
        session.beginTransaction();

        Job job = session.get(Job.class, id);
        if (job != null) {
            session.remove(job);
        }

        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Get Jobs by Company
    public List<Job> getJobsByCompany(String company) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Job> cq = cb.createQuery(Job.class);
            Root<Job> root = cq.from(Job.class);
            cq.select(root).where(cb.equal(root.get("company"), company));
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Get Jobs by Location
    public List<Job> getJobsByLocation(String location) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Job> cq = cb.createQuery(Job.class);
            Root<Job> root = cq.from(Job.class);
            cq.select(root).where(cb.equal(root.get("location"), location));
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Search Jobs by Title using LIKE
    public List<Job> searchJobsByTitle(String keyword) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Job> cq = cb.createQuery(Job.class);
            Root<Job> root = cq.from(Job.class);
            Predicate titleLike = cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
            cq.select(root).where(titleLike);
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Get Jobs posted by a specific recruiter (User)
    public List<Job> getJobsByRecruiter(User recruiter) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Job> cq = cb.createQuery(Job.class);
            Root<Job> root = cq.from(Job.class);
            cq.select(root).where(cb.equal(root.get("postedBy"), recruiter));
            return session.createQuery(cq).getResultList();
        }
    }
}
