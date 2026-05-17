package com.nomow.company_screener.service;

import com.nomow.company_screener.entity.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    public String ask(Company company, String question) {
        String prompt = """
                You are a helpful assistant. Here is information about a company:
                Name: %s | Sector: %s | Country: %s | Founded: %d | Employees: %d
                Description: %s
                User question: "%s"
                Answer briefly in 2-3 sentences.
                """.formatted(
                company.getName(), company.getSector(), company.getCountry(),
                company.getFoundedYear(), company.getEmployeeCount(),
                company.getDescription(), question);

        RestClient client = RestClient.create();

        Map<String, Object> body = Map.of(
                "model", "llama-3.1-8b-instant",
                "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        Map response = client.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(body)
                .retrieve()
                .body(Map.class);

        var choices = (List<Map>) response.get("choices");
        var message = (Map) choices.get(0).get("message");
        return (String) message.get("content");
    }
}