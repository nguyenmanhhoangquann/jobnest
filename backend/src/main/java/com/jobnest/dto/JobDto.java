package com.jobnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {
    private Long id;
    private String title;
    private String salaryText;
    private Integer salaryMin;
    private Integer salaryMax;
    private String location;
    private String area;
    private String region;
    private String jobType;
    private String experience;
    private String position;

    private CategoryDto category;
    private CompanyDto company;

    private Boolean isHot;
    private Boolean isUrgent;
    private Boolean isTop;
    private Boolean saved;

    private String description;
    private String requirements;
    private String benefits;
    private Integer quantity;
    private String deadline;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDto {
        private Long id;
        private String slug;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyDto {
        private Long id;
        private String name;
        private String logoUrl;
        private String location;
    }
}
