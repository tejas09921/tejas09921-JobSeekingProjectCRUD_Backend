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
public class ApplicationDao {

    @Autowired
    private SessionFactory factory;

    // 🔹 Save new application
    public void saveApplication(Application application) {
        Session session = factory.openSession();
        session.beginTransaction();
        application.setAppliedDate(new Date()); // set current date
        session.persist(application);
        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Get all applications
    public List<Application> getAllApplications() {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Application> cq = cb.createQuery(Application.class);
            Root<Application> root = cq.from(Application.class);
            cq.select(root);
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Get application by ID
    public Application getApplicationById(Long id) {
        try (Session session = factory.openSession()) {
            return session.get(Application.class, id);
        }
    }

    // 🔹 Get applications by Job
    public List<Application> getApplicationsByJob(Job job) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Application> cq = cb.createQuery(Application.class);
            Root<Application> root = cq.from(Application.class);
            cq.select(root).where(cb.equal(root.get("job"), job));
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Get applications by Applicant (User)
    public List<Application> getApplicationsByApplicant(User user) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Application> cq = cb.createQuery(Application.class);
            Root<Application> root = cq.from(Application.class);
            cq.select(root).where(cb.equal(root.get("applicant"), user));
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Update application status
    public void updateApplicationStatus(Long id, String newStatus) {
        Session session = factory.openSession();
        session.beginTransaction();

        Application app = session.get(Application.class, id);
        if (app != null) {
            app.setStatus(newStatus);
            session.merge(app);
        }

        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Delete application
    public void deleteApplication(Long id) {
        Session session = factory.openSession();
        session.beginTransaction();

        Application app = session.get(Application.class, id);
        if (app != null) {
            session.remove(app);
        }

        session.getTransaction().commit();
        session.close();
    }
}
