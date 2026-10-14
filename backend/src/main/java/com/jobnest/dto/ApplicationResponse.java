package com.jobnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private CandidateDto candidate;
    private LocalDateTime appliedAt;
    private String status;
    private String cvUrl;
    private String coverLetter;
    private Integer aiScore;
    private AiReviewDto aiReview;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateDto {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String avatarUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiReviewDto {
        private Integer score;
        private String verdict;
        private List<String> strengths;
        private List<String> weaknesses;
        private String summary;
    }
}
