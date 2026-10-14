package com.jobnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String role;
    private String fullName;
    private String displayName;
    private String companyName;
    private String avatarUrl;
    private String email;
    private String phone;
}
