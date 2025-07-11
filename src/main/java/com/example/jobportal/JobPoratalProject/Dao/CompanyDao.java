package com.example.jobportal.JobPoratalProject.Dao;

import com.example.jobportal.JobPoratalProject.entity.*;
import jakarta.persistence.criteria.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CompanyDao {

    @Autowired
    private SessionFactory factory;

    // 🔹 Save Company
    public void saveCompany(Company company) {
        Session session = factory.openSession();
        session.beginTransaction();
        session.persist(company);
        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Get all Companies
    public List<Company> getAllCompanies() {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Company> cq = cb.createQuery(Company.class);
            Root<Company> root = cq.from(Company.class);
            cq.select(root);
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Get Company by ID
    public Company getCompanyById(Long id) {
        try (Session session = factory.openSession()) {
            return session.get(Company.class, id);
        }
    }

    // 🔹 Get Company by Name
    public Company getCompanyByName(String name) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Company> cq = cb.createQuery(Company.class);
            Root<Company> root = cq.from(Company.class);
            cq.select(root).where(cb.equal(root.get("name"), name));
            return session.createQuery(cq).uniqueResult();
        }
    }

    // 🔹 Update Company
    public void updateCompany(Long id, Company updatedCompany) {
        Session session = factory.openSession();
        session.beginTransaction();

        Company existing = session.get(Company.class, id);
        if (existing != null) {
            existing.setName(updatedCompany.getName());
            existing.setDescription(updatedCompany.getDescription());
            existing.setWebsite(updatedCompany.getWebsite());
            existing.setLocation(updatedCompany.getLocation());
            session.merge(existing);
        }

        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Delete Company
    public void deleteCompany(Long id) {
        Session session = factory.openSession();
        session.beginTransaction();

        Company company = session.get(Company.class, id);
        if (company != null) {
            session.remove(company);
        }

        session.getTransaction().commit();
        session.close();
    }
}
