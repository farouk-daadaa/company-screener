package com.nomow.company_screener.controller;

import com.nomow.company_screener.entity.Company;
import com.nomow.company_screener.service.AiService;
import com.nomow.company_screener.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final AiService aiService;

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompany(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PostMapping("/{id}/ask")
    public ResponseEntity<Map<String, String>> ask(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Company company = companyService.getCompanyById(id);
        String answer = aiService.ask(company, body.get("question"));
        return ResponseEntity.ok(Map.of("answer", answer));
    }
}