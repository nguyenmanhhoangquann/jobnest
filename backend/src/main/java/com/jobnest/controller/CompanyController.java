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

    private CompanyResponse mapToResponse(Company c, List<Job> cJobs) {
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

        String nameLower = c.getName().toLowerCase();
        String industryStr = "Đa ngành";
        String sizeStr = "500 - 1.000 nhân viên";
        String descStr = c.getDescription() != null ? c.getDescription() : "Doanh nghiệp hàng đầu, kiến tạo môi trường làm việc chuyên nghiệp chuẩn quốc tế.";
        String coverUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
        String websiteUrl = "https://jobnest.vn";

        if (nameLower.contains("viettel")) {
            industryStr = "Viễn thông / Công nghệ cao";
            sizeStr = "50.000+ nhân viên";
            descStr = "Tập đoàn công nghệ - viễn thông lớn nhất Việt Nam, hoạt động đa quốc gia trên 11 thị trường tại Châu Á, Châu Phi và Châu Mỹ.";
            coverUrl = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://viettel.com.vn";
        } else if (nameLower.contains("fpt")) {
            industryStr = "IT - Phần mềm / Viễn thông";
            sizeStr = "10.000+ nhân viên";
            descStr = "Tập đoàn công nghệ hàng đầu Việt Nam cung cấp dịch vụ công nghệ thông tin toàn cầu, chuyển đổi số và giải pháp viễn thông.";
            coverUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://fpt.com.vn";
        } else if (nameLower.contains("quân đội") || nameLower.contains("(mb)")) {
            industryStr = "Ngân hàng / Tài chính";
            sizeStr = "15.000+ nhân viên";
            descStr = "Một trong những ngân hàng thương mại cổ phần hàng đầu Việt Nam, tiên phong trong công nghệ ngân hàng số.";
            coverUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://mbbank.com.vn";
        } else if (nameLower.contains("vinamilk")) {
            industryStr = "Hàng tiêu dùng nhanh (FMCG)";
            sizeStr = "10.000+ nhân viên";
            descStr = "Thương hiệu sữa quốc dân hàng đầu Việt Nam, top 40 công ty sữa lớn nhất thế giới với hệ thống trang trại chuẩn quốc tế.";
            coverUrl = "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://vinamilk.com.vn";
        } else if (nameLower.contains("misa")) {
            industryStr = "Phần mềm quản trị doanh nghiệp";
            sizeStr = "3.000+ nhân viên";
            descStr = "Doanh nghiệp công nghệ tiên phong cung cấp giải pháp chuyển đổi số tài chính, kế toán và quản trị doanh nghiệp cho hơn 350.000 khách hàng.";
            coverUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://misa.vn";
        } else if (nameLower.contains("vinhomes")) {
            industryStr = "Bất động sản / Phát triển đô thị";
            sizeStr = "20.000+ nhân viên";
            descStr = "Nhà phát triển bất động sản thương mại và nhà ở số 1 Việt Nam, kiến tạo các đại đô thị thông minh đẳng cấp quốc tế.";
            coverUrl = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://vinhomes.vn";
        } else if (nameLower.contains("hòa phát")) {
            industryStr = "Công nghiệp nặng / Sản xuất";
            sizeStr = "30.000+ nhân viên";
            descStr = "Tập đoàn sản xuất công nghiệp hàng đầu Việt Nam, top 50 doanh nghiệp thép lớn nhất thế giới.";
            coverUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://hoaphat.com.vn";
        } else if (nameLower.contains("ssi")) {
            industryStr = "Chứng khoán & Quản lý quỹ";
            sizeStr = "2.000+ nhân viên";
            descStr = "Định chế tài chính và công ty chứng khoán hàng đầu Việt Nam, cung cấp giải pháp đầu tư toàn diện.";
            coverUrl = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://ssi.com.vn";
        } else if (nameLower.contains("concentrix")) {
            industryStr = "Dịch vụ BPO / Trải nghiệm khách hàng";
            sizeStr = "5.000+ nhân viên";
            descStr = "Tập đoàn công nghệ và giải pháp trải nghiệm khách hàng toàn cầu, vận hành trung tâm dịch vụ đa ngôn ngữ hàng đầu tại Việt Nam.";
            coverUrl = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://concentrix.com";
        } else if (nameLower.contains("vib")) {
            industryStr = "Tài chính - Ngân hàng";
            sizeStr = "10.000+ nhân viên";
            descStr = "Ngân hàng bán lẻ dẫn đầu xu thế ngân hàng số với tốc độ tăng trưởng thẻ tín dụng và dịch vụ số nhanh nhất thị trường.";
            coverUrl = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://vib.com.vn";
        } else if (nameLower.contains("k&m") || nameLower.contains("k-m")) {
            industryStr = "Thương mại & Đầu tư đa ngành";
            sizeStr = "500 - 1.000 nhân sự";
            descStr = "Tập đoàn đầu tư đa ngành hoạt động trong lĩnh vực phân phối thiết bị cơ điện và chuỗi cung ứng thương mại hiện đại.";
            coverUrl = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://kmholdings.vn";
        } else if (nameLower.contains("a.i") || nameLower.contains("ai-soft")) {
            industryStr = "IT - Phần mềm / Trí tuệ nhân tạo";
            sizeStr = "200 - 500 nhân viên";
            descStr = "Đơn vị tiên phong nghiên cứu và ứng dụng các giải pháp trí tuệ nhân tạo và chuyển đổi số doanh nghiệp.";
            coverUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
            websiteUrl = "https://ai-soft.vn";
        } else {
            String[] covers = new String[]{
                "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
            };
            int hash = Math.abs(c.getId() != null ? c.getId().hashCode() : 0);
            coverUrl = covers[hash % covers.length];
            if (!cJobs.isEmpty() && cJobs.get(0).getCategory() != null) {
                industryStr = cJobs.get(0).getCategory().getName();
            }
        }

        return CompanyResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .shortName(c.getName())
                .slug("company-" + c.getId())
                .industry(industryStr)
                .logo(c.getLogoUrl() != null ? c.getLogoUrl() : "/images/companies/fpt.svg")
                .cover(coverUrl)
                .location(c.getLocation() != null ? c.getLocation() : "Hà Nội")
                .size(sizeStr)
                .website(websiteUrl)
                .verified(true)
                .description(descStr)
                .jobs(jobsList)
                .build();
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

        List<CompanyResponse> response = companies.stream()
                .map(c -> mapToResponse(c, jobsByCompany.getOrDefault(c.getId(), Collections.emptyList())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyDetail(@PathVariable Long id) {
        Company c = companyRepository.findById(id).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();

        List<Job> cJobs = jobRepository.findByCompanyId(c.getId());
        return ResponseEntity.ok(mapToResponse(c, cJobs));
    }
}
