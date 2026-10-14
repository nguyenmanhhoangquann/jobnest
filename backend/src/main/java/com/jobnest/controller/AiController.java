package com.jobnest.controller;

import com.jobnest.dto.AiJdResponse;
import com.jobnest.dto.AiReviewResponse;
import com.jobnest.dto.ChatDtos;
import com.jobnest.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/ai/review-cv")
    public ResponseEntity<AiReviewResponse> reviewCv(@RequestBody Map<String, Object> body) {
        Object appIdObj = body.get("applicationId");
        Long appId = appIdObj != null ? Long.valueOf(appIdObj.toString()) : 1L;
        return ResponseEntity.ok(aiService.reviewCv(appId));
    }

    @PostMapping("/ai/generate-jd")
    public ResponseEntity<AiJdResponse> generateJd(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String keywords = body.get("keywords");
        String companyName = body.get("companyName");
        return ResponseEntity.ok(aiService.generateJd(title, keywords, companyName));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatDtos.ChatResponse> chat(@RequestBody ChatDtos.ChatRequest request) {
        return ResponseEntity.ok(aiService.chat(request.getMessage(), request.getHistory()));
    }
}
