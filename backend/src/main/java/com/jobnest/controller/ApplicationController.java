package com.jobnest.controller;

import com.jobnest.dto.ApplicationResponse;
import com.jobnest.entity.User;
import com.jobnest.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> applyJob(
            @RequestParam("jobId") Long jobId,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "coverLetter", required = false) String coverLetter,
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile,
            @RequestParam(value = "cv", required = false) MultipartFile cvFallback,
            @AuthenticationPrincipal User candidate
    ) {
        MultipartFile file = (cvFile != null && !cvFile.isEmpty()) ? cvFile : cvFallback;
        ApplicationResponse response = applicationService.applyJob(jobId, fullName, email, phone, coverLetter, file, candidate);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "application", response
        ));
    }

    @GetMapping("/mine")
    public ResponseEntity<Page<ApplicationResponse>> getMyApplications(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User candidate
    ) {
        int pageIndex = Math.max(0, page > 0 ? page - 1 : 0);
        Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return ResponseEntity.ok(applicationService.getMyApplications(status, pageable, candidate));
    }

    @GetMapping("/received")
    public ResponseEntity<Page<ApplicationResponse>> getReceivedApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User employer
    ) {
        int pageIndex = Math.max(0, page > 0 ? page - 1 : 0);
        Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return ResponseEntity.ok(applicationService.getReceivedApplications(jobId, status, keyword, pageable, employer));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User employer
    ) {
        String status = body.get("status");
        applicationService.updateStatus(id, status, employer);
        return ResponseEntity.ok(Map.of("success", true, "message", "Cập nhật trạng thái thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        applicationService.deleteApplication(id, user);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã gỡ hồ sơ ứng tuyển thành công"));
    }
}
