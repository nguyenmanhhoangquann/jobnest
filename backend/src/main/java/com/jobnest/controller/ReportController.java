package com.jobnest.controller;

import com.jobnest.entity.Report;
import com.jobnest.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<Report>> getReports() {
        return ResponseEntity.ok(reportService.getReports());
    }

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.createReport(report));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Report> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        String adminNote = body.get("adminNote");
        return ResponseEntity.ok(reportService.updateStatus(id, status, adminNote));
    }
}
