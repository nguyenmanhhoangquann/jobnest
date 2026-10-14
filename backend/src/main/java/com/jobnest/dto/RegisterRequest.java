package com.jobnest.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String role; // CANDIDATE, EMPLOYER
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String companyName;
    private String phone;
}
