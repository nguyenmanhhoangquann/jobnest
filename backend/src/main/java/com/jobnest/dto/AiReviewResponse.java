package com.jobnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiReviewResponse {
    private Integer score;
    private String verdict;
    private List<String> strengths;
    private List<String> weaknesses;
    private String summary;
}
