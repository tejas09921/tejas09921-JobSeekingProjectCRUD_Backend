package com.example.jobportal.JobPoratalProject.Dao;

import com.example.jobportal.JobPoratalProject.entity.*;
import jakarta.persistence.criteria.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ResumeDao {

    @Autowired
    private SessionFactory factory;

    // 🔹 Save Resume
    public void saveResume(Resume resume) {
        Session session = factory.openSession();
        session.beginTransaction();
        session.persist(resume);
        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Get Resume by User
    public Resume getResumeByUser(User user) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Resume> cq = cb.createQuery(Resume.class);
            Root<Resume> root = cq.from(Resume.class);
            cq.select(root).where(cb.equal(root.get("user"), user));
            return session.createQuery(cq).uniqueResult();
        }
    }

    // 🔹 Update Resume
    public void updateResume(Long id, Resume updatedResume) {
        Session session = factory.openSession();
        session.beginTransaction();

        Resume existing = session.get(Resume.class, id);
        if (existing != null) {
            existing.setEducation(updatedResume.getEducation());
            existing.setExperience(updatedResume.getExperience());
            existing.setSkills(updatedResume.getSkills());
            existing.setResumeFilePath(updatedResume.getResumeFilePath());
            session.merge(existing);
        }

        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Delete Resume
    public void deleteResume(Long id) {
        Session session = factory.openSession();
        session.beginTransaction();

        Resume resume = session.get(Resume.class, id);
        if (resume != null) {
            session.remove(resume);
        }

        session.getTransaction().commit();
        session.close();
    }
}

