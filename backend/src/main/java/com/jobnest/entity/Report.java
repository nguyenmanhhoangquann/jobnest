package com.jobnest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String targetType; // JOB, USER

    private Long targetId;

    @Column(length = 250)
    private String targetTitle;

    @Column(length = 200)
    private String companyName;

    @Column(length = 150)
    private String reporterName;

    @Column(length = 100)
    private String reporterUsername;

    @Column(length = 50)
    private String reasonId;

    @Column(length = 250)
    private String reasonLabel;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String createdAt;

    @Column(length = 30)
    private String status; // PENDING, REVIEWING, RESOLVED

    @Column(columnDefinition = "TEXT")
    private String adminNote;

    @PrePersist
    public void prePersist() {
        if (status == null || status.isBlank()) status = "PENDING";
        if (createdAt == null || createdAt.isBlank()) {
            createdAt = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        }
    }
}
