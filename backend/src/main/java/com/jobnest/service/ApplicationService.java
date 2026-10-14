package com.jobnest.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobnest.dto.ApplicationResponse;
import com.jobnest.entity.Application;
import com.jobnest.entity.Job;
import com.jobnest.entity.Notification;
import com.jobnest.entity.User;
import com.jobnest.repository.ApplicationRepository;
import com.jobnest.repository.JobRepository;
import com.jobnest.repository.NotificationRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final NotificationRepository notificationRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

    @Transactional
    public ApplicationResponse applyJob(Long jobId, String fullName, String email, String phone,
                                        String coverLetter, MultipartFile cvFile, User candidate) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy việc làm"));

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), jobId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã nộp hồ sơ ứng tuyển vào vị trí này rồi");
        }

        String cvUrl = "/files/cv_sample.pdf";
        if (cvFile != null && !cvFile.isEmpty()) {
            try {
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String originalName = cvFile.getOriginalFilename() != null ? cvFile.getOriginalFilename() : "cv.pdf";
                String safeName = System.currentTimeMillis() + "_" + originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
                Path targetPath = Paths.get(uploadDir, safeName);
                Files.copy(cvFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                cvUrl = "/files/" + safeName;
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể lưu file CV: " + e.getMessage());
            }
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status("PENDING")
                .cvUrl(cvUrl)
                .coverLetter(coverLetter)
                .build();

        Application saved = applicationRepository.save(application);

        // Tạo thông báo cho ứng viên
        notificationRepository.save(Notification.builder()
                .user(candidate)
                .content("Hồ sơ ứng tuyển cho vị trí \"" + job.getTitle() + "\" đã được gửi thành công.")
                .isRead(false)
                .build());

        // Tạo thông báo cho nhà tuyển dụng nếu có
        if (job.getEmployer() != null) {
            notificationRepository.save(Notification.builder()
                    .user(job.getEmployer())
                    .content("Ứng viên " + (fullName != null ? fullName : candidate.getFullName()) +
                            " vừa nộp hồ sơ ứng tuyển vào vị trí \"" + job.getTitle() + "\".")
                    .isRead(false)
                    .build());
        }

        return mapToResponse(saved);
    }

    public Page<ApplicationResponse> getMyApplications(String status, Pageable pageable, User candidate) {
        Specification<Application> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("candidate").get("id"), candidate.getId()));
            if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Application> page = applicationRepository.findAll(spec, pageable);
        return page.map(this::mapToResponse);
    }

    public Page<ApplicationResponse> getReceivedApplications(Long jobId, String status, String keyword,
                                                             Pageable pageable, User employer) {

        Specification<Application> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Nếu employer không phải là ADMIN, lọc theo employer_id hoặc companyName
            if (employer.getRole() != com.jobnest.entity.Role.ADMIN) {
                Predicate byEmployerId = cb.equal(root.get("job").get("employer").get("id"), employer.getId());
                if (employer.getCompanyName() != null && !employer.getCompanyName().isBlank()) {
                    Predicate byCompanyName = cb.equal(root.get("job").get("company").get("name"), employer.getCompanyName());
                    predicates.add(cb.or(byEmployerId, byCompanyName));
                } else {
                    predicates.add(byEmployerId);
                }
            }

            if (jobId != null) {
                predicates.add(cb.equal(root.get("job").get("id"), jobId));
            }

            if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                String kw = "%" + keyword.trim().toLowerCase() + "%";
                Predicate pName = cb.like(cb.lower(root.get("candidate").get("fullName")), kw);
                Predicate pEmail = cb.like(cb.lower(root.get("candidate").get("email")), kw);
                Predicate pTitle = cb.like(cb.lower(root.get("job").get("title")), kw);
                predicates.add(cb.or(pName, pEmail, pTitle));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Application> page = applicationRepository.findAll(spec, pageable);
        return page.map(this::mapToResponse);
    }

    @Transactional
    public void updateStatus(Long id, String status, User employer) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ"));

        app.setStatus(status);
        applicationRepository.save(app);

        // Thông báo cho ứng viên
        String statusText = switch (status) {
            case "ACCEPTED" -> "được Chấp nhận";
            case "VIEWED" -> "đã được Nhà tuyển dụng xem";
            case "REJECTED" -> "chưa phù hợp lần này";
            default -> status;
        };

        notificationRepository.save(Notification.builder()
                .user(app.getCandidate())
                .content("Hồ sơ vị trí \"" + app.getJob().getTitle() + "\" của bạn: " + statusText + ".")
                .isRead(false)
                .build());
    }

    @Transactional
    public void deleteApplication(Long id, User user) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ"));

        if (user.getRole() != com.jobnest.entity.Role.ADMIN) {
            boolean isOwner = app.getJob() != null && app.getJob().getEmployer() != null
                    && app.getJob().getEmployer().getId().equals(user.getId());
            boolean isCompanyMatch = user.getCompanyName() != null && !user.getCompanyName().isBlank()
                    && app.getJob() != null && app.getJob().getCompany() != null
                    && user.getCompanyName().equalsIgnoreCase(app.getJob().getCompany().getName());

            if (!isOwner && !isCompanyMatch) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xóa hồ sơ này");
            }
        }

        applicationRepository.delete(app);
    }

    public ApplicationResponse mapToResponse(Application app) {
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();

        if (app.getAiStrengthsJson() != null && !app.getAiStrengthsJson().isBlank()) {
            try {
                strengths = objectMapper.readValue(app.getAiStrengthsJson(), new TypeReference<List<String>>() {});
            } catch (Exception ignored) {}
        }

        if (app.getAiWeaknessesJson() != null && !app.getAiWeaknessesJson().isBlank()) {
            try {
                weaknesses = objectMapper.readValue(app.getAiWeaknessesJson(), new TypeReference<List<String>>() {});
            } catch (Exception ignored) {}
        }

        ApplicationResponse.AiReviewDto reviewDto = null;
        if (app.getAiScore() != null) {
            reviewDto = ApplicationResponse.AiReviewDto.builder()
                    .score(app.getAiScore())
                    .verdict(app.getAiVerdict())
                    .strengths(strengths)
                    .weaknesses(weaknesses)
                    .summary(app.getAiSummary())
                    .build();
        }

        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJob() != null ? app.getJob().getId() : null)
                .jobTitle(app.getJob() != null ? app.getJob().getTitle() : "")
                .candidate(ApplicationResponse.CandidateDto.builder()
                        .id(app.getCandidate().getId())
                        .fullName(app.getCandidate().getFullName())
                        .email(app.getCandidate().getEmail())
                        .phone(app.getCandidate().getPhone())
                        .avatarUrl(app.getCandidate().getAvatarUrl())
                        .build())
                .appliedAt(app.getAppliedAt())
                .status(app.getStatus())
                .cvUrl(app.getCvUrl())
                .coverLetter(app.getCoverLetter())
                .aiScore(app.getAiScore())
                .aiReview(reviewDto)
                .build();
    }
}
