package com.jobnest.service;

import com.jobnest.dto.AuthRequest;
import com.jobnest.dto.AuthResponse;
import com.jobnest.dto.RegisterRequest;
import com.jobnest.dto.UserDto;
import com.jobnest.entity.Role;
import com.jobnest.entity.User;
import com.jobnest.repository.UserRepository;
import com.jobnest.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(AuthRequest request) {
        String identifier = request.getUsername() != null ? request.getUsername().trim() : "";
        User user = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .user(mapToDto(user))
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        String uname = request.getUsername() != null ? request.getUsername().trim() : "";
        if (uname.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên đăng nhập không được để trống");
        }
        if (userRepository.existsByUsername(uname)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên đăng nhập đã tồn tại trong hệ thống");
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && userRepository.existsByEmail(request.getEmail().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được đăng ký trong hệ thống");
        }

        Role role = Role.CANDIDATE;
        if (request.getRole() != null) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (Exception ignored) {}
        }

        User user = User.builder()
                .username(request.getUsername().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .email(request.getEmail())
                .phone(request.getPhone())
                .fullName(request.getFullName())
                .companyName(role == Role.EMPLOYER ? request.getCompanyName() : null)
                .displayName(role == Role.EMPLOYER && request.getCompanyName() != null ? request.getCompanyName() : request.getFullName())
                .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);

        return AuthResponse.builder()
                .token(token)
                .user(mapToDto(saved))
                .build();
    }

    public UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .displayName(user.getDisplayName() != null ? user.getDisplayName() : user.getFullName())
                .companyName(user.getCompanyName())
                .avatarUrl(user.getAvatarUrl())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }
}
