package com.nomow.company_screener.service;

import com.nomow.company_screener.entity.Company;
import com.nomow.company_screener.exception.CompanyNotFoundException;
import com.nomow.company_screener.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));
    }
}