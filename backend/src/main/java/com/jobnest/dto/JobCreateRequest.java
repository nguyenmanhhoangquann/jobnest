package com.jobnest.dto;

import lombok.Data;

@Data
public class JobCreateRequest {
    private String title;
    private Long categoryId;
    private String category; // slug or name
    private String location;
    private String area;
    private String region;
    private String salaryText;
    private Integer salaryMin;
    private Integer salaryMax;
    private String position;
    private String jobType;
    private String experience;
    private String deadline;
    private Integer quantity;
    private String description;
    private String requirements;
    private String benefits;
}
