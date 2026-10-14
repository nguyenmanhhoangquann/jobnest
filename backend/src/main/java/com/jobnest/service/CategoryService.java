package com.jobnest.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobnest.entity.Category;
import com.jobnest.repository.CategoryRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;

    @Data
    @Builder
    public static class CategoryResponse {
        private Long id;
        private String slug;
        private String name;
        private Integer jobCount;
        private String icon;
        private String image;
        private List<String> popularRoles;
    }

    public List<CategoryResponse> getCategories(Integer top) {
        List<Category> all = categoryRepository.findAll();
        if (top != null && top > 0 && top < all.size()) {
            all = all.subList(0, top);
        }

        return all.stream().map(c -> {
            List<String> roles = new ArrayList<>();
            if (c.getPopularRolesJson() != null && !c.getPopularRolesJson().isBlank()) {
                try {
                    roles = objectMapper.readValue(c.getPopularRolesJson(), new TypeReference<List<String>>() {});
                } catch (Exception ignored) {}
            }
            return CategoryResponse.builder()
                    .id(c.getId())
                    .slug(c.getSlug())
                    .name(c.getName())
                    .jobCount(c.getJobCount() != null ? c.getJobCount() : 0)
                    .icon(c.getIcon())
                    .image(c.getImage())
                    .popularRoles(roles)
                    .build();
        }).collect(Collectors.toList());
    }
}
