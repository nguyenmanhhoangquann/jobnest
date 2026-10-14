package com.jobnest.controller;

import com.jobnest.entity.Company;
import com.jobnest.entity.Job;
import com.jobnest.repository.CompanyRepository;
import com.jobnest.repository.JobRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyResponse {
        private Long id;
        private String name;
        private String shortName;
        private String slug;
        private String industry;
        private String logo;
        private String cover;
        private String location;
        private String size;
        private String website;
        private boolean verified;
        private String description;
        private List<Map<String, Object>> jobs;
    }

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String location
    ) {
        List<Company> companies = companyRepository.findAll();
        List<Job> allJobs = jobRepository.findAll();

        Map<Long, List<Job>> jobsByCompany = allJobs.stream()
                .filter(j -> j.getCompany() != null)
                .collect(Collectors.groupingBy(j -> j.getCompany().getId()));

        List<CompanyResponse> response = companies.stream().map(c -> {
            List<Job> cJobs = jobsByCompany.getOrDefault(c.getId(), Collections.emptyList());

            List<Map<String, Object>> jobsList = cJobs.stream().map(j -> {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", j.getId());
                map.put("title", j.getTitle());
                map.put("salaryText", j.getSalaryText());
                map.put("location", j.getLocation());
                map.put("jobType", j.getJobType());
                map.put("experience", j.getExperience());
                map.put("deadline", j.getDeadline());
                return map;
            }).collect(Collectors.toList());

            String industryStr = "Công nghệ thông tin";
            if (!cJobs.isEmpty() && cJobs.get(0).getCategory() != null) {
                industryStr = cJobs.get(0).getCategory().getName();
            }

            return CompanyResponse.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .shortName(c.getName())
                    .slug("company-" + c.getId())
                    .industry(industryStr)
                    .logo(c.getLogoUrl() != null ? c.getLogoUrl() : "/images/companies/fpt.svg")
                    .cover("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80")
                    .location(c.getLocation() != null ? c.getLocation() : "Hà Nội")
                    .size(cJobs.size() > 2 ? "10.000+ nhân viên" : "500 - 1.000 nhân viên")
                    .website("https://jobnest.vn")
                    .verified(true)
                    .description(c.getDescription() != null ? c.getDescription() : "Doanh nghiệp hàng đầu, kiến tạo môi trường làm việc chuyên nghiệp chuẩn quốc tế.")
                    .jobs(jobsList)
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyDetail(@PathVariable Long id) {
        Company c = companyRepository.findById(id).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();

        List<Job> cJobs = jobRepository.findByCompanyId(c.getId());
        List<Map<String, Object>> jobsList = cJobs.stream().map(j -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", j.getId());
            map.put("title", j.getTitle());
            map.put("salaryText", j.getSalaryText());
            map.put("location", j.getLocation());
            map.put("jobType", j.getJobType());
            map.put("experience", j.getExperience());
            map.put("deadline", j.getDeadline());
            return map;
        }).collect(Collectors.toList());

        String industryStr = "Công nghệ thông tin";
        if (!cJobs.isEmpty() && cJobs.get(0).getCategory() != null) {
            industryStr = cJobs.get(0).getCategory().getName();
        }

        CompanyResponse res = CompanyResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .shortName(c.getName())
                .slug("company-" + c.getId())
                .industry(industryStr)
                .logo(c.getLogoUrl() != null ? c.getLogoUrl() : "/images/companies/fpt.svg")
                .cover("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80")
                .location(c.getLocation() != null ? c.getLocation() : "Hà Nội")
                .size(cJobs.size() > 2 ? "10.000+ nhân viên" : "500 - 1.000 nhân viên")
                .website("https://jobnest.vn")
                .verified(true)
                .description(c.getDescription() != null ? c.getDescription() : "Doanh nghiệp hàng đầu, kiến tạo môi trường làm việc chuyên nghiệp chuẩn quốc tế.")
                .jobs(jobsList)
                .build();

        return ResponseEntity.ok(res);
    }
}
