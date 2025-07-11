package com.example.jobportal.JobPoratalProject.Dao;

import com.example.jobportal.JobPoratalProject.entity.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jakarta.persistence.criteria.*;
import java.util.List;

@Repository
public class UserDao {

    @Autowired
    private SessionFactory factory;

    // 🔹 Create new user
    public void saveUser(User user) {
        Session session = factory.openSession();
        session.beginTransaction();
        session.persist(user);
        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Get all users
    public List<User> getAllUsers() {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<User> cq = cb.createQuery(User.class);
            Root<User> root = cq.from(User.class);
            cq.select(root);
            return session.createQuery(cq).getResultList();
        }
    }

    // 🔹 Find user by email
    public User getUserByEmail(String email) {
        try (Session session = factory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<User> cq = cb.createQuery(User.class);
            Root<User> root = cq.from(User.class);
            cq.select(root).where(cb.equal(root.get("email"), email));
            return session.createQuery(cq).uniqueResult();
        }
    }

    // 🔹 Update user by ID
    public void updateUser(Long id, User updatedUser) {
        Session session = factory.openSession();
        session.beginTransaction();

        User existing = session.get(User.class, id);
        if (existing != null) {
            existing.setName(updatedUser.getName());
            existing.setPassword(updatedUser.getPassword());
            existing.setMobile(updatedUser.getMobile());
            existing.setRole(updatedUser.getRole());
            session.merge(existing);
        }

        session.getTransaction().commit();
        session.close();
    }

    // 🔹 Delete user by ID
    public void deleteUser(Long id) {
        Session session = factory.openSession();
        session.beginTransaction();

        User user = session.get(User.class, id);
        if (user != null) {
            session.remove(user);
        }

        session.getTransaction().commit();
        session.close();
    }
}
