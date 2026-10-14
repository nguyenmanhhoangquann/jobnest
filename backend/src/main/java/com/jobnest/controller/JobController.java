package com.jobnest.controller;

import com.jobnest.dto.JobCreateRequest;
import com.jobnest.dto.JobDto;
import com.jobnest.entity.User;
import com.jobnest.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping("/jobs")
    public ResponseEntity<Page<JobDto>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) Integer salaryMin,
            @RequestParam(required = false) Integer salaryMax,
            @RequestParam(required = false) String salary,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal User currentUser
    ) {
        int pageIndex = Math.max(0, page > 0 ? page - 1 : 0);
        Sort sortObj = "salary_desc".equalsIgnoreCase(sort)
                ? Sort.by(Sort.Direction.DESC, "salaryMax")
                : Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(pageIndex, size, sortObj);
        return ResponseEntity.ok(jobService.getJobs(keyword, category, area, jobType, experience, position, salaryMin, salaryMax, salary, pageable, currentUser));
    }

    @GetMapping("/jobs/random")
    public ResponseEntity<List<JobDto>> getRandomJobs(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String area,
            @RequestParam(defaultValue = "9") int limit,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(jobService.getRandomJobs(type, area, limit, currentUser));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobDto> getJobDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(jobService.getJobDetail(id, currentUser));
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobDto> createJob(
            @RequestBody JobCreateRequest request,
            @AuthenticationPrincipal User employer
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(request, employer));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<JobDto> updateJob(
            @PathVariable Long id,
            @RequestBody JobCreateRequest request,
            @AuthenticationPrincipal User employer
    ) {
        return ResponseEntity.ok(jobService.updateJob(id, request, employer));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, Object>> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal User employer
    ) {
        jobService.deleteJob(id, employer);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa tin tuyển dụng"));
    }

    // Saved Jobs Endpoints
    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<Map<String, Object>> saveJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User candidate
    ) {
        jobService.saveJob(jobId, candidate);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<Map<String, Object>> unsaveJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User candidate
    ) {
        jobService.unsaveJob(jobId, candidate);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<Page<JobDto>> getSavedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal User candidate
    ) {
        int pageIndex = Math.max(0, page > 0 ? page - 1 : 0);
        Pageable pageable = PageRequest.of(pageIndex, size);
        return ResponseEntity.ok(jobService.getSavedJobs(pageable, candidate));
    }
}
