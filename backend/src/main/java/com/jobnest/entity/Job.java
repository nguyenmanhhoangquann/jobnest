package com.jobnest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 250)
    private String title;

    @Column(length = 100)
    private String salaryText;

    private Integer salaryMin;
    private Integer salaryMax;

    @Column(length = 200)
    private String location;

    @Column(length = 100)
    private String area;

    @Column(length = 100)
    private String region;

    @Column(length = 50)
    private String jobType;

    @Column(length = 50)
    private String experience;

    @Column(length = 50)
    private String position;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id")
    private User employer;

    private Boolean isHot;
    private Boolean isUrgent;
    private Boolean isTop;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    private Integer quantity;

    @Column(length = 50)
    private String deadline;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (isHot == null) isHot = false;
        if (isUrgent == null) isUrgent = false;
        if (isTop == null) isTop = false;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
