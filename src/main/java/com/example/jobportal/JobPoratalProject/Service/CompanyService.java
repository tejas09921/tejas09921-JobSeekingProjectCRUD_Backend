package com.example.jobportal.JobPoratalProject.Service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.jobportal.JobPoratalProject.Dao.*;
import com.example.jobportal.JobPoratalProject.entity.Company;

@Service
public class CompanyService {

    @Autowired
    private CompanyDao dao;

    public void saveCompany(Company company) {
        dao.saveCompany(company);
    }

    public List<Company> getAllCompanies() {
        return dao.getAllCompanies();
    }

    public Company getCompanyById(Long id) {
        return dao.getCompanyById(id);
    }

    public Company getCompanyByName(String name) {
        return dao.getCompanyByName(name);
    }

    public void updateCompany(Long id, Company company) {
        dao.updateCompany(id, company);
    }

    public void deleteCompany(Long id) {
        dao.deleteCompany(id);
    }
}

