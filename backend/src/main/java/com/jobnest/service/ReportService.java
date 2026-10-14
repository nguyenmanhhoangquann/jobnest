package com.jobnest.service;

import com.jobnest.entity.Report;
import com.jobnest.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public List<Report> getReports() {
        return reportRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    @Transactional
    public Report updateStatus(Long id, String status, String adminNote) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy báo cáo"));

        if (status != null && !status.isBlank()) {
            report.setStatus(status);
        }
        if (adminNote != null) {
            report.setAdminNote(adminNote);
        }
        return reportRepository.save(report);
    }
}
