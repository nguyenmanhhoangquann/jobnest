package com.jobnest.controller;

import com.jobnest.dto.AuthRequest;
import com.jobnest.dto.AuthResponse;
import com.jobnest.dto.RegisterRequest;
import com.jobnest.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping(value = "/register", consumes = {"application/json", "application/x-www-form-urlencoded", "multipart/form-data"})
    public ResponseEntity<Map<String, Object>> register(
            @ModelAttribute RegisterRequest modelReq,
            @RequestBody(required = false) RegisterRequest bodyReq
    ) {
        RegisterRequest request = (bodyReq != null && bodyReq.getUsername() != null) ? bodyReq : modelReq;
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Đăng ký tài khoản thành công",
                "token", response.getToken(),
                "user", response.getUser()
        ));
    }
}
