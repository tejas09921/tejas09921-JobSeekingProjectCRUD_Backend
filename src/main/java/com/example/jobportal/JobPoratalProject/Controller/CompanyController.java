package com.example.jobportal.JobPoratalProject.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.jobportal.JobPoratalProject.Service.CompanyService;
import com.example.jobportal.JobPoratalProject.entity.*;

@RestController
@RequestMapping("/companies")
@CrossOrigin("*")
public class CompanyController {

    @Autowired
    private CompanyService service;

    // 1. Get all companies
    @GetMapping
    public List<Company> getAllCompanies() {
        return service.getAllCompanies();
    }

    // 2. Get company by ID
    @GetMapping("/{id}")
    public Company getCompanyById(@PathVariable Long id) {
        return service.getCompanyById(id);
    }

    // 3. Get company by name
    @GetMapping("/name/{name}")
    public Company getCompanyByName(@PathVariable String name) {
        return service.getCompanyByName(name);
    }

    // 4. Add new company
    @PostMapping("/add")
    public String addCompany(@RequestBody Company company) {
        service.saveCompany(company);
        return "Company added successfully!";
    }

    // 5. Update company
    @PutMapping("/{id}")
    public String updateCompany(@PathVariable Long id, @RequestBody Company company) {
        service.updateCompany(id, company);
        return "Company updated successfully!";
    }

    // 6. Delete company
    @DeleteMapping("/{id}")
    public String deleteCompany(@PathVariable Long id) {
        service.deleteCompany(id);
        return "Company deleted successfully!";
    }
}
