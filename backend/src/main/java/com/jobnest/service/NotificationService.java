package com.jobnest.service;

import com.jobnest.entity.Notification;
import com.jobnest.entity.User;
import com.jobnest.repository.NotificationRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Data
    @Builder
    public static class NotificationDto {
        private Long id;
        private String content;
        private Boolean isRead;
        private LocalDateTime createdAt;
    }

    public List<NotificationDto> getNotifications(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(n -> NotificationDto.builder()
                        .id(n.getId())
                        .content(n.getContent())
                        .isRead(n.getIsRead())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long id, User user) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông báo"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền thao tác trên thông báo này");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
