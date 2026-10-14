package com.jobnest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 150)
    private String name;

    private Integer jobCount;

    @Column(length = 100)
    private String icon;

    @Column(length = 500)
    private String image;

    @Column(columnDefinition = "TEXT")
    private String popularRolesJson;
}
