package com.jobnest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    private LocalDateTime appliedAt;

    @Column(nullable = false, length = 30)
    private String status; // PENDING, VIEWED, ACCEPTED, REJECTED

    @Column(length = 500)
    private String cvUrl;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    private Integer aiScore;

    @Column(length = 50)
    private String aiVerdict;

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @Column(columnDefinition = "TEXT")
    private String aiStrengthsJson;

    @Column(columnDefinition = "TEXT")
    private String aiWeaknessesJson;

    @PrePersist
    public void prePersist() {
        if (appliedAt == null) appliedAt = LocalDateTime.now();
        if (status == null || status.isBlank()) status = "PENDING";
    }
}
