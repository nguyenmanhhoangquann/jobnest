package com.jobnest.controller;

import com.jobnest.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryService.CategoryResponse>> getCategories(
            @RequestParam(required = false) Integer top
    ) {
        return ResponseEntity.ok(categoryService.getCategories(top));
    }
}
