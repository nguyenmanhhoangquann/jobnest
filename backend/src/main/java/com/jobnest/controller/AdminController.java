package com.jobnest.controller;

import com.jobnest.dto.JobDto;
import com.jobnest.dto.UserDto;
import com.jobnest.entity.Role;
import com.jobnest.entity.User;
import com.jobnest.repository.ApplicationRepository;
import com.jobnest.repository.CompanyRepository;
import com.jobnest.repository.JobRepository;
import com.jobnest.repository.ReportRepository;
import com.jobnest.repository.UserRepository;
import com.jobnest.service.AuthService;
import com.jobnest.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final ReportRepository reportRepository;
    private final AuthService authService;
    private final JobService jobService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userRepository.count();
        long totalEmployers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.EMPLOYER).count();
        long totalCandidates = userRepository.findAll().stream().filter(u -> u.getRole() == Role.CANDIDATE).count();
        long activeJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        long pendingReports = reportRepository.findAll().stream().filter(r -> "PENDING".equalsIgnoreCase(r.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalEmployers", totalEmployers);
        stats.put("totalCandidates", totalCandidates);
        stats.put("activeJobs", activeJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("pendingReports", pendingReports);
        stats.put("pendingCompanies", companyRepository.count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll()
                .stream()
                .map(authService::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể xóa tài khoản Quản trị viên");
        }

        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa tài khoản người dùng thành công"));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDto>> getAdminJobs() {
        List<JobDto> jobs = jobRepository.findAll()
                .stream()
                .map(j -> jobService.mapToDto(j, null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(jobs);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, Object>> deleteJob(@PathVariable Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin tuyển dụng");
        }
        jobRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa tin tuyển dụng thành công"));
    }

    @GetMapping("/companies")
    public ResponseEntity<List<com.jobnest.entity.Company>> getCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }
}
