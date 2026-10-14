package com.jobnest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(length = 150)
    private String fullName;

    @Column(length = 150)
    private String displayName;

    @Column(length = 200)
    private String companyName;

    @Column(length = 500)
    private String avatarUrl;

    @Column(length = 150)
    private String email;

    @Column(length = 50)
    private String phone;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (displayName == null || displayName.isBlank()) {
            displayName = (role == Role.EMPLOYER && companyName != null && !companyName.isBlank()) 
                    ? companyName : fullName;
        }
    }
}
